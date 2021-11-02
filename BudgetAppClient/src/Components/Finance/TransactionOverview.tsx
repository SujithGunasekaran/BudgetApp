import React, { FC, Fragment, useEffect } from 'react';
import { CoinIcon, WalletIcon, BankIcon, CurrencyExchangeIcon } from '../../UI/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../ReduxStore/Reducers';
import { transactionAxios } from '../../Util/Api';


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
                <div className="row">
                    <div className="col-md-3">
                        <div className="finance_transaction_info_container">
                            <CoinIcon
                                cssClass="finance_transaction_info_icon"
                            />
                            <div className="finance_transaction_info_name">Income</div>
                            <div className="finance_transaction_info_money">₹ {Number(income).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="finance_transaction_info_container">
                            <CurrencyExchangeIcon
                                cssClass="finance_transaction_info_icon"
                            />
                            <div className="finance_transaction_info_name">Expenses</div>
                            <div className="finance_transaction_info_money">₹ {Number(expenses).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="finance_transaction_info_container">
                            <BankIcon
                                cssClass="finance_transaction_info_icon"
                            />
                            <div className="finance_transaction_info_name">Investment</div>
                            <div className="finance_transaction_info_money">₹ {Number(investment).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="finance_transaction_info_container">
                            <WalletIcon
                                cssClass="finance_transaction_info_icon"
                            />
                            <div className="finance_transaction_info_name">Balance</div>
                            <div className="finance_transaction_info_money">₹ {Number(balance).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};


export default TransactionHeader;
