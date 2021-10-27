import { Schema, model } from 'mongoose';



const transactionSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'BudgetUserInfo'
    },
    year: {
        type: String
    },
    transactionHistory: {
        monthHistory: [
            {
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
