const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Ledger must belong to an account'],
        index: true, // account par index create kar rahe hai taki queries fast ho jaye
        immutable: true // account field ko immutable bana rahe hai taki once set ho jaye to change na ho jaye
    },

    amount: {
        type: Number,
        required: [true, 'Ledger must have an amount'],
        immutable: true // amount field ko immutable bana rahe hai taki once set ho jaye to change na ho jaye
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
        required: [true, 'Ledger must belong to a transaction'],
        index: true, 
        immutable: true // transaction field ko immutable bana rahe hai taki once set ho jaye to change na ho jaye
    },

    type: {
        type: String,
        enum: {
            values: ['debit', 'credit'],
            message: 'Type must be either debit or credit'
        },
        required: [true, 'Ledger must have a type'],
        immutable: true
}
})

function preventLedgerModification() {
    throw new Error('Ledger entries cannot be modified once created');
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('update', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findOneAndRemove', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);


const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;