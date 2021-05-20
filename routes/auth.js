const express = require('express');
const router = express.Router();

const authController = require('./../controllers/auth')

// ================= POST ==================

// @route POST api/auth/admin-register
// @desc register for a new account of admin
// @access Public
router.post('/admin-register', authController.registerAdmin)

// @route POST api/auth/register
// @desc register for a new account of trainee and trainer
// @access Public
router.post('/register', authController.register)

// @route POST api/auth/login
// @desc login for account
// @access Public
router.post('/login', authController.login)


// @route POST api/auth/login
// @desc login for account
// @access Public
router.get('/', (req, res) => {
    res.send("ok")
})

module.exports = router;