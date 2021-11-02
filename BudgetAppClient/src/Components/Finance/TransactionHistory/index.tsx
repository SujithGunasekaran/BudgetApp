import React, { Fragment, FC, lazy, Suspense } from 'react';

const TransactionHistoryHeader = lazy(() => import('./HistoryHeader'));

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
        </Fragment>
    )

}


export default TransactionHistory;
