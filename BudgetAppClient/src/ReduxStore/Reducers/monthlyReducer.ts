import { SAMPLE } from '../Types';

type MonthlyExpenses = {
    monthlyExpenses: { [key: string]: any }
}

const initialState: MonthlyExpenses = {
    monthlyExpenses: {}
}

export default function monthlyExpensesReducer(state = initialState, action: { [key: string]: any }) {

    switch (action.type) {
        case SAMPLE:
            return {
                ...state,
                monthlyExpenses: action.value
            }
        default: return state;
    }

}
