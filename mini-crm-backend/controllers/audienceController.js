const db = require('../db');

// Check audience size based on rules
const checkAudienceSize = async (req, res) => {
  try {
    const { rules } = req.body;
    const query = buildAudienceQuery(rules);
    const [results] = await db.query(query);
    res.status(200).send({ audienceSize: results.length });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error checking audience size');
  }
};

// Save audience rules
const saveAudience = async (req, res) => {
  try {
    const { name, rules } = req.body;
    const query = buildAudienceQuery(rules);
    await db.query('INSERT INTO audiences (name, query) VALUES (?, ?)', [name, query]);
    res.status(200).send('Audience saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving audience');
  }
};

// Helper function to build query from rules
const buildAudienceQuery = (rules) => {
  let query = 'SELECT * FROM customers WHERE ';
  rules.forEach((rule, index) => {
    if (index > 0) query += ` ${rule.operator} `;
    query += `(${rule.field} ${rule.condition} ${rule.value})`;
  });
  return query;
};

module.exports = { checkAudienceSize, saveAudience };
