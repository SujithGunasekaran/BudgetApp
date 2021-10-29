import React, { FC, Fragment } from 'react';
import { CoinIcon, WalletIcon, BankIcon, CurrencyExchangeIcon } from '../Icon';

const TransactionHeader: FC = () => {

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
                            <div className="finance_transaction_info_money">₹2,00,000</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="finance_transaction_info_container">
                            <CurrencyExchangeIcon
                                cssClass="finance_transaction_info_icon"
                            />
                            <div className="finance_transaction_info_name">Expenses</div>
                            <div className="finance_transaction_info_money">₹30,000</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="finance_transaction_info_container">
                            <BankIcon
                                cssClass="finance_transaction_info_icon"
                            />
                            <div className="finance_transaction_info_name">Investment</div>
                            <div className="finance_transaction_info_money">₹1,00,000</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="finance_transaction_info_container">
                            <WalletIcon
                                cssClass="finance_transaction_info_icon"
                            />
                            <div className="finance_transaction_info_name">Balance</div>
                            <div className="finance_transaction_info_money">₹10,000</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};


export default TransactionHeader;
