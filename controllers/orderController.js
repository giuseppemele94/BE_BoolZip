// importiamo la connessione al database
const connection = require('../db/dbConnection');

// funzione INDEX → ottenere tutti gli ordini
function index(req, res) {

    // prepariamo la query
    const sql = 'SELECT * FROM orders';

    // eseguiamo la query
    connection.query(sql, (err, results) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        // ritorniamo gli ordini
        res.json(results);

    });

}


// SHOW → un ordine per id
function show(req, res) {
    // prendiamo l'id dai parametri
    const id = parseInt(req.params.id);

    // query SQL
    const sql = 'SELECT * FROM orders WHERE id = ?';

    // eseguiamo la query
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Order not found' });

        // ritorniamo l'ordine
        res.json(results[0]);
    });
}


// funzione per creare un nuovo ordine
function store(req, res) {

    // recuperiamo i dati dal body della richiesta
    const { customer_name, customer_lastname, customer_phone, custumer_email, custumer_address, customer_billing_address, total_amount, discount_code, discount_value } = req.body;

    // prepariamo la query SQL
    const sql = `
        INSERT INTO orders (customer_name, customer_lastname, customer_phone, custumer_email, custumer_address, customer_billing_address, total_amount, discount_code, discount_value)
        VALUES (?, ?, ?, ?)
    `;


    // eseguiamo la query
    connection.query(sql, [customer_name, customer_lastname, customer_phone, custumer_email, custumer_address, customer_billing_address, total_amount, discount_code, discount_value], (err, results) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        // risposta
        res.status(201).json({
            message: 'Order created',
            // L'ID della nuova risorsa (ordine) generata dal database,
            // tipicamente restituito da un'operazione di INSERT in MySQL tramite `results.insertId`
            id: results.insertId
        });

    });

}

module.exports = { index, show, store };