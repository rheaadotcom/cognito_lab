const Response = require('../models/Response');
const Experiment = require('../models/Experiment');
const Task = require('../models/Task');

/**
 * Creates a new participant response
 * @param {Object} responseData - Data for the new response
 * @param {String} participantId - ID of the participant submitting the response
 * @returns {Object} The created response document
 */
exports.createResponse = async (responseData, participantId) => {
  const { experimentId, taskId } = responseData;

  // Verify experiment exists
  const experiment = await Experiment.findById(experimentId);
  if (!experiment) {
     throw new Error(`Experiment not found with id of ${experimentId}`);
  }

  // Verify task exists and belongs to the experiment
  const task = await Task.findById(taskId);
  if (!task) {
      throw new Error(`Task not found with id of ${taskId}`);
  }

  // Ensure task is actually part of this experiment
  if (!experiment.tasks.includes(taskId)) {
      throw new Error(`Task ${taskId} does not belong to Experiment ${experimentId}`);
  }

  const response = await Response.create({
    ...responseData,
    participantId
  });

  return response;
};

/**
 * Fetches all responses for a specific experiment
 * @param {String} experimentId - ID of the experiment
 * @param {String} researcherId - ID of the researcher requesting the data
 * @returns {Array} Array of response documents
 */
exports.getResultsByExperiment = async (experimentId, researcherId) => {
  // First, verify the experiment belongs to the researcher requesting the data
  const experiment = await Experiment.findOne({ _id: experimentId, createdBy: researcherId });
  
  if (!experiment) {
    throw new Error(`Experiment not found or you are not authorized to view its results`);
  }

  // Fetch all responses, optionally populate task or participant details if needed later
  const responses = await Response.find({ experimentId }).sort('-timestamp');
  
  return responses;
};
