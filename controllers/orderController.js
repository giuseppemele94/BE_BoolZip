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

    // {
    //     "id": 1,
    //     "session_id": "sess_abc123",
    //     "created_date": "2026-03-06T16:48:08.000Z",
    //     "total_amount": "89.80",
    //     "customer_name": "Luca",
    //     "customer_email": "luca@email.it",
    //     "customer_address": "Via Roma 10 Milano",
    //     "customer_lastname": "Rossi",
    //     "customer_phone": "3331234567",
    //     "customer_billing_address,": "Via Roma 10 Milano",
    //     " discount_code,": null,
    //     ", discount_value": null
    // },

    // eseguiamo la query
    connection.query(sql, [customer_name, customer_lastname, customer_phone, custumer_email, custumer_address, customer_billing_address, total_amount, discount_code, discount_value], (err, results) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        // risposta
        res.status(201).json({
            message: 'Order created',
            id: results.insertId
        });

    });

}

module.exports = { index, show, store };