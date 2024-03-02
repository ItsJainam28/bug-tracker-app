const mongoose = require('mongoose');

const bughistorySchema = new mongoose.Schema({
    bugId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bugs',
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    fieldChanged: {
        type: String,
        required: true
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }

});

const bugHistory = mongoose.model('BugHistory', bughistorySchema);
module.exports = bugHistory;