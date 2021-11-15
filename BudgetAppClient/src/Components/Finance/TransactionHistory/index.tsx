import React, { Fragment, FC, lazy, Suspense } from 'react';

const TransactionHistoryHeader = lazy(() => import('./HistoryHeader'));
const TransactionFilter = lazy(() => import('./TransactionFilter'));
const TransactionDetail = lazy(() => import('./TransactionDetail'));

type TransactionHistoryProps = {
    history?: any
}

const TransactionHistory: FC<TransactionHistoryProps> = (props) => {

    // props
    const { history } = props;

    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionHistoryHeader
                    history={history}
                />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionFilter />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionDetail
                    history={history}
                />
            </Suspense>
        </Fragment>
    )

}


export default TransactionHistory;
