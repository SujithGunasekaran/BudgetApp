import React, { FC, Fragment, lazy, Suspense } from 'react';

const MonthlyDashboard = lazy(() => import('./MonthDashboard'));

interface objectKeys {
    [key: string]: any
};

type TransactionDashBoardProps = {
    history?: objectKeys
}


const TransactionDashBoard: FC<TransactionDashBoardProps> = () => {

    return (
        <Fragment>
            <div className="dashboard_transaction_container">
                <div className="dashboard_transaction_heading">Dashboard</div>
                <div className="dashboard_transaction_sub_heading">Transaction for Nov 2021</div>
                <Suspense fallback={<div>Loading...</div>}>
                    <MonthlyDashboard />
                </Suspense>
            </div>
        </Fragment>
    )

}

export default TransactionDashBoard;
