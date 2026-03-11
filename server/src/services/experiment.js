const Experiment = require('../models/Experiment');
const Task = require('../models/Task');

/**
 * Creates a new experiment and its associated tasks
 * @param {Object} experimentData - Data for the new experiment
 * @param {Array} tasksData - Array of task objects to be created
 * @param {String} researcherId - ID of the user creating the experiment
 * @returns {Object} The created experiment document
 */
exports.createExperimentWithTasks = async (experimentData, tasksData, researcherId) => {
  // 1. Create all tasks first if provided
  let taskIds = [];
  if (tasksData && tasksData.length > 0) {
    const createdTasks = await Task.insertMany(tasksData);
    taskIds = createdTasks.map(task => task._id);
  }

  // 2. Create the experiment and link it to the creator and created tasks
  const experiment = await Experiment.create({
    ...experimentData,
    createdBy: researcherId,
    tasks: taskIds
  });

  return experiment;
};

/**
 * Fetches all experiments created by a specific researcher
 * @param {String} researcherId - ID of the researcher
 * @returns {Array} Array of experiment documents
 */
exports.getExperimentsByResearcher = async (researcherId) => {
  return await Experiment.find({ createdBy: researcherId }).sort('-createdAt');
};

/**
 * Fetches a single experiment by ID and populates its task details
 * @param {String} experimentId - ID of the experiment
 * @param {String} researcherId - (Optional) ID of researcher to verify ownership
 * @returns {Object} The experiment document
 */
exports.getExperimentById = async (experimentId, researcherId) => {
  const query = { _id: experimentId };
  
  // If researcherId is provided, ensure they only fetch their own experiments
  if (researcherId) {
    query.createdBy = researcherId;
  }

  const experiment = await Experiment.findOne(query).populate('tasks');
  
  if (!experiment) {
    throw new Error(`Experiment not found with id of ${experimentId}`);
  }
  
  return experiment;
};

/**
 * Updates an experiment document
 * @param {String} experimentId - ID of the experiment
 * @param {Object} updateData - Data to update
 * @param {String} researcherId - ID of researcher to verify ownership
 * @returns {Object} The updated experiment document
 */
exports.updateExperiment = async (experimentId, updateData, researcherId) => {
  const experiment = await Experiment.findOneAndUpdate(
    { _id: experimentId, createdBy: researcherId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!experiment) {
    throw new Error(`Experiment not found or user not authorized to update`);
  }

  return experiment;
};

/**
 * Deletes an experiment and cascades the deletion to its associated tasks
 * @param {String} experimentId - ID of the experiment
 * @param {String} researcherId - ID of researcher to verify ownership
 * @returns {Boolean} true if successful
 */
exports.deleteExperiment = async (experimentId, researcherId) => {
  const experiment = await Experiment.findOne({ _id: experimentId, createdBy: researcherId });

  if (!experiment) {
    throw new Error(`Experiment not found or user not authorized to delete`);
  }

  // Find all associated tasks
  const taskIds = experiment.tasks;

  // Delete the experiment (using deleteOne instead of remove due to Mongoose 7+)
  await experiment.deleteOne();

  // Cascade delete all associated Tasks
  if (taskIds && taskIds.length > 0) {
    await Task.deleteMany({ _id: { $in: taskIds } });
  }

  return true;
};
