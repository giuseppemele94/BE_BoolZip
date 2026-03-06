const mysql = require(`mysql2`);

const conncection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: `Scarlett.212!`,
    database: ``,
});

conncection.connect((err) => {
    if (err) throw err;
    console.log(`connected to MySQL`);
    
});

module.exports = conncection;