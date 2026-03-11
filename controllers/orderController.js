// importiamo la connessione al database
const connection = require('../db/dbConnection');


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




// funzione per creare un nuovo ordine (checkout)
function store(req, res) {

    // recuperiamo i dati dal body
    const {
        customer_name,
        customer_lastname,
        customer_phone,
        customer_email,
        customer_address,
        customer_billing_address,
        total_amount,
        discount_code,
        discount_value,
        session_id
    } = req.body;

    // query SQL per inserire un nuovo ordine
    const sql = `
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

    // eseguiamo la query
    connection.query(
        sql,
        [
            customer_name,
            customer_lastname,
            customer_phone,
            customer_email,
            customer_address,
            customer_billing_address,
            total_amount,
            discount_code,
            discount_value,
            session_id
        ],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: "Database query failed"
                });
            }

            // ritorniamo l'id dell'ordine appena creato
            res.status(201).json({
                message: "Order created",

                // insertId è l'id generato automaticamente dal database
                id: results.insertId
            });

        }
    );
}



// funzione per aggiungere un prodotto ad un ordine
function addProductToOrder(req, res) {

    // recuperiamo l'id dell'ordine dai parametri della richiesta
    const order_id = req.params.id;

    // recuperiamo product_id e quantity dal body della richiesta JSON
    const { product_id, quantity } = req.body;

    // query SQL per prendere il prezzo del prodotto dal database
    const productSql = `SELECT price FROM products WHERE id = ?`;

    // eseguiamo la query per ottenere il prezzo del prodotto
    connection.query(productSql, [product_id], (err, productResults) => {

        // se c'è un errore nella query, ritorniamo errore 500
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }

        // se il prodotto non esiste nel database, ritorniamo errore 404
        if (productResults.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // salviamo il prezzo del prodotto in una costante
        const price = productResults[0].price;

        // query SQL per inserire il prodotto nella tabella order_product
        const orderProductSql = `
            INSERT INTO order_product
            (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        `;

        // eseguiamo la query di inserimento nella tabella order_product
        connection.query(
            orderProductSql,
            [order_id, product_id, quantity, price], // valori da inserire
            (err, results) => {

                // se c'è un errore durante l'inserimento, logghiamolo e ritorniamo errore 500
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        error: "Database query failed"
                    });
                }

                // se tutto va bene, ritorniamo status 201 con messaggio di conferma
                res.status(201).json({
                    message: "Product added to order"
                });

            }
        );

    });

}



// esportiamo le funzioni
module.exports = {
    index,
    show,
    store,
    addProductToOrder
};