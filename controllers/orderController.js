// ==============================
// IMPORT
// ==============================

// importiamo la connessione al database
const connection = require('../db/dbConnection');

// funzione per l'invio dell'email di verifica
const { sendOrderConfirmationEmail } = require('../utils/mail');


// ==============================
// COSTANTI SPEDIZIONE
// ==============================
// (NUOVA LOGICA INTRODOTTA)

const FREE_SHIPPING_THRESHOLD = 70.00;
const SHIPPING_COST = 4.00;



// ==============================
// FUNZIONE: OTTENERE TUTTI GLI ORDINI
// ==============================
function index(req, res) {

    // query SQL per prendere tutti gli ordini
    const sql = 'SELECT * FROM orders';

    // eseguiamo la query
    connection.query(sql, (err, results) => {

        // gestione errore database
        if (err) return res.status(500).json({ error: 'Database query failed' });

        // ritorniamo tutti gli ordini
        res.json(results);

    });

}



// ==============================
// FUNZIONE: ORDINE SINGOLO
// ==============================
function show(req, res) {

    // prendiamo l'id dell'ordine dai parametri della rotta
    const { id } = req.params;

    // query per recuperare l'ordine
    const orderSql = `
        SELECT *
        FROM orders
        WHERE id = ?
    `;

    // query per recuperare i prodotti collegati all'ordine
    const productsSql = `
        SELECT 
            products.id,
            products.name,
            products.price,
            products.slug,
            products.image_url,
            order_product.quantity
        FROM order_product
        JOIN products 
        ON products.id = order_product.product_id
        WHERE order_product.order_id = ?
    `;

    // eseguiamo la prima query
    connection.query(orderSql, [id], (err, orderResults) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (orderResults.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResults[0];

        // recuperiamo i prodotti dell'ordine
        connection.query(productsSql, [id], (err, productResults) => {

            if (err) return res.status(500).json({ error: 'Database query failed' });

            order.products = productResults;

            res.json(order);

        });

    });

}



