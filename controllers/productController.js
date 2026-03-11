// importiamo la connessione al DB
const connection = require('../db/dbConnection');

// funzione per ottenere tutti i prodotti
function index(req, res) {

  /* recuperiamo eventuali parametri di ricerca e filtro dalla query string
     esempio chiamate possibili:
     /api/products?search=zippo
     /api/products?category=2
     /api/products?size=1&material=3
  */
  const { search, category, size, material, price_min, price_max } = req.query;

  /* 
     trasformiamo la query statica in una query dinamica
     "WHERE 1=1" ci permette di aggiungere facilmente i filtri con AND
  */
  let sql = `
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
        WHERE 1 = 1
          `;

  /* 
     array che conterrà i valori dei parametri della query
     verrà passato a connection.query per evitare SQL injection
  */
  let params = [];

  /* 
     filtro di ricerca testuale sul nome del prodotto
     utilizziamo LIKE per permettere ricerche parziali
  */
  if (search) {
    sql += " AND products.name LIKE ?";
    params.push(`%${search}%`);
  }

  /* 
     filtro per categoria
  */
  if (category) {
    sql += " AND products.category_id = ?";
    params.push(category);
  }

  /* 
     filtro per taglia
  */
  if (size) {
    sql += " AND products.size_id = ?";
    params.push(size);
  }

  /* 
     filtro per materiale
  */
  if (material) {
    sql += " AND products.material_id = ?";
    params.push(material);
  }
  
  // filtro per prezzo minimo
  if (price_min) {
    sql += " AND products.price >= ?";
    params.push(price_min);
  }
  // filtro per prezzo massimo
  if (price_max) {
    sql += " AND products.price <= ?";
    params.push(price_max);
  }
  /* esempio chiamate possibili:
    /api/products?price_min=10&price_max=50
    /api/products?category=2&price_max=100&search=zippo
  */  
  // eseguiamo la query
  connection.query(sql, params, (err, results) => {
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
        materials.id AS material_id,
        materials.material AS material,
        sizes.id AS size_id,
        sizes.size AS size,
        categories.id AS category_id,
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

    // chiammata slug secondaria per recupero product_image del prodotto
    connection.query(productImageSql, [product.id], (err, productImageResults) => {
      if (err) return res.status(500).json({ error: 'Database query failed' });

      // Creiamo un nuovo array "images" a partire dai risultati della query
      const images = productImageResults.map(img => {

        return {
          ...img,

          // costruzione url completo immagine
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

  // query per ottenere gli ultimi prodotti creati negli ultimi 10 giorni
  const sql = `
    SELECT *
    FROM products
    WHERE created_at >= NOW() - INTERVAL 10 DAY
    ORDER BY created_at DESC
    LIMIT 4
  `;

  // eseguiamo la query
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database query failed"
      });
    }

    // aggiungiamo l'imagePath a ciascun prodotto
    const productsWithImages = results.map(product => {
      return {
        ...product,
        image_url: req.imagePath + product.image_url
      };
    });

    res.json(productsWithImages);
  });
}

function getTopProducts(req, res) {
  const sql = `SELECT 
                      p.id,
                      p.name,
                      p.price,
                      p.description,
                      p.image_url,
                      p.slug,
                      SUM(op.quantity) AS total_sold
                  FROM order_product op
                  JOIN products p ON p.id = op.product_id
                  GROUP BY p.id, p.name, p.price, p.description, p.image_url, p.slug
                  ORDER BY total_sold DESC
                  LIMIT 4;
                  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });

    const products = results.map(p => ({
      ...p,
      image_url: req.imagePath + p.image_url
    }));

    res.json(products);
  });
}

module.exports = { index, show, getRecentProducts, getTopProducts };