import {
    SET_TRANSACTION_OVERVIEW,
    SET_IS_FILTER_ENABLED,
    SET_TRANSACTION_DETAILS,
    SET_NEXT_MONTH_INDEX,
    SET_IS_TRANSACTION_DATA_TO_LOAD,
    SET_FILTERED_TRANSACTION
} from '../Types';

type TransactionReducer = {
    income: string | number,
    expenses: string | number,
    investment: string | number,
    balance: string | number,
    isFilterEnabled: number,
    transactionDetail: { [key: string]: any },
    nextMonthIndex: number,
    isTransactionDataToLoad: boolean
}

const initialState: TransactionReducer = {
    income: 0,
    expenses: 0,
    investment: 0,
    balance: 0,
    isFilterEnabled: 0,
    nextMonthIndex: 0,
    isTransactionDataToLoad: true,
    transactionDetail: { monthHistory: [] }
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
        case SET_TRANSACTION_DETAILS:
            let transactionDetail = JSON.parse(JSON.stringify(state.transactionDetail));
            transactionDetail.monthHistory = [
                ...transactionDetail.monthHistory,
                ...action.transactionDetail.monthHistory
            ]
            return {
                ...state,
                transactionDetail
            }
        case SET_FILTERED_TRANSACTION:
            let filteredTransaction = JSON.parse(JSON.stringify(state.transactionDetail));
            filteredTransaction = action.transactionDetail
            return {
                ...state,
                transactionDetail: filteredTransaction
            }
        case SET_NEXT_MONTH_INDEX:
            return {
                ...state,
                nextMonthIndex: action.nextMonthIndex
            }
        case SET_IS_TRANSACTION_DATA_TO_LOAD:
            return {
                ...state,
                isTransactionDataToLoad: action.isTransactionDataToLoad
            }
        default: return state;
    }
}
