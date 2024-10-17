const express = require('express');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const doctorAuth = require('../middleware/doctorAuth');
const router = express.Router();

// Add a new patient (doctor only)
router.post('/', auth, doctorAuth, async (req, res) => {
    const { name, age, symptoms, diagnosis, treatment } = req.body;
    try {
        const patient = new Patient({
            name, age, symptoms, diagnosis, treatment, doctor: req.userId
        });
        await patient.save();
        res.json(patient);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get all patients for a doctor
router.get('/', auth, doctorAuth, async (req, res) => {
    try {
        const patients = await Patient.find({ doctor: req.userId });
        res.json(patients);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;