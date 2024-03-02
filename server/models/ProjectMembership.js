const mongoose = require('mongoose');

const projectMembershipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'user', 'developer', 'tester'],
        required: true
    }
});

const ProjectMembership = mongoose.model('ProjectMembership', projectMembershipSchema);
module.exports = ProjectMembership;