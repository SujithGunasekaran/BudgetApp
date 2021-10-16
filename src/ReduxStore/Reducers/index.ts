import { combineReducers } from 'redux';
import userInfoReducer from './userInfoReducer';
import monthlyExpensesReducer from './monthlyReducer';

const rootReducer = combineReducers({
    userInfoReducer,
    monthlyExpensesReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
