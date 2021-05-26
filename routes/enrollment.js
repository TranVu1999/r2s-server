const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const enrollmentController = require('./../controllers/enrollment')

// ================= POST ==================

// @route POST api/enrollment
// @desc add new enrollment
// @access Private
router.post('/', verifyToken, enrollmentController.add)


// ================= PUT ==================

// @route PUT api/enrollment
// @desc update enrollment
// @access Private
router.put('/:id', verifyToken, enrollmentController.update)


// ================= GET ==================

// @route GET api/enrollment
// @desc get enrollment detail
// @access Private
router.get('/filter/:ClassId?', verifyToken, enrollmentController.getListEnrollment)


// @route GET api/enrollment
// @desc get enrollment detail
// @access Private
router.get('/:traineeId', verifyToken, enrollmentController.getEnrollmentDetail)

module.exports = router;