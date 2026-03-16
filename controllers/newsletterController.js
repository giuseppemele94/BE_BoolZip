// importiamo la connessione al database
const connection = require("../db/dbConnection");

// importiamo la funzione per inviare email
const { sendOrderConfirmationEmail } = require("../utils/mail");

/*
    Funzione per salvare l'email del visitatore e inviare un'email di ringraziamento
*/
function storeNewsletterEmail(req, res) {

    // recuperiamo l'email dal body della richiesta
    const { email } = req.body;

    // regex per validare l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // controlliamo che l'email sia valida
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "Email non valida" });
    }

    // controllo che l'email sia stata inviata
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    // query SQL per inserire l'email nella tabella newsletter
    const sql = "INSERT INTO newsletter (email) VALUES (?)";

    // eseguiamo la query
    connection.query(sql, [email], (err, results) => {

        // gestione errore DB
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query failed" });
        }

        /*
            Costruiamo il contenuto HTML dell'email di ringraziamento
        */
        const htmlContent = `
            <h2>Grazie per esserti iscritto!</h2>
            <p>Ciao! Grazie per aver condiviso la tua email con noi. Benvenuto su <strong>BoolZip</strong>!</p>
            <p>Ti terremo aggiornato sulle nostre novità e promozioni.</p>
        `;

        // inviamo l'email di ringraziamento
        sendOrderConfirmationEmail(
            email,                       // destinatario
            "Benvenuto su BoolZip!",      // oggetto
            htmlContent                   // contenuto HTML
        );

        // ritorniamo la risposta al frontend
        res.status(201).json({
            message: "Email saved and thank-you email sent"
        });
    });
}

module.exports = { storeNewsletterEmail };