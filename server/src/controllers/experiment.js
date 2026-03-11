const experimentService = require('../services/experiment');

// @desc    Create new experiment
// @route   POST /api/v1/experiments
// @access  Private (Researcher Only)
exports.createExperiment = async (req, res) => {
  try {
    const { title, description, instructions, tasks } = req.body;

    // Validate fundamental fields
    if (!title || !description || !instructions) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide title, description, and instructions' 
      });
    }

    const experimentData = { title, description, instructions };
    
    // Pass the business logic down to the service layer
    const experiment = await experimentService.createExperimentWithTasks(
      experimentData, 
      tasks, 
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: experiment
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all experiments for logged in researcher
// @route   GET /api/v1/experiments
// @access  Private (Researcher Only)
exports.getExperiments = async (req, res) => {
  try {
    const experiments = await experimentService.getExperimentsByResearcher(req.user.id);

    res.status(200).json({
      success: true,
      count: experiments.length,
      data: experiments
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single experiment
// @route   GET /api/v1/experiments/:id
// @access  Private (Researcher Only)
exports.getExperiment = async (req, res) => {
  try {
    const experiment = await experimentService.getExperimentById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: experiment
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// @desc    Update experiment
// @route   PATCH /api/v1/experiments/:id
// @access  Private (Researcher Only)
exports.updateExperiment = async (req, res) => {
  try {
    const experiment = await experimentService.updateExperiment(
      req.params.id, 
      req.body, 
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: experiment
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// @desc    Delete experiment
// @route   DELETE /api/v1/experiments/:id
// @access  Private (Researcher Only)
exports.deleteExperiment = async (req, res) => {
  try {
    await experimentService.deleteExperiment(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
      res.status(404).json({ success: false, error: err.message });
  }
};
// @desc    Get public experiment (for participants)
// @route   GET /api/v1/experiments/public/:id
// @access  Public
exports.getPublicExperiment = async (req, res) => {
  try {
    const experiment = await experimentService.getExperimentById(req.params.id);

    res.status(200).json({
      success: true,
      data: experiment
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};
