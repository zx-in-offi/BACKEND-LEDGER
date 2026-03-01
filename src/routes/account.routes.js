const express = require('express');
const authMiddleware = require('../middleware/auth.middleware').authMiddleware; // why .authMiddleware in last ?
// why require('../middleware/auth.middleware') will not work ? because we are exporting an object with authMiddleware as a property in auth.middleware.js file, so we need to access that property to get the middleware function. if we do require('../middleware/auth.middleware') then we will get the whole object and not the middleware function directly.

const accountController = require('../controllers/account.controller'); // account controller ko import kar rahe hai


const router = express.Router();

/**
 * POST /api/accounts/
 * Create a new account for the authenticated user
 * protected route
 * 
 */
router.post('/', authMiddleware, accountController.createAccountController); // account create karne ke liye authMiddleware ko use kar rahe hai taki sirf authenticated user hi account create kar sake

module.exports = router;