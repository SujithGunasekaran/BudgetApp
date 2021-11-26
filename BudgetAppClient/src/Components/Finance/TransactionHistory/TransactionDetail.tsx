import React, { Fragment, FC, useEffect, useState, lazy, Suspense } from 'react';
import { transactionAxios } from '../../../Util/Api';
import { currentMonthValue, FullMonth } from '../../../Util/index';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';
import ErrorMessage from '../../../UI/Messages/ErrorMessage';

const TransactionDetailItem = lazy(() => import('../../../UI/Card/TransactionDetailItem'));

type TransactionDetailProps = {
    history?: any
}

const TransactionDetail: FC<TransactionDetailProps> = (props) => {

    // react-state
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // redux-state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);
    const { transactionData, currentFilterGroupBy, currentFilterMonth } = useSelector((state: RootState) => state.transactionReducer);

    // props
    const { history } = props;

    // dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        getTransactionDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFilterGroupBy, currentFilterMonth])


    const getTransactionDetail = async () => {
        try {
            setIsLoading(true);
            const userToken = sessionStorage.getItem('userToken');
            const response: any = await transactionAxios(`gettransactionDetail?userId=${userInfo.id}&year=${new Date().getFullYear()}&groupBy=${currentFilterGroupBy || ''}&month=${currentFilterMonth ? FullMonth[Number(currentFilterMonth)] : FullMonth[Number(currentMonthValue)]}`, {
                headers: {
                    'x-powered-token': userToken || ''
                }
            });
            if (response && response.data && response.data.status === 'Success') {
                if (response.data.transactionDetail) {
                    const { transactionDetail, monthTransactionOverview } = response.data;
                    if (transactionDetail.monthHistory && transactionDetail.monthHistory.length === 0) {
                        dispatch({
                            type: 'SET_MONTHLY_TRANSACTION_OVERVIEW',
                            monthTransactionOverview: {
                                monthIncome: 0,
                                monthExpenses: 0,
                                monthInvestment: 0,
                                monthBalance: 0
                            }
                        });
                    }
                    else {
                        dispatch({
                            type: 'SET_MONTHLY_TRANSACTION_OVERVIEW',
                            monthTransactionOverview
                        });
                    }
                    dispatch({
                        type: 'SET_TRANSACTION_DATA',
                        transactionData: transactionDetail
                    });

                }
            }
        }
        catch (err: any) {
            if (err && err.response && err.response.data) {
                const { message } = err.response.data;
                if (message === 'InvalidToken') {
                    setApiErrorMessage('Invalid Token, User not Authenticated');
                    sessionStorage.removeItem('userToken');
                    setTimeout(() => {
                        history.push('/');
                    }, 3000)
                }
                else setApiErrorMessage('Error while getting transaction detail');
            }
            else setApiErrorMessage('Error while getting transaction detail');
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleErrorMessage = () => {
        setApiErrorMessage(null);
    }


    const renderErrorMessage = () => (
        <Fragment>
            <ErrorMessage
                message={apiErrorMessage}
                handleMessageModel={handleErrorMessage}
            />
        </Fragment>
    );

    return (
        <Fragment>
            {
                apiErrorMessage &&
                <div className="row">
                    <div className="col-md-12">
                        {
                            renderErrorMessage()
                        }
                    </div>
                </div>
            }
            <div className="row">
                <div className="col-md-12">
                    <div className="finance_transaction_detail_container">
                        {
                            (
                                transactionData &&
                                transactionData.monthHistory &&
                                transactionData.monthHistory.length > 0
                            ) ?
                                transactionData.monthHistory.map((monthInfo: any, index: any) => (
                                    <Fragment key={index}>
                                        {
                                            monthInfo &&
                                            monthInfo.dateHistory.length > 0 &&
                                            monthInfo.dateHistory.map((dateInfo: any, index: any) => (
                                                <Fragment key={index}>
                                                    <Suspense fallback={<div></div>}>
                                                        <TransactionDetailItem
                                                            dateInfo={dateInfo}
                                                            monthInfo={monthInfo}
                                                        />
                                                    </Suspense>
                                                </Fragment>
                                            ))
                                        }
                                    </Fragment>
                                )) :
                                <div className="finance_transaction_detail_empty_message">There is no transaction for the selected month</div>
                        }
                    </div>
                </div>
            </div>
            {
                isLoading &&
                <div className="row">
                    <div className="col-md-12">
                        <div className="finance_transaction_detail_loading">
                            <div className="spinner-border" role="status" />
                        </div>
                    </div>
                </div>
            }
        </Fragment>
    )

}


export default TransactionDetail;
