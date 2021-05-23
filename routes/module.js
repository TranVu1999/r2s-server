const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const moduleController = require('./../controllers/module')

// ================= POST ==================

// @route POST api/module
// @desc add new module
// @access Private
router.post('/', verifyToken, moduleController.add)


// ================= PUT ==================

// @route PUT api/module/:id
// @desc update module
// @access Private
router.put('/:id', verifyToken, moduleController.update)


// ================= DELETE ==================

// @route DELETE api/module/:id
// @desc remove module
// @access Private
router.delete('/:id', verifyToken, moduleController.remove)


// ================= GET ==================

// @route GET api/module
// @desc get list module
// @access Private
router.get('/', verifyToken, moduleController.getListModule)



module.exports = router;