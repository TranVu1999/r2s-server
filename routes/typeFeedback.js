const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const typeFeedbackController = require('./../controllers/typeFeedback')

// ================= POST ==================

// @route POST api/class
// @desc add new class
// @access Private
router.post('/', verifyToken, typeFeedbackController.add)



// ================= GET ==================

// @route GET api/class
// @desc get list topic
// @access Private
router.get('/', verifyToken, typeFeedbackController.getListtopic)

module.exports = router;