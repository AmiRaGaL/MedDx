const express = require('express');
const CommunityPost = require('../models/CommunityPost');
const auth = require('../middleware/auth');
const doctorAuth = require('../middleware/doctorAuth');
const router = express.Router();

// Add a new community post (doctor only)
router.post('/', auth, doctorAuth, async (req, res) => {
    const { title, caseDescription, discussion } = req.body;
    try {
        const post = new CommunityPost({
            doctor: req.userId, title, caseDescription, discussion
        });
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get all community posts (all users)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await CommunityPost.find().populate('doctor', 'name');
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;