const amqp = require('amqplib/callback_api');
const db = require('./db');

// Consume customer data from message queue
const consumeCustomerData = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = 'customer_data';

      channel.assertQueue(queue, {
        durable: false
      });

      channel.consume(queue, async (msg) => {
        const customer = JSON.parse(msg.content.toString());
        await db.query('INSERT INTO customers (id, name, email, total_spends, last_visit) VALUES (?, ?, ?, ?, ?)', [customer.id, customer.name, customer.email, customer.total_spends, customer.last_visit]);
        console.log('Customer data ingested:', customer);
      }, {
        noAck: true
      });
    });
  });
};

consumeCustomerData();
