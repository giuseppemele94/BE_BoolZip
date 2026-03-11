// importiamo la connessione al DB
const connection = require('../db/dbConnection');

// funzione per ottenere tutti i prodotti
function index(req, res) {

  // prepariamo la query
  const sql = `
        SELECT 
          products.id,
          products.name,
          products.price,
          products.description,
          products.slug,
          products.image_url,
          products.created_at,
          materials.material AS material,
          sizes.size AS size,
          categories.name AS category
        FROM products
        JOIN materials ON products.material_id = materials.id
        JOIN sizes ON products.size_id = sizes.id
        JOIN categories ON products.category_id = categories.id
          `;

  // eseguiamo la query
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });

    // creo un nuovo array di prodotti partendo dai risultati del database
    // e aggiungo/modifico il campo image_url con il percorso completo dell'immagine
    const products = results.map(product => {
      return {
        ...product, // copia tutte le proprietà originali del prodotto
        image_url: req.imagePath + product.image_url // concatena il path base con il nome dell'immagine
      }
    });

    res.json(products);

  });
}

// funzione per ottenere un prodotto per slug
function show(req, res) {

  // Prendiamo lo slug dai parametri
  const { slug } = req.params;

  // query per il prodotto
  const productSql = `
        SELECT 
          products.id,
          products.name,
          products.price,
          products.description,
          products.slug,
          products.image_url,
          materials.material AS material,
          sizes.size AS size,
          categories.name AS category
        FROM products
        JOIN materials ON products.material_id = materials.id
        JOIN sizes ON products.size_id = sizes.id
        JOIN categories ON products.category_id = categories.id
        WHERE products.slug = ?
        `;

  // query per tutte le immagini di un singolo prodotto
  const productImageSql = 'SELECT * FROM product_images WHERE product_id = ?';

  // eseguiamo la query
  connection.query(productSql, [slug], (err, productResults) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });
    if (productResults.length === 0) return res.status(404).json({ error: 'Product not found' });

    // Salviamo il risultato in una costante
    const product = productResults[0];

    // costruisco url immagine principale
    product.image_url = req.imagePath + product.image_url;

    // chiammata  slug secondaria per recupero product_image del propdotto
    connection.query(productImageSql, [product.id], (err, productImageResults) => {
      if (err) return res.status(500).json({ error: 'Database query failed' });

      // Creiamo un nuovo array "images" a partire dai risultati della query
      // imageResults è un array di oggetti come { id, product_id, image_url }
      const images = productImageResults.map(img => {

        // Per ogni oggetto immagine "img":
        return {
          // Copiamo tutte le proprietà originali dell'oggetto (id, product_id, image_url)
          ...img,

          // Sovrascriviamo image_url per creare l'URL completo
          // req.imagePath = percorso base delle immagini sul server, es: "http://localhost:3000/images/"
          // img.image_url = nome del file salvato nel DB, es: "zippo-1.jpg"
          // Risultato finale: "http://localhost:3000/images/zippo-1.jpg"
          image_url: req.imagePath + img.image_url
        };
      });

      // assegna alla proprietà "product_images" dell'oggetto product l'array di immagini
      product.product_images = images;

      res.json(product);

    });
  });
}

function getRecentProducts(req, res) {

  // query per il prodotto
    const sql = 
        `SELECT *
        FROM products
        WHERE created_at >= NOW() - INTERVAL 10 DAY
        ORDER BY created_at DESC`
    ;

    // eseguiamo la query
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Database query failed"
            });
        }

        res.json(results);
    });
}




module.exports = { index, show, getRecentProducts };