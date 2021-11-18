import { combineReducers } from 'redux';
import userInfoReducer from './userInfoReducer';
import transactionReducer from './transactionReducer';
import monthlyTransactionReducer from './MonthlyTransactionReducer';

const rootReducer = combineReducers({
    userInfoReducer,
    transactionReducer,
    monthlyTransactionReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
