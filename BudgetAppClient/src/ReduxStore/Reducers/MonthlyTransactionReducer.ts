import { SET_MONTHLY_TRANSACTION_OVERVIEW, SET_MONTHLY_TRANSACTION_DASHBOARD } from '../Types';

type monthlyTransactionReducerState = {
    monthIncome: number | string,
    monthExpenses: number | string,
    monthInvestment: number | string,
    monthBalance: number | string,
    monthlyDashboardData: { [key: string]: any } | []
};

const initialState: monthlyTransactionReducerState = {
    monthIncome: 0,
    monthExpenses: 0,
    monthInvestment: 0,
    monthBalance: 0,
    monthlyDashboardData: []
};


export default function monthlyTransactionReducer(state = initialState, action: { [key: string]: any }) {
    switch (action.type) {
        case SET_MONTHLY_TRANSACTION_OVERVIEW:
            return {
                ...state,
                ...action.monthTransactionOverview
            }
        case SET_MONTHLY_TRANSACTION_DASHBOARD:
            return {
                ...state,
                monthlyDashboardData: action.monthlyDashboardData
            }
        default: return state;
    }
}
