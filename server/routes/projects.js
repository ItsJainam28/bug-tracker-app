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

//Get all projects for a  user- GET API
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const projectsMemberships = await ProjectMembership.find({ user: req.user._id });
        const projects = await Project.find({ _id: { $in: projectsMemberships.map(pm => pm.project) } });
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Delete a project- DELETE API

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id});
        const projectMemberships = await ProjectMembership.findOne({ project: req.params.id, user: req.user._id});
        if (projectMemberships.role !== 'Admin') {
            return res.status(401).json({ message: 'You are not authorized to delete this project' });
        }
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await Project.deleteOne({ _id: req.params.id });
        await ProjectMembership.deleteMany({ project: req.params.id });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Update a project- PUT API

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id});
        const projectMemberships = await ProjectMembership.findOne({ project: req.params.id, user: req.user._id});
        if (projectMemberships.role !== 'Admin') {
            return res.status(401).json({ message: 'You are not authorized to update this project' });
        }
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const updatedProject = await Project.updateOne({ _id: req.params.id }, req.body);
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get project by id- GET API
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id });
        const projectMemberships = await ProjectMembership.findOne({ project: req.params.id, user: req.user._id});
        if (!projectMemberships) {
            return res.status(401).json({ message: 'You are not authorized to view this project' });
        }
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;