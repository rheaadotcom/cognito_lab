const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an experiment title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    instructions: {
      type: String,
      required: [true, 'Please provide experiment instructions']
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
        required: true
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experiment', experimentSchema);
