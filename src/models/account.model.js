const mongoose = require('mongoose');

const ledgerModel = require('../models/ledger.model');
const { $where } = require('./transaction.model');

const accountSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [ true, 'Account must belong to a user'],
        index : true
    },

    status : {
        type : String,
        enum : {
            values: ['active', 'closed', 'frozen'],
            message: 'Status must be either active, closed or frozen',
            // we can't add default here because if we add default then it will always be active even if we want to set it to closed or frozen, so we will set default in controller while creating account
        },
        default : 'active'
    },

    currency : {
        type : String,
        required : [ true, 'Account must have a currency'],
        default : 'INR'
    }

    
}, {
    timestamps : true
})

accountSchema.index({ user: 1, status: 1})

accountSchema.methods.getBalance = async function() {

    // Aggrregation pipeline to calculate balance from ledger entries related to this account
    const balanceData = await ledgerModel.aggregate([
        {$match: { account: this._id }},
        {
            $group: {
                _id: null, // _id null is used to group all the documents together and get the total balance for the account
                totalDebit: { $sum: {
                    $cond: [ {$eq: ['$type', 'debit']}, '$amount', 0 ] // agar transactionType debit hai to amount ko sum karo otherwise 0 ko sum karo
                }},
                totalCredit: { $sum: {
                    $cond: [ {$eq: ['$type', 'credit']}, '$amount', 0 ] // agar transactionType credit hai to amount ko sum karo otherwise 0 ko sum karo
                }}
            }
        },
        {
            $project: {
                _id: 0, // _id ko project se exclude kar rahe hai
                balance: { $subtract: ['$totalCredit', '$totalDebit'] } // balance calculate kar rahe hai totalCredit me se totalDebit ko subtract karke
            }
        }
    ])

    if(balanceData.length === 0){
        return 0; // agar koi ledger entry nahi hai to balance 0 hoga
    }
    return balanceData[0].balance;
    
}

const accountModel = mongoose.model('account', accountSchema); 

module.exports = accountModel;  