import React, { FC, Fragment, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';

const TransactionCard = lazy(() => import('../../../UI/Card/TransactionCard'));

const MonthTransactionOverview: FC = () => {

    // redux-state
    const { monthIncome, monthExpenses, monthInvestment, monthBalance } = useSelector((state: RootState) => state.monthlyTransactionReducer);

    return (
        <Fragment>
            <div className="month_transaction_container">
                <Suspense fallback={<div>Loading...</div>}>
                    <TransactionCard
                        income={Number(monthIncome)}
                        expenses={Number(monthExpenses)}
                        investment={Number(monthInvestment)}
                        balance={Number(monthBalance)}
                        column="col-md-3"
                    />
                </Suspense>
            </div>
        </Fragment>
    )

}

export default MonthTransactionOverview;
