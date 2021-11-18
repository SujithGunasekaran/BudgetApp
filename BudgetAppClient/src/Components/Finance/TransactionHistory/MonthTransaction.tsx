import React, { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';


const MonthTransactionOverview: FC = () => {

    // redux-state
    const { monthIncome, monthExpenses, monthInvestment, monthBalance } = useSelector((state: RootState) => state.monthlyTransactionReducer);

    return (
        <Fragment>
            <div className="month_transaction_container">
                <div className="row">
                    <div className="col-6 col-sm-3 col-md-3">
                        <div className="month_transaction_info_container">
                            <div className="heading">Income</div>
                            <div className="value">₹ {Number(monthIncome).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="col-6 col-sm-3 col-md-3">
                        <div className="month_transaction_info_container">
                            <div className="heading">Expenses</div>
                            <div className="value">₹ {Number(monthExpenses).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="col-6 col-sm-3 col-md-3">
                        <div className="month_transaction_info_container">
                            <div className="heading">Investment</div>
                            <div className="value">₹ {Number(monthInvestment).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="col-6 col-sm-3 col-md-3">
                        <div className="month_transaction_info_container">
                            <div className="heading">Balance</div>
                            <div className="value">₹ {Number(monthBalance).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

}

export default MonthTransactionOverview;
