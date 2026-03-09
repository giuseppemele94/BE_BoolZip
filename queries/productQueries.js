// queries/productQueries.js
const connection = require("../db/dbConnection"); // Assicurati che il path sia corretto

// Funzione per ottenere tutti i prodotti
const getAllProducts = async () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM products", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Funzione per ottenere un prodotto per slug
const getProductBySlug = async (slug) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM products WHERE slug = ?",
      [slug],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null); // restituisci il primo prodotto trovato o null
      }
    );
  });
};

// Funzione per creare un nuovo prodotto
const createProduct = async (data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO products (name, slug, category, price) VALUES (?, ?, ?, ?)",
      [data.name, data.slug, data.category, data.price],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...data });
      }
    );
  });
};

// Funzione per aggiornare un prodotto
const updateProduct = async (slug, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE products SET name = ?, category = ?, price = ? WHERE slug = ?",
      [data.name, data.category, data.price, slug],
      (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return resolve(null); // nessun prodotto trovato
        resolve({ slug, ...data });
      }
    );
  });
};

// Funzione per eliminare un prodotto
const deleteProduct = async (slug) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM products WHERE slug = ?",
      [slug],
      (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return resolve(null); // nessun prodotto trovato
        resolve({ slug });
      }
    );
  });
};

module.exports = { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };