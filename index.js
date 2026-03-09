const express = require("express");
//const cors = require("cors");//CORS METTE IN RELAZIONE LE PORTE FE E BE

// IMPORTO CONNESSIONE DB
const dbConnection = require("./db/dbConnection");

const app = express();

const PORT = 3000;

//app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});