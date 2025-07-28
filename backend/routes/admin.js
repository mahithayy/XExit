const express = require('express');
const router = express.Router();
const {
  getPendingResignations,
  processResignation,
  scheduleInterview,
  getExitResponses
} = require('../controllers/hrController');

const { authenticateAdmin } = require('../middleware/auth');

// View all pending resignations
router.get('/resignations', authenticateAdmin, getPendingResignations);

// Approve or reject resignation
router.put('/conclude_resignation', authenticateAdmin, processResignation);

// Schedule exit interview
router.post('/schedule_interview', authenticateAdmin, scheduleInterview);

router.get("/exit_responses", authenticateAdmin, getExitResponses);
module.exports = router;
