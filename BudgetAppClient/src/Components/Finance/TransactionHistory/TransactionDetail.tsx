import React, { Fragment, FC, useEffect, useState, lazy, Suspense, useRef, useCallback } from 'react';
import { transactionAxios } from '../../../Util/Api';
import { FullMonth } from '../../../Util/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';
import ErrorMessage from '../../../UI/Messages/ErrorMessage';

const TransactionDetailItem = lazy(() => import('../../../UI/Card/TransactionDetailItem'));

type TransactionDetailProps = {
    history?: any,
    filterGroupBy: string | undefined,
    filterMonth: string | undefined
}

const TransactionDetail: FC<TransactionDetailProps> = (props) => {

    // react-state
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTransactionDataToLoad, setisTransactionDataToLoad] = useState<boolean>(true);
    const [nextMonthIndex, setNextMonthIndex] = useState<number>(0);
    const [transactionData, setTransactionData] = useState<{ [key: string]: any }>({ monthHistory: [] });

    // redux-state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);

    // props
    const { history, filterGroupBy, filterMonth } = props;

    // ref
    const loadMoreRef = useRef<any>(null);

    useEffect(() => {
        getTransactionDetail();
        if (filterGroupBy || filterMonth) {
            resetTransactionFilter();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterGroupBy, filterMonth])


    useEffect(() => {
        if (!filterGroupBy && !filterMonth) {
            setTransactionData({ monthHistory: [] });
        }
    }, [filterGroupBy, filterMonth])


    const resetTransactionFilter = () => {
        setNextMonthIndex(0);
        setisTransactionDataToLoad(true);
    }

    const getTransactionDetail = async () => {
        if (isTransactionDataToLoad || filterMonth || filterGroupBy) {
            try {
                setIsLoading(true);
                const userToken = sessionStorage.getItem('userToken');
                const response: any = await transactionAxios(`gettransactionDetail?userId=${userInfo.id}&year=${new Date().getFullYear()}&groupBy=${filterGroupBy || ''}&month=${FullMonth[Number(filterMonth)] || ''}&visitedMonth=${nextMonthIndex}`, {
                    headers: {
                        'x-powered-token': userToken || ''
                    }
                });
                if (response && response.data && response.data.status === 'Success') {
                    if (response.data.transactionDetail) {
                        const { transactionDetail, hasMoreData, nextMonthIndex } = response.data;
                        if (!filterMonth && !filterGroupBy) {
                            setNextMonthIndex(nextMonthIndex);
                            setisTransactionDataToLoad(hasMoreData);
                            setTransactionData((prevValue) => {
                                let transactionData = JSON.parse(JSON.stringify(prevValue));
                                transactionData.monthHistory = [
                                    ...transactionData.monthHistory,
                                    ...transactionDetail.monthHistory
                                ];
                                return transactionData;
                            });
                        }
                        else {
                            setTransactionData((prevValue) => {
                                let transactionData = JSON.parse(JSON.stringify(prevValue));
                                transactionData = transactionDetail;
                                return transactionData;
                            });
                        }
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
    }

    const monthObserver = useCallback((monthContainer) => {
        if (loadMoreRef.current) {
            loadMoreRef.current.disconnect();
        }
        loadMoreRef.current = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && isTransactionDataToLoad) {
                getTransactionDetail();
            }
        });
        if (monthContainer) loadMoreRef.current.observe(monthContainer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTransactionDataToLoad, nextMonthIndex])


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
                            (
                                transactionData &&
                                transactionData.monthHistory &&
                                transactionData.monthHistory.length > 0
                            ) ?
                                transactionData.monthHistory.map((monthInfo: any, index: any) => (
                                    <Fragment key={index}>
                                        <div ref={((!filterMonth && !filterGroupBy) && (index === transactionData.monthHistory.length - 1)) ? monthObserver : null}>
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
                                        </div>
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
