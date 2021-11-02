import { SET_TRANSACTION_OVERVIEW } from '../Types';

type TransactionReducer = {
    income: string | number,
    expenses: string | number,
    investment: string | number,
    balance: string | number
}

const initialState: TransactionReducer = {
    income: 0,
    expenses: 0,
    investment: 0,
    balance: 0
};


export default function transactionReducer(state = initialState, action: { [key: string]: any }) {
    switch (action.type) {
        case SET_TRANSACTION_OVERVIEW:
            const { income, expenses, investment, balance } = action.transactionOverview;
            return {
                ...state,
                income,
                expenses,
                investment,
                balance
            }
        default: return state;
    }
}
