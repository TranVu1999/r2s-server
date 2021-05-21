const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const questionController = require('./../controllers/question')

// ================= POST ==================

// @route POST api/class
// @desc add new question
// @access Private
router.post('/', verifyToken, questionController.add)


// ================= GET ==================

// @route GET api/class
// @desc get list question
// @access Private
router.get('/', verifyToken, questionController.getListQuestion)

module.exports = router;