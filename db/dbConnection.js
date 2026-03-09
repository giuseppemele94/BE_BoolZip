const mysql = require(`mysql2`);

const dbConnection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: `Scarlett.212!`,
    database: `boolzip_shop`,
});

dbConnection.connect((err) => {
    if (err) throw err;
    console.log(`connected to MySQL`);
    
});

module.exports = dbConnection;