import React, { Fragment, FC, lazy, Suspense } from 'react';

const TransactionHistoryHeader = lazy(() => import('./HistoryHeader'));
const TransactionFilter = lazy(() => import('./TransactionFilter'));

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
                <TransactionFilter
                    history={history}
                />
            </Suspense>
            <div style={{ color: 'white' }}>Hello</div>
        </Fragment>
    )

}


export default TransactionHistory;
