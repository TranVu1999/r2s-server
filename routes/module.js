const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const moduleController = require('./../controllers/module')

// ================= POST ==================

// @route POST api/module
// @desc add new module
// @access Private
router.post('/', verifyToken, moduleController.add)



module.exports = router;