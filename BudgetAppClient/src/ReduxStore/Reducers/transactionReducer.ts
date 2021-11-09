import { SET_TRANSACTION_OVERVIEW, SET_IS_FILTER_ENABLED } from '../Types';

type TransactionReducer = {
    income: string | number,
    expenses: string | number,
    investment: string | number,
    balance: string | number,
    isFilterEnabled: number,
    transactionDetail: { [key: string]: any }[]
}

const initialState: TransactionReducer = {
    income: 0,
    expenses: 0,
    investment: 0,
    balance: 0,
    isFilterEnabled: 0,
    transactionDetail: []
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
        case SET_IS_FILTER_ENABLED:
            return {
                ...state,
                isFilterEnabled: state.isFilterEnabled + action.value
            }
        default: return state;
    }
}
