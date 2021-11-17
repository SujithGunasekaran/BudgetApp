import { Schema, model } from 'mongoose';


// const moeny = {}


const transactionSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'BudgetUserInfo'
    },
    year: {
        type: String
    },
    income: {
        type: String,
        default: '0'
    },
    expenses: {
        type: String,
        default: '0'
    },
    investment: {
        type: String,
        default: '0'
    },
    balance: {
        type: String
    },
    transactionHistory: {
        monthHistory: [
            {
                monthIncome: String,
                monthExpenses: String,
                monthInvestment: String,
                monthBalance: String,
                month: String,
                dateHistory: [
                    {
                        date: String,
                        transactionList: [
                            {
                                transactiontype: String,
                                transactionCategory: String,
                                description: String,
                                amount: String
                            }
                        ]
                    }

                ]
            }
        ]
    }

});


const transactionModel = model('transactionData', transactionSchema);

export default transactionModel;
