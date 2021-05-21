const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const classController = require('./../controllers/class')

// ================= POST ==================

// @route POST api/class
// @desc add new class
// @access Private
router.post('/', verifyToken, classController.add)



// ================= GET ==================

// @route GET api/class
// @desc get list class by type user
// @access Private
router.get('/:typeUser', verifyToken, classController.getList)

module.exports = router;