// app.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// API Endpoint
app.post('/calculateCost', (req, res) => {
    const order = req.body;
    const cost = calculateCost(order);
    res.json({ cost });
});

// Function to calculate cost
function calculateCost(order) {
    const PRODUCT_WEIGHTS = {
        'A': 3,
        'B': 2,
        'C': 8,
        'D': 12,
        'E': 25,
        'F': 15,
        'G': 0.5,
        'H': 1,
        'I': 2
    };
    const UNIT_COST = {
        '0-5': 10,
        '5+': 8
    };

    let totalWeight = 0;
    for (const product in order) {
        totalWeight += order[product] * PRODUCT_WEIGHTS[product];
    }

    let totalCost = 0;
    if (totalWeight <= 5) {
        totalCost = UNIT_COST['0-5'];
    } else {
        totalCost = UNIT_COST['0-5'] + Math.ceil((totalWeight - 5) / 5) * UNIT_COST['5+'];
    }

    return totalCost;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
