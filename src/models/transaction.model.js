const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Transaction must have a from account'],
        index: true // fromAccount par index create kar rahe hai taki queries fast ho jaye
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Transaction must have a to account'],
        index: true 
    },

    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed', 'reversed'],
            message: 'Status must be either pending, completed, failed or reversed'
        },
        default: 'pending'
    },

    amount: {
        type: Number,
        required: [true, 'Transaction must have an amount'],
        min: [0, 'Transaction amount must be greater than or equal to 0']
    },

    idempotencyKey: {
        type: String,
        required: [true, 'Transaction must have an idempotency key'],
        unique: true, // idempotency key unique hona chahiye taki same transaction multiple times create na ho jaye
        index: true
    }
}, {
    timestamps: true
})

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;