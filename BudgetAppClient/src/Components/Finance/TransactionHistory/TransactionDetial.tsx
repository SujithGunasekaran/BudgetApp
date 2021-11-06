import React, { Fragment, FC, useEffect, useState } from 'react';
import { transactionAxios } from '../../../Util/Api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';
import ErrorMessage from '../../../UI/Messages/ErrorMessage';

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
                                                <div className="finance_transaction_detail_month_container">
                                                    <div className="finance_transaction_detail_month_header">{`${dateInfo.date} ${monthInfo.month} ${new Date().getFullYear()}`}</div>
                                                    {
                                                        dateInfo.transactionList.length > 0 &&
                                                        dateInfo.transactionList.map((transactionInfo: any, index: any) => {
                                                            const transactionType = transactionInfo.transactiontype;
                                                            console.log("trans", transactionType)
                                                            return (
                                                                <Fragment key={index}>
                                                                    <div className={`finance_transaction_datail_item ${index < dateInfo.transactionList.length - 1 ? 'border_line' : ''}`}>
                                                                        <div className="row" style={{ margin: '0px', alignItems: 'center' }}>
                                                                            <div className="col-md-2">Icon</div>
                                                                            <div className="col-md-4">
                                                                                <div className="finance_transaction_detail_item_info_container">
                                                                                    <div className="category">{transactionInfo.transactionCategory}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <div className="finance_transaction_detail_item_description_container">
                                                                                    <div className="info">{transactionInfo.description}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <div className="finance_transaction_detail_item_amount_container">
                                                                                    <div className={`amount ${transactionType === 'Expenses' ? 'expenses' : ''} ${transactionType === 'Investment' ? 'investment' : ''} ${transactionType === 'Income' ? 'income' : ''}`}>{(transactionType === 'Expenses' || transactionType === 'Investment') ? '- ' : ''} ₹{transactionInfo.amount}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        })
                                                    }
                                                </div>
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
