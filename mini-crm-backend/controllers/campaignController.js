const db = require('../db');
const axios = require('axios');

// Send campaign
const sendCampaign = async (req, res) => {
  try {
    const { audienceId, message } = req.body;
    const [audience] = await db.query('SELECT query FROM audiences WHERE id = ?', [audienceId]);
    const [customers] = await db.query(audience[0].query);

    for (const customer of customers) {
      const personalizedMessage = message.replace('{name}', customer.name);
      await axios.post('http://localhost:3000/api/campaign/update-status', {
        customerId: customer.id,
        message: personalizedMessage,
        status: Math.random() < 0.9 ? 'SENT' : 'FAILED'
      });
    }

    res.status(200).send('Campaign sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending campaign');
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { customerId, message, status } = req.body;
    await db.query('INSERT INTO communications_log (customer_id, message, status) VALUES (?, ?, ?)', [customerId, message, status]);
    res.status(200).send('Delivery status updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating delivery status');
  }
};

module.exports = { sendCampaign, updateDeliveryStatus };
