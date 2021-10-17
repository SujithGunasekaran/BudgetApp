import React, { FC, Fragment } from 'react';


const TransactionHeader: FC = () => {

    return (
        <Fragment>
            <div className="finance_transaction_header_container">
                <div className="finance_transaction_info_container success">
                    <div className="finance_transaction_info_name success">Income</div>
                    <div className="finance_transaction_info_money success">₹0</div>
                </div>
                <div className="finance_transaction_info_container danger">
                    <div className="finance_transaction_info_name danger">Expenses</div>
                    <div className="finance_transaction_info_money danger">₹0</div>
                </div>
                <div className="finance_transaction_info_container info">
                    <div className="finance_transaction_info_name info">Investment</div>
                    <div className="finance_transaction_info_money info">₹0</div>
                </div>
                <div className="finance_transaction_info_container warning">
                    <div className="finance_transaction_info_name warning">Balance</div>
                    <div className="finance_transaction_info_money warning">₹0</div>
                </div>
            </div>
        </Fragment>
    )

};


export default TransactionHeader;
