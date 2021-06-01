const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const traineeAssignmentController = require('./../controllers/traineeAssignment')

// ================= POST ==================

// @route POST api/trainee-assignment
// @desc add new trainee assignment
// @access Public
router.post('/', verifyToken, traineeAssignmentController.add)




module.exports = router;