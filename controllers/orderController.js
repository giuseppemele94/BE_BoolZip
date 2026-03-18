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



// funzione di checkout: crea un ordine, aggiunge prodotti e invia email di conferma
function checkout(req, res) {

    // recuperiamo i dati dal body della richiesta inviati dal frontend
    const {
        customer_name,
        customer_lastname,
        customer_phone,
        customer_email,
        customer_address,
        customer_billing_address,
        products,           // array prodotti {id, quantity}
        discount_code,      // codice sconto opzionale
        discount_value,     // valore dello sconto opzionale
        session_id          // id sessione carrello
    } = req.body;



    /*
    =================================================
    VALIDAZIONE DATI CLIENTE
    =================================================
    controlliamo che tutti i dati principali siano presenti
    e che rispettino un formato minimo accettabile
    */

    // validiamo il nome
    if (!customer_name || customer_name.trim().length < 2) {
        return res.status(400).json({ error: "Nome non valido" });
    }

    // validiamo il cognome
    if (!customer_lastname || customer_lastname.trim().length < 2) {
        return res.status(400).json({ error: "Cognome non valido" });
    }

    // regex per validare il numero di telefono
    const phoneRegex = /^[0-9+ ]{8,15}$/;

    // controlliamo che il telefono sia valido
    if (!customer_phone || !phoneRegex.test(customer_phone)) {
        return res.status(400).json({ error: "Telefono non valido" });
    }

    // regex per validare l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // controlliamo che l'email sia valida
    if (!customer_email || !emailRegex.test(customer_email)) {
        return res.status(400).json({ error: "Email non valida" });
    }

    // validiamo indirizzo spedizione
    if (!customer_address || customer_address.trim().length < 5) {
        return res.status(400).json({ error: "Indirizzo di spedizione non valido" });
    }

    // validiamo indirizzo fatturazione
    if (!customer_billing_address || customer_billing_address.trim().length < 5) {
        return res.status(400).json({ error: "Indirizzo di fatturazione non valido" });
    }

    // controlliamo che esista almeno un prodotto nell'ordine
    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Nessun prodotto nell'ordine" });
    }



    /*
    =================================================
    VALIDAZIONE PREZZI
    =================================================

    per sicurezza NON utilizziamo il prezzo inviato
    dal frontend, perché potrebbe essere manipolato.

    recuperiamo il prezzo reale dal database.
    */

    // inizializziamo il subtotale dell'ordine
    let subtotal_amount = 0;

    // array che conterrà i prodotti completi recuperati dal DB
    const orderedProducts = [];

    // contatore per sapere quando tutte le query sono terminate
    let completedQueries = 0;



    // ciclo sui prodotti inviati dal frontend
    products.forEach(prod => {

        // controlliamo che il prodotto abbia id e quantità validi
        if (!prod.id || !prod.quantity || prod.quantity <= 0) {
            return;
        }

        // query per recuperare nome, descrizione e prezzo reale del prodotto
        const sqlProduct = `
            SELECT name, description, price
            FROM products
            WHERE id = ?
        `;

        // eseguiamo la query
        connection.query(sqlProduct, [prod.id], (err, productResults) => {

            // se il prodotto non esiste o c'è errore lo segnaliamo
            if (err || productResults.length === 0) {
                console.log("Errore recupero prodotto:", err || "Product not found");
                return;
            }

            // recuperiamo il prodotto dal database
            const productData = productResults[0];



            /*
            ==========================================
            CALCOLO SUBTOTALE ORDINE
            ==========================================
            */

            // aggiungiamo il prezzo * quantità al subtotale
            subtotal_amount += productData.price * prod.quantity;



            // salviamo i dati completi del prodotto per email e DB
            orderedProducts.push({
                id: prod.id,
                name: productData.name,
                description: productData.description,
                quantity: prod.quantity,
                price: productData.price
            });

            // aumentiamo il contatore delle query completate
            completedQueries++;



            // quando tutte le query dei prodotti sono terminate
            if (completedQueries === products.length) {

                // arrotondiamo il subtotale a due decimali
                subtotal_amount = parseFloat(subtotal_amount.toFixed(2));



                /*
                ==========================================
                CALCOLO SCONTO
                ==========================================
                */

                // convertiamo lo sconto in numero
                let final_discount_value = Number(discount_value) || 0;

                // evitiamo che lo sconto superi il subtotale
                if (final_discount_value > subtotal_amount) {
                    final_discount_value = subtotal_amount;
                }



                /*
                ==========================================
                CALCOLO TOTALE DOPO SCONTO
                ==========================================
                */

                // sottraiamo lo sconto dal subtotale
                let total_after_discount = subtotal_amount - final_discount_value;



                /*
                ==========================================
                CALCOLO SPEDIZIONE
                ==========================================
                */

                // costo base spedizione
                const SHIPPING_COST = 3.99;

                // soglia per spedizione gratuita
                const FREE_SHIPPING_THRESHOLD = 70;

                // inizializziamo il costo spedizione
                let shipping_cost = SHIPPING_COST;

                // se il totale supera la soglia la spedizione diventa gratuita
                if (total_after_discount >= FREE_SHIPPING_THRESHOLD) {
                    shipping_cost = 0;
                }



                /*
                ==========================================
                CALCOLO TOTALE FINALE
                ==========================================
                */

                // aggiungiamo il costo spedizione al totale
                let total_amount = total_after_discount + shipping_cost;

                // arrotondiamo il totale finale
                total_amount = parseFloat(total_amount.toFixed(2));



                /*
                ==========================================
                CREAZIONE ORDINE NEL DATABASE
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

                // eseguiamo la query di inserimento ordine
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

                        // gestione errore database
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: "Database query failed" });
                        }

                        // recuperiamo l'id dell'ordine appena creato
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
                        COSTRUIAMO LA TABELLA DEI PRODOTTI PER L'EMAIL
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
                        CREIAMO IL CONTENUTO HTML DELL'EMAIL
                        */

                       const htmlContent = `
                                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">

                                            <div style="text-align: center; margin-bottom: 20px;">
                                                 <img src="https://i.imgur.com/7xnILGS.jpeg" alt="BoolZip" style="max-width: 180px;">
                                            </div>

                                            <h2 style="color: #111;">Conferma ordine</h2>

                                            <p>Ciao <strong>${customer_name} ${customer_lastname}</strong>,</p>

                                            <p>Grazie per il tuo acquisto! Il tuo ordine è stato ricevuto 🎉</p>

                                            <h3 style="margin-top: 20px; color: #222;">Dati cliente</h3>
                                            <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                                                Nome: ${customer_name} ${customer_lastname}<br>
                                                Telefono: ${customer_phone}<br>
                                                Email: ${customer_email}
                                            </p>

                                            <h3 style="margin-top: 20px; color: #222;">Indirizzo spedizione</h3>
                                            <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                                                ${customer_address}
                                            </p>

                                            <h3 style="margin-top: 20px; color: #222;">Indirizzo fatturazione</h3>
                                            <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                                                ${customer_billing_address}
                                            </p>

                                            <h3 style="margin-top: 20px; color: #222;">Prodotti acquistati</h3>

                                            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                                <thead>
                                                    <tr style="background-color: #f4f4f4;">
                                                        <th style="padding: 8px; border: 1px solid #ddd;">Nome</th>
                                                        <th style="padding: 8px; border: 1px solid #ddd;">Descrizione</th>
                                                        <th style="padding: 8px; border: 1px solid #ddd;">Quantità</th>
                                                        <th style="padding: 8px; border: 1px solid #ddd;">Prezzo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${productsHtml}
                                                </tbody>
                                            </table>

                                            <h3 style="margin-top: 20px; color: #222;">Sconto applicato</h3>
                                            <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                                                Codice sconto: ${discount_code ? discount_code : 'Nessuno'}<br>
                                                Valore: ${final_discount_value > 0 ? `<span style="color: #e53935;">- ${final_discount_value.toFixed(2)} €</span>` : '- 0.00 €'}
                                            </p>

                                            <p style="margin-top: 10px;">
                                                Spedizione: <strong>${shipping_cost.toFixed(2)} €</strong>
                                            </p>

                                            <h3 style="margin-top: 20px; color: #000;">
                                                Totale ordine: <span style="color: #4CAF50;">${total_amount.toFixed(2)} €</span>
                                            </h3>

                                            <p style="margin-top: 20px;">
                                                Grazie per aver acquistato su <strong>BoolZip</strong> ❤️
                                            </p>

                                        </div>
                                        `;

                        // importiamo la funzione che invia l'email
                        const { sendOrderConfirmationEmail } = require('../utils/mail');

                        // inviamo l'email di conferma ordine al cliente
                        sendOrderConfirmationEmail(
                            customer_email,
                            "Conferma ordine BoolZip",
                            htmlContent
                        );

                        // ritorniamo la risposta al frontend
                        res.status(201).json({
                            message: "Order created and confirmation email sent",
                            id: order_id,
                            subtotal_amount: subtotal_amount.toFixed(2),
                            shipping_cost: shipping_cost.toFixed(2),
                            total_amount: total_amount.toFixed(2),
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