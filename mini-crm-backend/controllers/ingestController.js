const db = require('../db');

// Ingest customer data
const ingestCustomer = async (req, res) => {
  try {
    const { id, name, email, total_spends, last_visit } = req.body;
    await db.query('INSERT INTO customers (id, name, email, total_spends, last_visit) VALUES (?, ?, ?, ?, ?)', [id, name, email, total_spends, last_visit]);
    res.status(200).send('Customer data ingested successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error ingesting customer data');
  }
};

// Ingest order data
const ingestOrder = async (req, res) => {
  try {
    const { id, customer_id, amount, date } = req.body;
    await db.query('INSERT INTO orders (id, customer_id, amount, date) VALUES (?, ?, ?, ?)', [id, customer_id, amount, date]);
    res.status(200).send('Order data ingested successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error ingesting order data');
  }
};

module.exports = { ingestCustomer, ingestOrder };
