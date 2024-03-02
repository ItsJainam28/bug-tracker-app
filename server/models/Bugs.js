const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function(title) {
                return title.length >= 5;
            },
            message: 'Title must be at least 5 characters long'
        }
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum:['New', 'Open', 'In Progress', 'Resolved', 'Closed'], // Limit to specific values
        required: true
    },
    priority: {
        type: String,
        enum:['Critical', 'High', 'Medium', 'Low'],  // Limit to specific values
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    assigne: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    },
    BugHistoryRecordID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BugHistory'
    }

});

const Bug = mongoose.model('Bugs', bugSchema);
module.exports = Bug;