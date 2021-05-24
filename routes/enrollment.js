const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const enrollmentController = require('./../controllers/enrollment')

// ================= POST ==================

// @route POST api/enrollment
// @desc add new enrollment
// @access Private
router.post('/', verifyToken, enrollmentController.add)


module.exports = router;