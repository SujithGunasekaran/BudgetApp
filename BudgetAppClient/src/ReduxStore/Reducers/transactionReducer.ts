import { SET_TRANSACTION } from '../Types';

type TransactionReducer = {
    transactionData: { [key: string]: any }
}

const initialState: TransactionReducer = {
    transactionData: {}
};


export default function transactionReducer(state = initialState, action: { [key: string]: any }) {
    switch (action.type) {
        case SET_TRANSACTION:
            const { month, date, transactionInput } = action.value;
            let transactionData = JSON.parse(JSON.stringify(state.transactionData));
            if (!transactionData[month]) transactionData[month] = {};
            if (!transactionData[month][date]) transactionData[month][date] = [];
            transactionData[month][date] = [
                ...transactionData[month][date],
                transactionInput
            ];
            return {
                ...state,
                transactionData
            }
        default: return state;
    }
}
