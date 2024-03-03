const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(name) {
                return name.length >= 5;
            },
            message: 'Name must be at least 5 characters long'
        }
    },
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(password) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{5,}$/.test(password); 
            },
            message: 'Password must be at least 5 characters long'
        }
    },
    role: {
        type: String,
        enum: ['Admin', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;
