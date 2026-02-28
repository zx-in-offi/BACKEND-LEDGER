const express = require('express');

const authController = require('../controllers/auth.controller'); // auth controller ko import kar rahe hai
const router = express.Router(); // Express Router ko initialize kar rahe hai


router.post('/register', authController.userRegisterController); // POST request ke liye /register route define kar rahe hai aur usme userRegisterController function ko use kar rahe hai

/* POST /api/auth/login */
router.post('/login', authController.userLoginController); // POST request ke liye /login route define kar rahe hai aur usme userLoginController function ko use kar rahe hai


module.exports = router; // router ko export kar rahe hai taaki use kar sakein