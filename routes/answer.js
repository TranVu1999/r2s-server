const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const answerController = require('./../controllers/answer')

// ================= POST ==================

// @route POST api/answer
// @desc add new answer
// @access Private
router.post('/', verifyToken, answerController.add)

// ================= GET ==================

// @route POST api/answer
// @desc add new answer
// @access Private
router.get('/', verifyToken, answerController.getListComment)


module.exports = router;