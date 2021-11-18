import { SET_MONTHLY_TRANSACTION_OVERVIEW } from '../Types';

type monthlyTransactionReducerState = {
    monthIncome: number | string,
    monthExpenses: number | string,
    monthInvestment: number | string,
    monthBalance: number | string
};

const initialState: monthlyTransactionReducerState = {
    monthIncome: 0,
    monthExpenses: 0,
    monthInvestment: 0,
    monthBalance: 0
};


export default function monthlyTransactionReducer(state = initialState, action: { [key: string]: any }) {
    switch (action.type) {
        case SET_MONTHLY_TRANSACTION_OVERVIEW:
            return {
                ...state,
                ...action.monthTransactionOverview
            }
        default: return state;
    }
}
