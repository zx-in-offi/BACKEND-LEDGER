const transactionModel = require('../models/transaction.model'); // transaction model ko import kar rahe hai

const accountModel = require('../models/account.model'); // account model ko import kar rahe hai

const ledgerModel = require('../models/ledger.model'); // ledger model ko import kar rahe hai

const emailService = require('../services/email.services'); // email service ko import kar rahe hai transaction email bhejne ke liye

const mongoose = require('mongoose');







async function createTransaction(req, res) {

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body; // request body se transaction details ko extract kar rahe hai

    // validation
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: 'fromAccount, toAccount, amount and idempotencyKey are required fields'
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount, // what is _id and what is fromAccount ? _id is the default primary key field in MongoDB and fromAccount is the account id from which the amount will be debited
        // are we searching for the account with the given fromAccount id in database as default primary key field is _id in MongoDB ? 
        // yes, we are searching for the account with the given fromAccount id in database as default primary key field is _id in MongoDB
        // in our case 
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: 'Invalid fromAccount or toAccount'
        })
    }

    /**
     * validate idempotency key
     */

    const isTransactionExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionExist){
        if(isTransactionExist.status === 'completed'){
            return res.status(200).json({
                message: 'Transaction already completed'
                // transaction: isTransactionExist // coomment 
            })
        }
        if(isTransactionExist.status === 'pending'){
            return res.status(200).json({
                message: 'Transaction is still pending',
                // transaction: isTransactionExist // is it necessary to return the transaction details in response ? yes, it is necessary to return the transaction details in response so that the client can check the status of the transaction and take appropriate action
            })
        }

        if(isTransactionExist.status === 'failed'){
            return res.status(500).json({ // It means that the server encountered an unexpected condition that prevented it from fulfilling the request.
                message: 'Transaction failed previously, please try again'
            })

        }

        if(isTransactionExist.status === 'reversed'){
            return res.status(500).json({
                message: 'Transaction was reversed previously, please try again'
            })
        }
    }

    /**
     * Check account status.
     */

    if(fromUserAccount.status !== 'active' || toUserAccount.status !== 'active'){
        return res.status(400).json({
            message: 'Both fromAccount and toAccount must be active to perform transaction'
        })
    }

    /**
     * Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).json({
            message: `Insufficient balance. Your current balance is ${balance}`
        })
    }

    /**
     * Create transaction
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: 'pending'
    })

    const debitLedgerEntry = await ledgerModel.create([ { // whenever we use session, data is passed using array '[]'
        account: fromAccount,
        type: 'debit',
        amount,
        transaction: transaction._id
    }] , { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        type: 'credit',
        amount,
        transaction: transaction._id
    }] , { session })

    transaction.status = 'completed';
    await transaction.save({ session })

    await session.commitTransaction();
    session.endSession();

    /**
     * Send transaction email to both sender and receiver
     */

    // const fromUser = await UserModel.findById(fromUserAccount.user); 

    

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toUserAccount._id); // sender ko transaction email bhej rahe hai

    return res.status(201).json({
        message: 'Transaction completed successfully',
        transaction
    })






    
}



module.exports = {
    createTransaction
}