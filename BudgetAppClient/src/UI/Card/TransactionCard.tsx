import React, { FC, Fragment } from 'react';
import { CoinIcon, CurrencyExchangeIcon, BankIcon, WalletIcon } from '../Icon';


type transactionCardProps = {
    income: number,
    expenses: number,
    investment: number,
    balance: number,
    column?: string
}

const TransactionCard: FC<transactionCardProps> = (props) => {

    // props
    const { income, expenses, investment, balance, column } = props;

    return (
        <Fragment>
            <div className="row">
                <div className={column || "col-md-3"}>
                    <div className="finance_transaction_info_container">
                        <CoinIcon
                            cssClass="finance_transaction_info_icon"
                        />
                        <div className="finance_transaction_info_name">Income</div>
                        <div className="finance_transaction_info_money">₹ {Number(income).toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div className={column || "col-md-3"}>
                    <div className="finance_transaction_info_container">
                        <CurrencyExchangeIcon
                            cssClass="finance_transaction_info_icon"
                        />
                        <div className="finance_transaction_info_name">Expenses</div>
                        <div className="finance_transaction_info_money">₹ {Number(expenses).toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div className={column || "col-md-3"}>
                    <div className="finance_transaction_info_container">
                        <BankIcon
                            cssClass="finance_transaction_info_icon"
                        />
                        <div className="finance_transaction_info_name">Investment</div>
                        <div className="finance_transaction_info_money">₹ {Number(investment).toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div className={column || "col-md-3"}>
                    <div className="finance_transaction_info_container">
                        <WalletIcon
                            cssClass="finance_transaction_info_icon"
                        />
                        <div className="finance_transaction_info_name">Balance</div>
                        <div className="finance_transaction_info_money">₹ {Number(balance).toLocaleString('en-IN')}</div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

}


export default TransactionCard;
