const responseService = require('../services/response');

// @desc    Store participant response
// @route   POST /api/v1/responses
// @access  Private (Participant Only)
exports.createResponse = async (req, res) => {
  try {
    const { experimentId, taskId, response, reactionTime, accuracy } = req.body;

    // Basic validation
    if (!experimentId || !taskId || response === undefined || reactionTime === undefined || accuracy === undefined) {
       return res.status(400).json({ 
         success: false, 
         error: 'Please provide experimentId, taskId, response, reactionTime, and accuracy' 
       });
    }

    const responseData = { experimentId, taskId, response, reactionTime, accuracy };

    const newResponse = await responseService.createResponse(responseData, req.user.id);

    res.status(201).json({
      success: true,
      data: newResponse
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get results for an experiment
// @route   GET /api/v1/results/:experimentId
// @access  Private (Researcher Only)
exports.getResults = async (req, res) => {
  try {
     const results = await responseService.getResultsByExperiment(req.params.experimentId, req.user.id);

     res.status(200).json({
       success: true,
       count: results.length,
       data: results
     });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};
