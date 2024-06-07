const amqp = require('amqplib');
const pool = require('./db');

const processAudience = async (msg) => {
    const { audienceId, rules } = JSON.parse(msg.content.toString());
    const connection = await pool.getConnection();
    try {
        // Simulating processing and message sending
        await new Promise(resolve => setTimeout(resolve, 1000));

        const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
        await connection.query('UPDATE communications_log SET status = ? WHERE id = ?', [status, audienceId]);
        console.log(`Processed audience ID ${audienceId} with status ${status}`);
    } catch (error) {
        console.error('Error processing audience:', error);
    } finally {
        connection.release();
    }
};

const startConsumer = async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');
        const channel = await conn.createChannel();
        await channel.assertQueue('audienceQueue', { durable: true });

        channel.consume('audienceQueue', async (msg) => {
            if (msg !== null) {
                await processAudience(msg);
                channel.ack(msg);
            }
        }, { noAck: false });

        console.log('Consumer started and awaiting messages...');
    } catch (error) {
        console.error('Error starting consumer:', error);
    }
};

startConsumer().catch(console.error);
