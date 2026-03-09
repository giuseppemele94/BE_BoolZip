const express = require("express");
const app = express();

const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const discountRouter = require("./routers/discountRouter");

const notFoundPage = require("./middlewares/notFoundPage");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

// rotte API
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/discounts", discountRouter);

// middleware gestione errori
app.use(notFoundPage);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});