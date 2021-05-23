const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const feedbackController = require('./../controllers/feedback')

// ================= POST ==================

// @route POST api/class
// @desc add new class
// @access Private
router.post('/', verifyToken, feedbackController.add)


// ================= PUT ==================

// @route PUT api/class
// @desc Update feedback
// @access Private
router.put('/:id', verifyToken, feedbackController.update)


// ================= GET ==================

// @route GET api/class
// @desc get list feedback
// @access Private
router.get('/', verifyToken, feedbackController.getListFeedback)


// @route GET api/class/;id
// @desc get feedback
// @access Private
router.get('/:id', verifyToken, feedbackController.getFeedback)



// ================= DELETE ==================

// @route DELETE api/class
// @desc remove feedback
// @access Private
router.delete('/:id', verifyToken, feedbackController.removeFeedback)


module.exports = router;