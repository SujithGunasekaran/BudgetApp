import {
    SET_MONTHLY_TRANSACTION_OVERVIEW,
    SET_MONTHLY_TRANSACTION_DASHBOARD,
    UPDATE_MONTHLY_TRANSACTION_DASHBOARD
} from '../Types';
import { checkIsDateRangeIsAvailable, getDateIndex } from '../../Util/monthlyDasboard';

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
        case UPDATE_MONTHLY_TRANSACTION_DASHBOARD:
            const monthlyDashboardData = JSON.parse(JSON.stringify(state.monthlyDashboardData));
            const { date, transactiontype, amount } = action.monthlyDashboard;
            const result = checkIsDateRangeIsAvailable(String(date), monthlyDashboardData);
            if (result) {
                const dateIndex = getDateIndex(date, monthlyDashboardData);
                if (dateIndex) {
                    switch (transactiontype) {
                        case 'Income':
                            monthlyDashboardData[dateIndex].Income = +monthlyDashboardData[dateIndex].Income + +amount;
                            break;
                        case 'Expenses':
                            monthlyDashboardData[dateIndex].Expenses = +monthlyDashboardData[dateIndex].Expenses + +amount;
                            break;
                        case 'Investment':
                            monthlyDashboardData[dateIndex].Investment = +monthlyDashboardData[dateIndex].Investment + +amount;
                            break;
                        default: return monthlyDashboardData;
                    }
                }
            };
            return {
                ...state,
                monthlyDashboardData
            }
        default: return state;
    }
}
