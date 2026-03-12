// importiamo la connessione al database
const connection = require('../db/dbConnection');

// funzione per l'invio dell'email di verifica
const { sendOrderConfirmationEmail } = require('../utils/mail');


// funzione per ottenere tutti gli ordini
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




//funzione per ottenere un singolo ordine con i prodotti collegati
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

    // eseguiamo la prima query (ordine)
    connection.query(orderSql, [id], (err, orderResults) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        // se non esiste l'ordine
        if (orderResults.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // salviamo l'ordine
        const order = orderResults[0];



        // seconda query per recuperare i prodotti dell'ordine
        connection.query(productsSql, [id], (err, productResults) => {

            if (err) return res.status(500).json({ error: 'Database query failed' });


            // aggiungiamo i prodotti dentro l'oggetto ordine
            order.products = productResults;


            // ritorniamo l'ordine con i prodotti
            res.json(order);

        });

    });

}




// // funzione per creare un nuovo ordine (checkout)
// function store(req, res) {

//     // recuperiamo i dati dal body
//     const {
//         customer_name,
//         customer_lastname,
//         customer_phone,
//         customer_email,
//         customer_address,
//         customer_billing_address,
//         total_amount,
//         discount_code,
//         discount_value,
//         session_id
//     } = req.body;

//     // query SQL per inserire un nuovo ordine
//     const sql = `
//         INSERT INTO orders
//         (
//             customer_name,
//             customer_lastname,
//             customer_phone,
//             customer_email,
//             customer_address,
//             customer_billing_address,
//             total_amount,
//             discount_code,
//             discount_value,
//             session_id,
//             created_date
//         )
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
//     `;

//     // eseguiamo la query
//     connection.query(
//         sql,
//         [
//             customer_name,
//             customer_lastname,
//             customer_phone,
//             customer_email,
//             customer_address,
//             customer_billing_address,
//             total_amount,
//             discount_code,
//             discount_value,
//             session_id
//         ],
//         (err, results) => {

//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({
//                     error: "Database query failed"
//                 });
//             }

//             /* 
//                PREPARAZIONE CONTENUTO EMAIL DI CONFERMA ORDINE
//                costruiamo il contenuto HTML della mail che verrà inviata al cliente
//             */
//             const htmlContent = `
//                 <h2>Grazie per il tuo ordine, ${customer_name}!</h2>
//                 <p>Il tuo ordine è stato ricevuto correttamente.</p>
//                 <p><strong>ID Ordine:</strong> ${results.insertId}</p>
//                 <p><strong>Totale ordine:</strong> €${total_amount}</p>
//                 <p>Ti contatteremo presto per la spedizione.</p>
//             `;

//             /*
//                INVIO EMAIL DI CONFERMA ORDINE
//                utilizziamo la funzione sendOrderConfirmationEmail definita in utils/mail.js
//                passando:
//                - email del cliente
//                - oggetto della mail
//                - contenuto HTML della mail
//             */
//             sendOrderConfirmationEmail(
//                 customer_email,
//                 "Conferma ordine BoolZip",
//                 htmlContent
//             );

//             // ritorniamo l'id dell'ordine appena creato
//             res.status(201).json({
//                 message: "Order created",

//                 // insertId è l'id generato automaticamente dal database
//                 id: results.insertId
//             });

//         }
//     );
// }



// // funzione per aggiungere un prodotto ad un ordine
// function addProductToOrder(req, res) {

//     // recuperiamo l'id dell'ordine dai parametri della richiesta
//     const order_id = req.params.id;

//     // recuperiamo product_id e quantity dal body della richiesta JSON
//     const { product_id, quantity } = req.body;

//     // query SQL per prendere il prezzo del prodotto dal database
//     const productSql = `SELECT price FROM products WHERE id = ?`;

//     // eseguiamo la query per ottenere il prezzo del prodotto
//     connection.query(productSql, [product_id], (err, productResults) => {

//         // se c'è un errore nella query, ritorniamo errore 500
//         if (err) {
//             return res.status(500).json({ error: "Database query failed" });
//         }

//         // se il prodotto non esiste nel database, ritorniamo errore 404
//         if (productResults.length === 0) {
//             return res.status(404).json({ error: "Product not found" });
//         }

//         // salviamo il prezzo del prodotto in una costante
//         const price = productResults[0].price;

//         // query SQL per inserire il prodotto nella tabella order_product
//         const orderProductSql = `
//             INSERT INTO order_product
//             (order_id, product_id, quantity, price)
//             VALUES (?, ?, ?, ?)
//         `;

//         // eseguiamo la query di inserimento nella tabella order_product
//         connection.query(
//             orderProductSql,
//             [order_id, product_id, quantity, price], // valori da inserire
//             (err, results) => {

