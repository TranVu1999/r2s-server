const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const commentController = require('../controllers/comment')

// ================= POST ==================

// @route POST api/comment
// @desc add new comment
// @access Private
router.post('/', verifyToken, commentController.add)


module.exports = router;