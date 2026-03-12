const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurazione del trasportatore SMTP
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Funzione per inviare email
function sendOrderConfirmationEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: '"BoolZip Shop" <noreply@boolzip.com>',
        to,             // destinatario
        subject,        // oggetto email
        html: htmlContent // corpo della mail in HTML
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Errore invio email:", err);
        } else {
            console.log("Email inviata con successo:", info.response);
        }
    });
}

module.exports = { sendOrderConfirmationEmail };