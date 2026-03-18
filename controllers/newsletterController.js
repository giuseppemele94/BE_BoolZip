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
                                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

                                    <!-- Immagine header -->
                                    <img src="https://i.imgur.com/5oet7UF.jpeg" alt="Welcome" style="width: 100%; display: block;">

                                    <div style="padding: 20px; text-align: center;">
                                    <h2 style="color: #333;">Benvenuto su BoolZip 🎉</h2>

                                    <p style="color: #555; font-size: 16px;">
                                        Grazie per esserti iscritto! Siamo felici di averti con noi 🚀
                                    </p>

                                    <p style="color: #777; font-size: 14px;">
                                        Ti terremo aggiornato su novità, funzionalità e promozioni esclusive.
                                    </p>

                                    <!-- Bottone -->
                                    <a href="http://localhost:5173/"
                                        style="display: inline-block; margin-top: 20px; padding: 12px 25px;
                                                background-color: #4CAF50; color: #ffffff; text-decoration: none;
                                                border-radius: 5px; font-weight: bold;">
                                        Scopri BoolZip
                                    </a>
                                    </div>

                                    <!-- Footer -->
                                    <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
                                    © 2026 BoolZip - Tutti i diritti riservati
                                    </div>

                                </div>
                                </div>
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