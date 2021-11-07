import React, { Fragment, FC, useEffect, useState, lazy, Suspense } from 'react';
import { transactionAxios } from '../../../Util/Api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';
import ErrorMessage from '../../../UI/Messages/ErrorMessage';

const TransactionDetailItem = lazy(() => import('../../../UI/Card/TransactionDetailItem'));

type TransactionDetailProps = {
    history?: any
}

const TransactionDetail: FC<TransactionDetailProps> = (props) => {

    // react-state
    const [monthHistory, setMonthHistory] = useState<{ [key: string]: any }[] | undefined>([]);
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

    // redux-state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);

    // props
    const { history } = props;

    useEffect(() => {
        getTransactionDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getTransactionDetail = async () => {
        try {
            const userToken = sessionStorage.getItem('userToken');
            const response: any = await transactionAxios(`gettransactionDetail?userId=${userInfo.id}&year=${new Date().getFullYear()}`, {
                headers: {
                    'x-powered-token': userToken || ''
                }
            });
            if (response && response.data && response.data.status === 'Success') {
                setMonthHistory(response.data.transactionDetail.monthHistory);
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
            }
            else setApiErrorMessage('Error while getting transaction detail');
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
    )


    return (
        <Fragment>
            <div className="row">
                <div className="col-md-12">
                    {
                        apiErrorMessage && renderErrorMessage()
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="finance_transaction_detail_container">
                        {
                            monthHistory && monthHistory.length > 0 &&
                            monthHistory.map((monthInfo, index) => (
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
                            ))
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )

}


export default TransactionDetail;
