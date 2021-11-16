import React, { FC, Fragment, lazy, Suspense, useState, memo } from 'react';
import { AddIcon, CalculatorIcon } from '../../../UI/Icon';
import { FullMonth } from '../../../Util/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';

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

    // redux-state
    const { currentFilterMonth } = useSelector((state: RootState) => state.transactionReducer);


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
                    <div className="finance_top_header_info_sub">Transaction for {currentFilterMonth ? FullMonth[Number(currentFilterMonth)] : FullMonth[monthYearDetail.month]} {monthYearDetail.year}.</div>
                </div>
                <div className="finance_top_header_info_child_two">
                    <div className="finance_top_header_info_container" onClick={() => handleTransactionView(true)}>
                        <div className="finance_top_header_logo_bg">
                            <AddIcon
                                cssClass="finance_top_header_logo"
                            />
                        </div>
                        <div className="finance_top_header_heading">Add Transaction</div>
                    </div>
                    <div className="finance_top_header_info_container" onClick={() => handleCalCulatorView(true)}>
                        <div className="finance_top_header_logo_bg">
                            <CalculatorIcon
                                cssClass="finance_top_header_logo"
                            />
                        </div>
                        <div className="finance_top_header_heading">Calculator</div>
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

export default memo(TransactionHistoryHeader);
