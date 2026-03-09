const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;


const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const discountRouter = require("./routers/discountRouter");

const notFoundPage = require("./middlewares/notFoundPage");
const errorHandler = require("./middlewares/errorHandler");

// import del middelware di gestione di path imgs
const imagePathMiddleware = require("./middlewares/imagePath");

// attivazioone middelware di gestione di path imgs
app.use(imagePathMiddleware);

// Attivo cartella public per uso file statici
app.use(express.static('public'));


//app.use(cors());
app.use(express.json());


// rotte API
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/discounts", discountRouter);

// middleware gestione errori
app.use(notFoundPage);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})




