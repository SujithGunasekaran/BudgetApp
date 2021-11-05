import React, { FC, Fragment, lazy, Suspense, useState } from 'react';
import { AddIcon, CalculatorIcon } from '../../../UI/Icon';
import { FullMonth } from '../../../Util/index';

const AddTransactionModel = lazy(() => import('../../../UI/Model/AddTransactionMode'));

type TransactionHistoryHeaderprops = {
    history?: any
}

const TransactionHistoryHeader: FC<TransactionHistoryHeaderprops> = (props) => {

    // react-state
    const [transactionView, setTransactionView] = useState<Boolean>(false);
    const [calculatorView, setCalculatorView] = useState<Boolean>(false);
    const [monthYearDetail] = useState<{ month: number, year: number }>({ month: new Date().getMonth(), year: new Date().getFullYear() });

    // props
    const { history } = props;

    const handleTransactionView = (value?: boolean | undefined) => {
        setCalculatorView(false);
        if (value !== undefined) setTransactionView(value);
    }

    const handleCalCulatorView = (value: Boolean) => {
        setTransactionView(false);
        setCalculatorView(true);
    }

    return (
        <Fragment>
            <div className="finance_top_header_container">
                <div className="finance_top_header_info_child_one">
                    <div className="finance_top_header_info_name">History</div>
                    <div className="finance_top_header_info_sub">Transaction for {FullMonth[monthYearDetail.month]} {monthYearDetail.year}.</div>
                </div>
                <div className="finance_top_header_info_child_two">
                    <div className="finance_top_header_info_container">
                        <div className="finance_top_header_logo_bg">
                            <AddIcon
                                cssClass="finance_top_header_logo"
                            />
                        </div>
                        <div className="finance_top_header_heading" onClick={() => handleTransactionView(true)}>Add Transaction</div>
                    </div>
                    <div className="finance_top_header_info_container">
                        <div className="finance_top_header_logo_bg">
                            <CalculatorIcon
                                cssClass="finance_top_header_logo"
                            />
                        </div>
                        <div className="finance_top_header_heading" onClick={() => handleCalCulatorView(true)}>Calculator</div>
                    </div>
                </div>
                {
                    transactionView &&
                    <div className="overlay">
                        <Suspense fallback={<div>Loading...</div>}>
                            <AddTransactionModel
                                history={history}
                                handleTransactionView={handleTransactionView}
                            />
                        </Suspense>
                    </div>
                }
            </div>
        </Fragment>
    )

}

export default TransactionHistoryHeader;
