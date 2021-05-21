const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const classController = require('./../controllers/class')

// ================= POST ==================

// @route POST api/class
// @desc add new class
// @access Private
router.post('/', verifyToken, classController.add)

module.exports = router;