const express = require('express');
const {
  getExperiments,
  getExperiment,
  updateExperiment,
  createExperiment,
  deleteExperiment,
  getPublicExperiment
} = require('../controllers/experiment');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public route for participants to fetch experiment details
router.get('/public/:id', getPublicExperiment);

// Apply protection and researcher authorization to all routes below
router.use(protect);
router.use(authorize('researcher'));

router
  .route('/')
  .post(createExperiment)
  .get(getExperiments);

router
  .route('/:id')
  .get(getExperiment)
  .patch(updateExperiment)
  .delete(deleteExperiment);

module.exports = router;
