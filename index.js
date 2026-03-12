const express = require("express");
const app = express();

// carica le variabili di ambiente dal file .env
require('dotenv').config();
// usa la porta definita nelle variabili di ambiente,
// se non esiste usa la porta 3000
const port = process.env.PORT || 3000;

// Importiamo il middleware Cors
const cors = require("cors");

// Middleware per il CORS
app.use(cors({
    origin:'http://localhost:5173'
}));


//import dei router 
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const discountRouter = require("./routers/discountRouter");
const newsletterRouter = require("./routers/newsletterRouter");


// import del middelware di gestione di rotta inesistente
const notFoundPage = require("./middlewares/notFoundPage");

// import del middelware di gestione errore interno 500
const errorHandler = require("./middlewares/errorHandler");

// import del middelware di gestione di path imgs
const imagePathMiddleware = require("./middlewares/imagePath");

// attivazioone middelware di gestione di path imgs
app.use(imagePathMiddleware);

// Attivo cartella public per uso file statici
app.use(express.static('public'));

// Registro il body-parser per "application/json"
app.use(express.json());


// rotte API
 app.use("/api/products", productRouter);
 app.use("/api/orders", orderRouter);
 app.use("/api/discounts", discountRouter);
 app.use("/api/newsletter", newsletterRouter);

// registriamo middelware di gestione rotta inesistente
app.use(notFoundPage);

// registriamo middelware di gestione err 500
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})




