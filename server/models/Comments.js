const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    bug: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bug',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: Object,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema, 'Comments');
module.exports = Comment; 