const Project = require('../models/Project');

// @desc  Get all projects
// @route GET /api/projects
const getProjects = async (req, res) => {
  try {
    const { avenue, status } = req.query;
    let query = {};
    if (avenue && avenue !== 'All') query.avenue = avenue;
    if (status && status !== 'All') query.status = status;
    const projects = await Project.find(query).sort({ date: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single project by ID
// @route GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create project (Admin)
// @route POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, avenue, status, date, location, description } = req.body;
    const bannerUrl = req.file ? req.file.path : (req.body.bannerUrl || '');
    const project = await Project.create({
      title,
      avenue: avenue || 'Community Service',
      status: status || 'Completed',
      date,
      location,
      description,
      bannerUrl
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update project (Admin)
// @route PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, avenue, status, date, location, description } = req.body;
    project.title       = title       || project.title;
    project.avenue      = avenue      || project.avenue;
    project.status      = status      || project.status;
    project.date        = date        || project.date;
    project.location    = location    || project.location;
    project.description = description || project.description;
    if (req.file) project.bannerUrl = req.file.path;
    else if (req.body.bannerUrl !== undefined) project.bannerUrl = req.body.bannerUrl;

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete project (Admin)
// @route DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
