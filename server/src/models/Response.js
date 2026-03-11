const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    experimentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Experiment',
      required: true
    },
    taskId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
      required: true
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Participant response must be recorded']
    },
    reactionTime: {
      type: Number,
      required: [true, 'Reaction time is required (ms)']
    },
    accuracy: {
      type: Boolean,
      required: [true, 'Response accuracy must be evaluated']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Response', responseSchema);
