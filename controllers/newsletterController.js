// importiamo la connessione al database
const connection = require("../db/dbConnection");

// importiamo la funzione per inviare email
const { sendOrderConfirmationEmail } = require("../utils/mail");

// Funzione per salvare l'email del visitatore e inviare un'email di ringraziamento
function storeNewsletterEmail(req, res) {

    // recuperiamo l'email dal body della richiesta
    const { email } = req.body;

    // regex per validare l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // controlliamo che l'email sia valida
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            message: "Email non valida",
        });
    }

    // controlliamo se l'email esiste già
    const checkEmailSql = "SELECT id FROM newsletter WHERE email = ?";

    connection.query(checkEmailSql, [email], (checkErr, results) => {
        if (checkErr) {
            console.log("Errore controllo email:", checkErr);
            return res.status(500).json({
                message: "Errore nel controllo dell'email",
            });
        }

        // se esiste già non la inseriamo di nuovo
        if (results.length > 0) {
            return res.status(409).json({
                message: "Email già iscritta alla newsletter",
            });
        }

        // query SQL per inserire l'email nella tabella newsletter
        const insertSql = "INSERT INTO newsletter (email) VALUES (?)";

        // eseguiamo la query passando l'email ricevuta dal frontend
        connection.query(insertSql, [email], (insertErr) => {

            // se si verifica un errore durante l'inserimento nel database
            if (insertErr) {

                // stampiamo l'errore nel terminale per debug
                console.log("Errore insert newsletter:", insertErr);

                // controlliamo se l'errore è dovuto a un duplicato (email già presente)
                if (insertErr.code === "ER_DUP_ENTRY") {

                    // ritorniamo una risposta al frontend indicando che l'email esiste già
                    return res.status(409).json({
                        message: "Email già iscritta alla newsletter",
                    });
                }

                // se l'errore è diverso da un duplicato ritorniamo errore generico
                return res.status(500).json({
                    message: "Errore durante il salvataggio dell'email",
                });
            }
            //  Costruiamo il contenuto HTML dell'email di ringraziamento
            const htmlContent = `
                <h2>Grazie per esserti iscritto!</h2>
                <p>Ciao! Grazie per aver condiviso la tua email con noi. Benvenuto su <strong>BoolZip</strong>!</p>
                <p>Ti terremo aggiornato sulle nostre novità e promozioni.</p>
            `;

            // inviamo l'email di ringraziamento
            try {
                sendOrderConfirmationEmail(
                    email,                       // destinatario
                    "Benvenuto su BoolZip!",     // oggetto
                    htmlContent                  // contenuto HTML
                );

                // se si verifica un errore durante l'invio dell'email di ringraziamento
            } catch (mailError) {

                // stampiamo l'errore nel terminale per poterlo analizzare durante il debug
                console.log("Errore invio mail newsletter:", mailError);

            }

            // ritorniamo la risposta al frontend
            return res.status(201).json({
                message: "Iscrizione alla newsletter avvenuta con successo",
            });
        });
    });
}

module.exports = { storeNewsletterEmail };