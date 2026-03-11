const express = require('express');
const { createResponse, getResults } = require('../controllers/response');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Route for participants to submit responses
router.post('/responses', protect, authorize('participant', 'researcher'), createResponse);

// Route for researchers to get aggregated results
router.get('/results/:experimentId', protect, authorize('researcher'), getResults);

module.exports = router;
