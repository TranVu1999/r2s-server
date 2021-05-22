const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const feedbackController = require('./../controllers/feedback')

// ================= POST ==================

// @route POST api/class
// @desc add new class
// @access Private
router.post('/', verifyToken, feedbackController.add)


module.exports = router;