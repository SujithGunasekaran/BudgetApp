import {
    SET_TRANSACTION_OVERVIEW,
    SET_IS_FILTER_ENABLED,
    SET_TRANSACTION_DATA,
    SET_CURRENT_FILTER_GROUP_BY,
    SET_CURRENT_FILTER_MONTH
} from '../Types';

type TransactionReducer = {
    income: string | number,
    expenses: string | number,
    investment: string | number,
    balance: string | number,
    isFilterEnabled: number,
    currentFilterMonth: string,
    currentFilterGroupBy: string,
    transactionData: { [key: string]: any }
}

const initialState: TransactionReducer = {
    income: 0,
    expenses: 0,
    investment: 0,
    balance: 0,
    isFilterEnabled: 0,
    currentFilterMonth: '',
    currentFilterGroupBy: '',
    transactionData: { monthHistory: [] }
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
        case SET_TRANSACTION_DATA:
            let transactionData = JSON.parse(JSON.stringify(state.transactionData));
            transactionData = action.transactionData;
            return {
                ...state,
                transactionData
            }
        case SET_CURRENT_FILTER_MONTH:
            return {
                ...state,
                currentFilterMonth: action.filterMonth
            }
        case SET_CURRENT_FILTER_GROUP_BY:
            return {
                ...state,
                currentFilterGroupBy: action.filterGroupBy
            }
        default: return state;
    }
}
