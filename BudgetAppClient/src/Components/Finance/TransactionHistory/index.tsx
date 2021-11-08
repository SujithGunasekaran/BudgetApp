import React, { Fragment, FC, lazy, Suspense, useState, useCallback } from 'react';

const TransactionHistoryHeader = lazy(() => import('./HistoryHeader'));
const TransactionFilter = lazy(() => import('./TransactionFilter'));
const TransactionDetail = lazy(() => import('./TransactionDetail'));

type TransactionHistoryProps = {
    history?: any
}

const TransactionHistory: FC<TransactionHistoryProps> = (props) => {

    // react-state
    const [filterGroupBy, setFilterGroupBy] = useState<string | undefined>(undefined);
    const [filterMonth, setfilterMonth] = useState<string | undefined>(undefined);

    // props
    const { history } = props;


    const handleFilterOptions = useCallback((inputValue: string | undefined, stateSetterCallback: React.Dispatch<React.SetStateAction<string | undefined>>) => {
        stateSetterCallback(inputValue);
    }, [])

    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionHistoryHeader
                    history={history}
                    filteredMonth={filterMonth}
                />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionFilter
                    history={history}
                    filterGroupBy={filterGroupBy}
                    filterMonth={filterMonth}
                    setFilterGroupBy={setFilterGroupBy}
                    setFilterMonth={setfilterMonth}
                    handleFilterOptions={handleFilterOptions}
                />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionDetail
                    history={history}
                    filterGroupBy={filterGroupBy}
                    filterMonth={filterMonth}
                />
            </Suspense>
        </Fragment>
    )

}


export default TransactionHistory;
