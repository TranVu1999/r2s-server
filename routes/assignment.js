const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const assignmentController = require('./../controllers/assignment')

// ================= POST ==================

// @route POST api/assignment
// @desc add new assignment
// @access Private
router.post('/', verifyToken, assignmentController.add)



// ================= PUT ==================

// @route PUT api/assignment
// @desc update assignment
// @access Private
router.put('/:id', verifyToken, assignmentController.update)



// ================= GET ==================

// @route GET api/assignment
// @desc get list assignment
// @access Private
router.get('/', verifyToken, assignmentController.getListAssignment)


// ================= DELETE ==================

// @route DELETE api/assignment
// @desc delete assignment
// @access Private
router.delete('/:id', verifyToken, assignmentController.delete)



module.exports = router;