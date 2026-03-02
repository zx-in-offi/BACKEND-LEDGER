const mongoose = require('mongoose');

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

const accountModel = mongoose.model('account', accountSchema); 

module.exports = accountModel;  