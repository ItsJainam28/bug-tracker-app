const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Signup route
router.post('/signup', 
[   // Validation Middlewares
    check('name', 'Name must be at least 5 characters long').isLength({ min: 5 }),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 5 characters, with at least one uppercase, lowercase, number, and special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{5,}$/),
],async (req, res) => {
    try{
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        // Create a new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        //Save the user and generate a token
        await user.save();
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.status(201).send({user, token});
    }catch(e){
        if (e.code === 11000) { // Duplicate Key Error
            return res.status(400).json({ error: 'Email is already in use' });
        }
        // Handle other validation errors
        res.status(500).json({ error: e.message }); 
    
    }
});

// Login route
router.post('/login', async (req, res) => {
    try{
        // Find the user
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Compare the passwords
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Generate a token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.status(200).send({user, token});
    }catch(e){
        res.status(500).json({ error: e.message });
    }
})

module.exports = router;

