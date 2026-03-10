const db = require("../db/dbConnection");

function index(req, res){

  const sql = "SELECT * FROM coupons";

  db.query(sql, (err, results) => {

    if(err){
      console.error(err);
      return res.status(500).json({
        error: "Errore database"
      });
    }

    res.json(results);

  });

};



function checkCoupon(req, res){

  const { code } = req.body;

  const sql = "SELECT * FROM coupons WHERE code = ?";

  db.query(sql, [code], (err, results) => {

    if(err){
      console.error(err);
      return res.status(500).json({
        error: "Errore database"
      });
    }

    if(results.length === 0){
      return res.status(404).json({
        valid: false,
        message: "Codice sconto non valido"
      });
    }

    const coupon = results[0];

    const today = new Date();
    const start = new Date(coupon.start_date);
    const end = new Date(coupon.end_date);
    // Converte le date di inizio e fine del coupon (dal DB) in oggetti Date
    // In questo modo possiamo fare confronti diretti con today
    if(today < start || today > end){
      return res.json({
        valid: false,
        message: "Coupon scaduto"
      });
    }
    // Se oggi è prima della data di inizio o dopo la data di fine
    // il coupon non è valido → ritorna valid: false con messaggio
    res.json({
      valid: true,
      discount: coupon.discount_value
    });

  });

};

module.exports = { index, checkCoupon };