const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    caseDescription: { type: String, required: true },
    discussion: { type: String }
});

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);