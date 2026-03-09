// queries/productQueries.js
// Mock dei prodotti in memoria
let products = [
  { id: 1, name: "Prodotto A", slug: "prodotto-a", category: "Elettronica", price: 100 },
  { id: 2, name: "Prodotto B", slug: "prodotto-b", category: "Casa", price: 50 },
];

// Funzione per ottenere tutti i prodotti
const getAllProducts = async () => products;

// Funzione per ottenere un prodotto per slug
const getProductBySlug = async (slug) => products.find(p => p.slug === slug);

// Funzione per creare un nuovo prodotto
const createProduct = async (data) => {
  const newProduct = { id: products.length + 1, ...data };
  products.push(newProduct);
  return newProduct;
};

// Funzione per aggiornare un prodotto
const updateProduct = async (slug, data) => {
  const index = products.findIndex(p => p.slug === slug);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  return products[index];
};

// Funzione per eliminare un prodotto
const deleteProduct = async (slug) => {
  const index = products.findIndex(p => p.slug === slug);
  if (index === -1) return null;
  return products.splice(index, 1)[0];
};

module.exports = { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };