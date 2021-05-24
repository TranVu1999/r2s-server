const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const assignmentController = require('./../controllers/assignment')

// ================= POST ==================

// @route POST api/assignment
// @desc add new assignment
// @access Private
router.post('/', verifyToken, assignmentController.add)



module.exports = router;