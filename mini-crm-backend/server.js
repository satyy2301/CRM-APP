// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
