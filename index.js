const express = require("express");
//const cors = require("cors");//CORS METTE IN RELAZIONE LE PORTE FE E BE

// IMPORTO CONNESSIONE DB
const dbConnection = require("./db/dbConnection");

const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const discountRouter = require("./routers/discountRouter");

const notFoundPage = require("./middlewares/notFoundPage");
const errorHandler = require("./middlewares/errorHandler");


const app = express();

const PORT = 3000;

//app.use(cors());
app.use(express.json());


// rotte API
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/discounts", discountRouter);

// middleware gestione errori
app.use(notFoundPage);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})




