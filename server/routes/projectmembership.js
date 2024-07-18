const express = require('express');
const rounter = express.Router();
const ProjectMembership = require('../models/ProjectMembership');
const authMiddleware = require('../Middleware/auth');
const Project = require('../models/Projects');
const User = require('../models/Users');
const router = require('./projects');
const mongoose = require('mongoose');


// Add user to project- POST API
router.post('/addUser', authMiddleware, async(req, res) => {
    try{
     
        if(req.user.role !== 'Admin'){
            return res.status(403).json({ message: 'You are not authorized to perform this operation' });
        }
        const { projectId, userId, role } = req.body;
        let projectObjId = new mongoose.Types.ObjectId(projectId);
        console.log(projectObjId);
        const project = await Project.findById(projectObjId);
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        console.log("Project found");
        let userObjId = new mongoose.Types.ObjectId(userId);
        console.log("User ID: ", userObjId);
        const user = await User.findById(userObjId);
        console.log("User found");
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        //Check if the user is already a member of the project
        const existingMembership = await ProjectMembership.findOne({ user: userId, project: projectId });
        if(existingMembership){
            return res.status(400).json({ message: 'User is already a member of the project' });
        }
        const projectMembership = new ProjectMembership({ user: userId, project: projectId, role });
        await projectMembership.save();
        console.log("Project Membership created");
        res.status(201).send(projectMembership);

    }catch(e){
        res.status(500).json({ message: e.message });
    }
})

module.exports = router;