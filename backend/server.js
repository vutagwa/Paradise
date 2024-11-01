// server.js
const express = require('express');
const fetch = require('node-fetch'); // Make sure to install this package if you haven't
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Ensure you have dotenv installed and require it

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Endpoint to identify e-waste using Roboflow
app.post('/identify-ewaste', async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const response = await fetch(`${process.env.ROBOFLOW_MODEL_ENDPOINT}?api_key=${process.env.ROBOFLOW_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageUrl,
      }),
    });
    
    const data = await response.json();

    // Extract relevant information for e-waste identification
    const ewasteTypes = data.predictions.map(prediction => prediction.class);
    res.status(200).json({ ewasteTypes });
  } catch (error) {
    console.error('Error identifying e-waste:', error);
    res.status(500).send('Error identifying e-waste');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
