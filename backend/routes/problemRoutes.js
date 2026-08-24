const express = require('express');
const router = express.Router();
const {
  createProblem,
  getProblems,
  getDueProblems,
  reviseProblem,
  updateProblem,
  deleteProblem,
  getStats
} = require('../controllers/problemController');

// Stats endpoint
router.get('/stats', getStats);

// Due problems endpoint
router.get('/due', getDueProblems);

// Main problem collection endpoints
router.route('/')
  .post(createProblem)
  .get(getProblems);

// Single problem mutation endpoints
router.patch('/:id/revise', reviseProblem);
router.patch('/:id', updateProblem);
router.delete('/:id', deleteProblem);

module.exports = router;
