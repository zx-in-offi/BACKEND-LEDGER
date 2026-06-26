const { Router } = require('express');

const authMiddleware = require('../middleware/auth.middleware');

const transactionController = require('../controllers/transaction.controller');

const transactionRoutes = Router();

/**
 * POST /api/transactions
 * create a new transaction
 */
transactionRoutes.post('/', authMiddleware.authMiddleware, transactionController.createTransaction);

/**
 * POST /api/transactions/system/initial-funds
 * create initial funds for the system account, this route will be called only once when the system is initialized, 
 * this route will be protected and can only be accessed by admin user
 */
transactionRoutes.post('/system/initial-funds', authMiddleware.authMiddlewareSystemUser, transactionController.createInitialFundsTransaction); // system account ke liye initial funds create karne ke liye authMiddlewareSystemUser middleware ko use kar rahe hai taki sirf system user hi is route ko access kar sake

module.exports = transactionRoutes;