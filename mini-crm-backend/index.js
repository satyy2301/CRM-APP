const express = require('express');
const bodyParser = require('body-parser');
const { verifyToken } = require('./auth');
const pool = require('./db');
const amqp = require('amqplib');

const app = express();
app.use(bodyParser.json());

app.post('/api/customers', async (req, res) => {
    const { name, email, total_spends, number_of_visits, last_visit } = req.body;
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query('INSERT INTO customers (name, email, total_spends, number_of_visits, last_visit) VALUES (?, ?, ?, ?, ?)', [name, email, total_spends, number_of_visits, last_visit]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.post('/api/orders', async (req, res) => {
    const { customer_id, order_amount, order_date } = req.body;
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query('INSERT INTO orders (customer_id, order_amount, order_date) VALUES (?, ?, ?)', [customer_id, order_amount, order_date]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.post('/api/audience/save', async (req, res) => {
    const { name, rules } = req.body;
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query('INSERT INTO communications_log (audience_name, audience_rules, status) VALUES (?, ?, ?)', [name, JSON.stringify(rules), 'PENDING']);
        const audienceId = result.insertId;
        
        // Publish message to RabbitMQ
        const conn = await amqp.connect('amqp://localhost');
        const channel = await conn.createChannel();
        await channel.assertQueue('audienceQueue', { durable: true });
        channel.sendToQueue('audienceQueue', Buffer.from(JSON.stringify({ audienceId, rules })), { persistent: true });
        
        res.status(201).json({ id: audienceId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
