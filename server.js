const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON and allow cross-origin requests
app.use(express.json());
app.use(cors());

// Route to handle the fetch data request
app.get('/fetch-data', async (req, res) => {
    const { username, accessKey } = req.query;  // Extract username and access key from query params

    // Check if both username and accessKey are provided
    if (!username || !accessKey) {
        return res.status(400).json({ error: 'Username and access key are required' });
    }

    const url = "https://api-cloud.browserstack.com/app-automate/device_tier_limits.json";

    const authHeader = 'Basic ' + Buffer.from(`${username}:${accessKey}`).toString('base64');  // Encoding credentials for Basic Auth

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from BrowserStack API');
        }

        const data = await response.json();
        res.json(data);  // Send the data back to the frontend
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
