// routes/riskAssessment.js
const express = require('express');
const router = express.Router();
const { predictRisk } = require('../services/riskPrediction'); // Importing AI logic

// POST /api/risk-assessment
router.post('/', async (req, res) => {
    const { age, symptoms, treatment } = req.body;

    try {
        // Call the AI prediction function (you need to implement this)
        const riskScore = await predictRisk(age, symptoms, treatment);
        res.json({ riskScore });
    } catch (err) {
        res.status(500).json({ msg: 'Error calculating risk score' });
    }
});

module.exports = router;
