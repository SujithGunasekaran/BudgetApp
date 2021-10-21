import { combineReducers } from 'redux';
import userInfoReducer from './userInfoReducer';
import monthlyExpensesReducer from './monthlyReducer';
import transactionReducer from './transactionReducer';

const rootReducer = combineReducers({
    userInfoReducer,
    monthlyExpensesReducer,
    transactionReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
