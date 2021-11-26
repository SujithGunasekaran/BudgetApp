import React, { FC, Fragment, useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../ReduxStore/Reducers';
import { transactionAxios } from '../Util/Api';

const TransactionCard = lazy(() => import('../UI/Card/TransactionCard'));

type TransactionOverviewProp = {
    history?: any
}

const TransactionHeader: FC<TransactionOverviewProp> = (props) => {

    // props
    const { history } = props;

    // redux-state
    const { income, investment, expenses, balance } = useSelector((state: RootState) => state.transactionReducer);
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);

    // dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        getTransactionOverview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getTransactionOverview = async () => {
        const currentYear = new Date().getFullYear();
        const userToken = sessionStorage.getItem('userToken');
        try {
            const response: any = await transactionAxios.get(`/getTransactionOverview?userId=${userInfo.id}&year=${currentYear}`, {
                headers: {
                    'x-powered-token': userToken || ''
                }
            });
            if (response && response.data && response.data.status === 'Success') {
                dispatch({
                    type: 'SET_TRANSACTION_OVERVIEW',
                    transactionOverview: response.data.transactionOverview
                })
            }
        }
        catch (err: any) {
            if (err && err.response && err.response.data) {
                const { message } = err.response.data;
                if (message === 'InvalidToken') {
                    sessionStorage.removeItem('userToken');
                    history.push('/');
                }
            }
        }
    }

    return (
        <Fragment>
            <div className="finance_transaction_header_container">
                <Suspense fallback={<div>Loading...</div>}>
                    <TransactionCard
                        income={Number(income)}
                        expenses={Number(expenses)}
                        investment={Number(investment)}
                        balance={Number(balance)}
                    />
                </Suspense>
            </div>
        </Fragment>
    )

};


export default TransactionHeader;
