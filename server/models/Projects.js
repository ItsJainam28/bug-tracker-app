const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', projectSchema);