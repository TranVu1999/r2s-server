const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const topicController = require('./../controllers/topic')

// ================= POST ==================

// @route POST api/class
// @desc add new class
// @access Private
router.post('/', verifyToken, topicController.add)

module.exports = router;