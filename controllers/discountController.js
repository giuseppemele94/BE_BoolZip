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
// Funzione che verifica se un coupon inviato dal frontend è valido

  const { code } = req.body;
// Recupera il codice coupon dal corpo della richiesta (.body configura coupon dal FE come quelli del DB) 
  const sql = "SELECT * FROM coupons WHERE code = ?";

  db.query(sql, [code], (err, results) => {
  // Prepara la query SQL per cercare il coupon nel database
  // Il ? verrà sostituito in modo sicuro dal valore di code (evita SQL injection)
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
    // Se la query non ha trovato alcun coupon con quel codice
    // significa che il codice non esiste → ritorna 404
    const coupon = results[0];
    // Coupon contiene campi come: code, discount_value, start_date, end_date

    const today = new Date();
    // Crea un oggetto Date con la data e ora correnti sul server
    // Serve per confrontare se il coupon è valido "oggi"
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