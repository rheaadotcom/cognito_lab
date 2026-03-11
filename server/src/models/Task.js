const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please specify the task type (e.g., stroop, flaker)'],
      trim: true
    },
    stimulus: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide the task stimulus details']
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide the correct answer for the task']
    },
    duration: {
      type: Number,
      required: [true, 'Please specify the duration in milliseconds']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