//                 // se c'è un errore durante l'inserimento, logghiamolo e ritorniamo errore 500
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).json({
//                         error: "Database query failed"
//                     });
//                 }

//                 // se tutto va bene, ritorniamo status 201 con messaggio di conferma
//                 res.status(201).json({
//                     message: "Product added to order"
//                 });

//             }
//         );

//     });

// }



// funzione di checkout: crea un ordine, aggiunge prodotti e invia email di conferma
function checkout(req, res) {

    // recuperiamo i dati dal body della richiesta
    const {
        customer_name,
        customer_lastname,
        customer_phone,
        customer_email,
        customer_address,
        customer_billing_address,
        products,           // array di prodotti {id, quantity, price}
        discount_code,      // opzionale
        discount_value,     // opzionale
        session_id
    } = req.body;

    // calcoliamo il totale dell'ordine partendo dai prodotti
    let total_amount = products.reduce((acc, prod) => acc + prod.price * prod.quantity, 0);

    // arrotondiamo a due decimali
    total_amount = parseFloat(total_amount.toFixed(2));

    // query SQL per inserire l'ordine nella tabella orders
    const sqlOrder = `
        INSERT INTO orders
        (
            customer_name,
            customer_lastname,
            customer_phone,
            customer_email,
            customer_address,
            customer_billing_address,
            total_amount,
            discount_code,
            discount_value,
            session_id,
            created_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    // eseguiamo la query per creare l'ordine
    connection.query(
        sqlOrder,
        [
            customer_name,
            customer_lastname,
            customer_phone,
            customer_email,
            customer_address,
            customer_billing_address,
            total_amount,
            discount_code || null, // se non presente, inseriamo null
            discount_value || 0,   // se non presente, inseriamo 0
            session_id
        ],
        (err, orderResults) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database query failed" });
            }

            // salviamo l'id dell'ordine appena creato
            const order_id = orderResults.insertId;

            // ciclo asincrono per recuperare descrizione e inserire in order_product
            const orderedProducts = [];

            products.forEach(prod => {

                // query per prendere la descrizione e il nome del prodotto dal DB
                const sqlProduct = `SELECT name, description, price FROM products WHERE id = ?`;

                connection.query(sqlProduct, [prod.id], (err, productResults) => {

                    if (err || productResults.length === 0) {
                        console.log("Errore recupero prodotto:", err || "Product not found");
                        return;
                    }

                    const productData = productResults[0];

                    // inseriamo il prodotto nella tabella order_product
                    const sqlOrderProduct = `
                        INSERT INTO order_product
                        (order_id, product_id, quantity, price)
                        VALUES (?, ?, ?, ?)
                    `;

                    connection.query(
                        sqlOrderProduct,
                        [order_id, prod.id, prod.quantity, productData.price],
                        (err) => { if (err) console.log(err); }
                    );

                    // aggiungiamo i dati completi del prodotto per l'email
                    orderedProducts.push({
                        name: productData.name,
                        description: productData.description,
                        quantity: prod.quantity,
                        price: productData.price
                    });

                    // quando tutti i prodotti sono pronti, inviamo l'email
                    if (orderedProducts.length === products.length) {

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
                            <h2>Conferma ordine</h2>

                            <p>Ciao ${customer_name} ${customer_lastname},</p>

                            <p>Grazie per il tuo acquisto! Il tuo ordine è stato ricevuto.</p>

                            <h3>Dati cliente</h3>
                            <p>
                                Nome: ${customer_name} ${customer_lastname}<br>
                                Telefono: ${customer_phone}<br>
                                Email: ${customer_email}
                            </p>

                            <h3>Indirizzo spedizione</h3>
                            <p>${customer_address}</p>

                            <h3>Indirizzo fatturazione</h3>
                            <p>${customer_billing_address}</p>

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

                            <h3>Sconto applicato</h3>
                                <p>
                                Codice sconto: ${discount_code ? discount_code : 'Nessuno'}<br>
                                Valore: ${discount_value ? `- ${discount_value.toFixed(2)} €` : '- 0.00 €'}
                                </p>

                            
                            <h3>Totale ordine:  ${total_amount.toFixed(2)} €</h3>
                            <p>ID ordine: ${order_id}</p>

                            <p>Grazie per aver acquistato su BoolZip!</p>
                        `;

                        // importiamo la funzione da mail.js
                        const { sendOrderConfirmationEmail } = require('../utils/mail');

                        // inviamo l'email di conferma ordine
                        sendOrderConfirmationEmail(
                            customer_email,
                            "Conferma ordine BoolZip",
                            htmlContent
                        );

                        // ritorniamo la risposta al frontend
                        res.status(201).json({
                            message: "Order created and confirmation email sent",
                            id: order_id,
                            total_amount: total_amount.toFixed(2),
                            discount_value: discount_value ? discount_value.toFixed(2) : "0.00"
                        });
                    }

                });

            });

        }
    );

}

// esportiamo le funzioni
module.exports = {
    index,
    show,
    // store,
    // addProductToOrder,
    checkout
};