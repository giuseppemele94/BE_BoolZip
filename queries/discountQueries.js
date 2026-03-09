// queries/discountQueries.js
// Mock degli sconti in memoria
let discounts = [
  { id: 1, code: "SALDI10", value: 10, description: "Sconto 10%" },
  { id: 2, code: "BLACKFRIDAY", value: 25, description: "Sconto Black Friday" },
];

// Funzione per ottenere tutti gli sconti
const getAllDiscounts = async () => discounts;

// Funzione per ottenere uno sconto per ID
const getDiscountById = async (id) => discounts.find(d => d.id === parseInt(id));

// Funzione per creare un nuovo sconto
const createDiscount = async (data) => {
  const newDiscount = { id: discounts.length + 1, ...data };
  discounts.push(newDiscount);
  return newDiscount;
};

// Funzione per aggiornare uno sconto
const updateDiscount = async (id, data) => {
  const index = discounts.findIndex(d => d.id === parseInt(id));
  if (index === -1) return null;
  discounts[index] = { ...discounts[index], ...data };
  return discounts[index];
};

// Funzione per eliminare uno sconto
const deleteDiscount = async (id) => {
  const index = discounts.findIndex(d => d.id === parseInt(id));
  if (index === -1) return null;
  return discounts.splice(index, 1)[0];
};

module.exports = { getAllDiscounts, getDiscountById, createDiscount, updateDiscount, deleteDiscount };