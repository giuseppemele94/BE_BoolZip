// // importiamo la connessione al database
// const connection = require("../db/dbConnection");

// // importiamo la funzione per inviare email
// const { sendOrderConfirmationEmail } = require("../utils/mail");

// /*
//     Funzione per salvare l'email del visitatore e inviare un'email di ringraziamento
// */
// function storeNewsletterEmail(req, res) {

//     // recuperiamo l'email dal body della richiesta
//     const { email } = req.body;

//     // regex per validare l'email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     // controlliamo che l'email sia valida
//     if (!email || !emailRegex.test(email)) {
//         return res.status(400).json({ error: "Email non valida" });
//     }

//     // controllo che l'email sia stata inviata
//     if (!email) {
//         return res.status(400).json({ error: "Email is required" });
//     }

//     // controlliamo se l'email esiste già
//     const checkEmailSql = "SELECT id FROM newsletter WHERE email = ?";

//     connection.query(checkEmailSql, [email], (err, results) => {

//         if (err) {
//             return res.status(500).json({ error: "Database error" });
//         }

//         // se esiste già non la inseriamo di nuovo
//         if (results.length > 0) {
//             return res.status(409).json({
//                 message: "Email già iscritta alla newsletter"
//             });
//         }
//     });

//     // query SQL per inserire l'email nella tabella newsletter
//     const sql = "INSERT INTO newsletter (email) VALUES (?)";

//     // eseguiamo la query
//     connection.query(sql, [email], (err, results) => {

//         // gestione errore DB
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ error: "Database query failed" });
//         }

//         /*
//             Costruiamo il contenuto HTML dell'email di ringraziamento
//         */
//         const htmlContent = `
//             <h2>Grazie per esserti iscritto!</h2>
//             <p>Ciao! Grazie per aver condiviso la tua email con noi. Benvenuto su <strong>BoolZip</strong>!</p>
//             <p>Ti terremo aggiornato sulle nostre novità e promozioni.</p>
//         `;

//         // inviamo l'email di ringraziamento
//         sendOrderConfirmationEmail(
//             email,                       // destinatario
//             "Benvenuto su BoolZip!",      // oggetto
//             htmlContent                   // contenuto HTML
//         );

//         // ritorniamo la risposta al frontend
//         res.status(201).json({
//             message: "Email saved and thank-you email sent"
//         });
//     });
// }

// module.exports = { storeNewsletterEmail };

const connection = require("../db/dbConnection");
const { sendOrderConfirmationEmail } = require("../utils/mail");

function storeNewsletterEmail(req, res) {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            message: "Email non valida",
        });
    }

    const checkEmailSql = "SELECT id FROM newsletter WHERE email = ?";

    connection.query(checkEmailSql, [email], (checkErr, results) => {
        if (checkErr) {
            console.log("Errore controllo email:", checkErr);
            return res.status(500).json({
                message: "Errore nel controllo dell'email",
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "Email già iscritta alla newsletter",
            });
        }

        const insertSql = "INSERT INTO newsletter (email) VALUES (?)";

        connection.query(insertSql, [email], (insertErr) => {
            if (insertErr) {
                console.log("Errore insert newsletter:", insertErr);

                if (insertErr.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Email già iscritta alla newsletter",
                    });
                }

                return res.status(500).json({
                    message: "Errore durante il salvataggio dell'email",
                });
            }

            const htmlContent = `
                <h2>Grazie per esserti iscritto!</h2>
                <p>Ciao! Grazie per aver condiviso la tua email con noi. Benvenuto su <strong>BoolZip</strong>!</p>
                <p>Ti terremo aggiornato sulle nostre novità e promozioni.</p>
            `;

            try {
                sendOrderConfirmationEmail(
                    email,
                    "Benvenuto su BoolZip!",
                    htmlContent
                );
            } catch (mailError) {
                console.log("Errore invio mail newsletter:", mailError);
            }

            return res.status(201).json({
                message: "Iscrizione alla newsletter avvenuta con successo",
            });
        });
    });
}

module.exports = { storeNewsletterEmail };