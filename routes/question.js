const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const questionController = require('./../controllers/question')

// ================= POST ==================

// @route POST api/class
// @desc add new question
// @access Private
router.post('/', verifyToken, questionController.add)


// ================= PUT ==================

// @route PUT api/class
// @desc edit question
// @access Private
router.put('/:id', verifyToken, questionController.edit)


// ================= DELETE ==================

// @route DELETE api/class
// @desc delete question
// @access Private
router.delete('/:id', verifyToken, questionController.delete)



// ================= GET ==================

// @route GET api/class
// @desc get list question
// @access Private
router.get('/', verifyToken, questionController.getListQuestion)


// @route GET api/class/:id
// @desc get question detail
// @access Private
router.get('/:id', verifyToken, questionController.getDetail)

module.exports = router;