const express = require('express');
const Bug = require('../models/Bugs');
const router = express.Router();

const app = express();

//Create bug- POST API
router.post('/create',async (req, res) => {
    try {
        const newBug = new Bug(req.body);
        await newBug.save();
        res.status(201).send(bug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;