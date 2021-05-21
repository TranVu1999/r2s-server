const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const questionController = require('./../controllers/question')

// ================= POST ==================

// @route POST api/class
// @desc add new question
// @access Private
router.post('/', verifyToken, questionController.add)

module.exports = router;