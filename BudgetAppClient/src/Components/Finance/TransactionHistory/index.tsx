import React, { Fragment, FC, lazy, Suspense, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

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

    // dispatch
    const dispatch = useDispatch();


    const handleFilterOptions = useCallback((inputValue: string | undefined, stateSetterCallback: React.Dispatch<React.SetStateAction<string | undefined>>, isStateNeedToBeUpdated: boolean = false) => {
        stateSetterCallback(inputValue);
        if (isStateNeedToBeUpdated) {
            dispatch({
                type: 'SET_IS_FILTER_ENABLED',
                value: -1
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
