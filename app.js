const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Cost calculator.');
  });

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

    const centers = {
        'C1': { 'A': 3, 'B': 2, 'C': 8 },
        'C2': { 'D': 12, 'E': 25, 'F': 15 },
        'C3': { 'G': 0.5, 'H': 1, 'I': 2 }
    };

    const distanceToL1 = {
        'C1': 3,
        'C2': 2.5,
        'C3': 2
    };

    let totalCost = 0;

    // Calculate cost for products A, B, C at pickup center C1
    let weightABC = (order['A'] || 0) * PRODUCT_WEIGHTS['A'] + (order['B'] || 0) * PRODUCT_WEIGHTS['B'] + (order['C'] || 0) * PRODUCT_WEIGHTS['C'];
    if (weightABC > 0) {
        let costABC = weightABC <= 5 ? UNIT_COST['0-5'] : UNIT_COST['0-5'] + Math.ceil((weightABC - 5) / 5) * UNIT_COST['5+'];
        totalCost += costABC * distanceToL1['C1'];
    }
    // console.log("Cost for A, B, C at C1:", totalCost);

    // Empty vehicle travel from L1 to C2 for pickup
    let weightDEF = (order['D'] || 0) * PRODUCT_WEIGHTS['D'] + (order['E'] || 0) * PRODUCT_WEIGHTS['E'] + (order['F'] || 0) * PRODUCT_WEIGHTS['F'];
    if (weightDEF > 0) {
        totalCost += UNIT_COST['0-5'] * distanceToL1['C2'];
    }
    // console.log("Empty vehicle travel from L1 to C2:", totalCost);

    // Calculate cost for products D, E, F at pickup center C2
    if (weightDEF > 0) {
        let costDEF = weightDEF <= 5 ? UNIT_COST['0-5'] : UNIT_COST['0-5'] + Math.ceil((weightDEF - 5) / 5) * UNIT_COST['5+'];
        totalCost += costDEF * distanceToL1['C2'];
    }
    // console.log("Cost for D, E, F at C2:", totalCost);

    // Empty vehicle travel from L1 to C3 for pickup
    let weightGHI = (order['G'] || 0) * PRODUCT_WEIGHTS['G'] + (order['H'] || 0) * PRODUCT_WEIGHTS['H'] + (order['I'] || 0) * PRODUCT_WEIGHTS['I'];
    if (weightGHI > 0) {
        totalCost += UNIT_COST['0-5'] * distanceToL1['C3'];
    }
    // console.log("Empty vehicle travel from L1 to C3:", totalCost);

    // Calculate cost for products G, H, I at pickup center C3
    if (weightGHI > 0) {
        let costGHI = weightGHI <= 5 ? UNIT_COST['0-5'] : UNIT_COST['0-5'] + Math.ceil((weightGHI - 5) / 5) * UNIT_COST['5+'];
        totalCost += costGHI * distanceToL1['C3'];
    }
    // console.log("Cost for G, H, I at C3:", totalCost);

    if(totalCost===0)  return "Your order is Empty";

    return totalCost;
}


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