// ==============================
// FUNZIONE: CHECKOUT ORDINE
// ==============================
// crea un ordine, aggiunge prodotti e invia email
function checkout(req, res) {

    // recuperiamo i dati dal body della richiesta
    const {
        customer_name,
        customer_lastname,
        customer_phone,
        customer_email,
        customer_address,
        customer_billing_address,
        products,           // array prodotti {id, quantity}
        discount_code,
        discount_value,
        session_id
    } = req.body;



    /*
    ==========================================
    MODIFICA IMPORTANTE - VALIDAZIONE PREZZI
    ==========================================

    NON utilizziamo il prezzo inviato dal frontend.

    Il prezzo viene recuperato dal database per evitare
    manipolazioni della richiesta HTTP.
    */

    let subtotal_amount = 0;

    const orderedProducts = [];

    let completedQueries = 0;



    // ciclo sui prodotti inviati dal frontend
    products.forEach(prod => {

        // query per recuperare il prodotto reale
        const sqlProduct = `
            SELECT name, description, price
            FROM products
            WHERE id = ?
        `;

        connection.query(sqlProduct, [prod.id], (err, productResults) => {

            if (err || productResults.length === 0) {
                console.log("Errore recupero prodotto:", err || "Product not found");
                return;
            }

            const productData = productResults[0];


            /*
            ==========================================
            MODIFICA - CALCOLO SUBTOTAL DAL DATABASE
            ==========================================
            */

            subtotal_amount += productData.price * prod.quantity;


            orderedProducts.push({
                id: prod.id,
                name: productData.name,
                description: productData.description,
                quantity: prod.quantity,
                price: productData.price
            });

            completedQueries++;



            // quando tutte le query dei prodotti sono terminate
            if (completedQueries === products.length) {

                subtotal_amount = parseFloat(subtotal_amount.toFixed(2));



                /*
                ==========================================
                CALCOLO SCONTO
                ==========================================
                */

                let final_discount_value = Number(discount_value) || 0;

                if (final_discount_value > subtotal_amount) {
                    final_discount_value = subtotal_amount;
                }



                let total_after_discount = subtotal_amount - final_discount_value;



                /*
                ==========================================
                NUOVA LOGICA - SPEDIZIONE
                ==========================================
                */

                let shipping_cost = SHIPPING_COST;

                if (total_after_discount >= FREE_SHIPPING_THRESHOLD) {
                    shipping_cost = 0;
                }



                /*
                ==========================================
                CALCOLO TOTALE FINALE
                ==========================================
                */

                let total_amount = total_after_discount + shipping_cost;

                total_amount = parseFloat(total_amount.toFixed(2));



                /*
                ==========================================
                CREAZIONE ORDINE
                ==========================================
                */

                const sqlOrder = `
                    INSERT INTO orders
                    (
                    customer_name,
                    customer_lastname,
                    customer_phone,
                    customer_email,
                    customer_address,
                    customer_billing_address,
                    subtotal_amount,
                    total_amount,
                    discount_code,
                    discount_value,
                    shipping_cost,
                    session_id,
                    created_date
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())  
                `;


                connection.query(
                    sqlOrder,
                    [
                        customer_name,
                        customer_lastname,
                        customer_phone,
                        customer_email,
                        customer_address,
                        customer_billing_address,
                        subtotal_amount,
                        total_amount,
                        discount_code || null,
                        final_discount_value,
                        shipping_cost,
                        session_id
                    ],
                    (err, orderResults) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: "Database query failed" });
                        }

                        const order_id = orderResults.insertId;



                        /*
                        ==========================================
                        INSERIMENTO PRODOTTI NELLA TABELLA
                        order_product
                        ==========================================
                        */

                        orderedProducts.forEach(product => {

                            const sqlOrderProduct = `
                                INSERT INTO order_product
                                (order_id, product_id, quantity, price)
                                VALUES (?, ?, ?, ?)
                            `;

                            connection.query(
                                sqlOrderProduct,
                                [order_id, product.id, product.quantity, product.price],
                                (err) => { if (err) console.log(err); }
                            );

                        });



                        /*
                        ==========================================
                        COSTRUZIONE TABELLA EMAIL
                        ==========================================
                        */

                        let productsHtml = "";

                        orderedProducts.forEach(product => {

                            productsHtml += `
                                <tr>
                                    <td>${product.name}</td>
                                    <td>${product.description}</td>
                                    <td>${product.quantity}</td>
                                    <td>€ ${product.price}</td>
                                </tr>
                            `;
                        });



                        /*
                        ==========================================
                        CONTENUTO EMAIL
                        ==========================================
                        */

                        const htmlContent = `
                            <h2>Conferma ordine</h2>

                            <p>Ciao ${customer_name} ${customer_lastname},</p>

                            <p>Grazie per il tuo acquisto!</p>

                            <h3>Prodotti acquistati</h3>

                            <table border="1" cellpadding="5" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Descrizione</th>
                                        <th>Quantità</th>
                                        <th>Prezzo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productsHtml}
                                </tbody>
                            </table>

                            <p>Spedizione: ${shipping_cost.toFixed(2)} €</p>

                            <h3>Totale ordine: ${total_amount.toFixed(2)} €</h3>
                            <p>ID ordine: ${order_id}</p>
                        `;



                        sendOrderConfirmationEmail(
                            customer_email,
                            "Conferma ordine BoolZip",
                            htmlContent
                        );



                        res.status(201).json({
                            message: "Order created and confirmation email sent",
                            id: order_id,
                            total_amount: total_amount.toFixed(2),
                            shipping_cost: shipping_cost.toFixed(2),
                            discount_value: final_discount_value.toFixed(2)
                        });

                    }
                );

            }

        });

    });

}



// ==============================
// EXPORT
// ==============================

module.exports = {
    index,
    show,
    checkout
};