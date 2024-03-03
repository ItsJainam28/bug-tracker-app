const express = require('express');
const router = express.Router();
const Project = require('../models/Projects');
const authMiddleware = require('../Middleware/auth');
const User = require('../models/Users');
const ProjectMembership = require('../models/ProjectMembership');
const { check, validationResult } = require('express-validator');

//Create project- POST API
router.post('/create', authMiddleware,
[   // Validation Middlewares
    check('name', 'Name must be at least 5 characters long').isLength({ min: 5 }),
    check('description', 'Description must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Create a new project
        const projectData = req.body;
        const newProject = new Project({...projectData, createdBy: req.user._id});
        await newProject.save();

        // Add the user to the project
        try{
        // Create a new project membership
            const projectMembership = new ProjectMembership({
                user: req.user._id,
                project: newProject._id,
                role: 'Admin'
            });
        
        await projectMembership.save();
        
        }
        catch(e){
            console.log(e);
            //Delete the project if adding user to project fails
            await Project.deleteOne({ _id: newProject._id });
            return res.status(500).json({ message: 'Failed to add user to project' });
        }   
    
        res.status(201).send(newProject);    
    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get all projects for a Admin user- GET API
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const projectsMemberships = await ProjectMembership.find({ user: req.user._id });
        const projects = await Project.find({ _id: { $in: projectsMemberships.map(pm => pm.project) } });
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;