// queries/orderQueries.js
// Mock degli ordini in memoria
let orders = [
  { id: 1, customer: "Mario Rossi", total: 100, items: [{ productId: 1, quantity: 2 }] },
  { id: 2, customer: "Luigi Bianchi", total: 200, items: [{ productId: 2, quantity: 1 }] },
];

// Funzione per ottenere tutti gli ordini
const getAllOrders = async () => orders;

// Funzione per ottenere un ordine per ID
const getOrderById = async (id) => orders.find(o => o.id === parseInt(id));

// Funzione per creare un nuovo ordine
const createOrder = async (data) => {
  const newOrder = { id: orders.length + 1, ...data };
  orders.push(newOrder);
  return newOrder;
};

// Funzione per aggiornare un ordine
const updateOrder = async (id, data) => {
  const index = orders.findIndex(o => o.id === parseInt(id));
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...data };
  return orders[index];
};

// Funzione per eliminare un ordine
const deleteOrder = async (id) => {
  const index = orders.findIndex(o => o.id === parseInt(id));
  if (index === -1) return null;
  return orders.splice(index, 1)[0];
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };