const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    symptoms: { type: String, required: true },
    diagnosis: { type: String },
    treatment: { type: String },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Patient', PatientSchema);