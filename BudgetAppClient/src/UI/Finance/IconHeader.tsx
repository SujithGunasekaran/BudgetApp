import React, { FC, Fragment, lazy, Suspense, useState } from 'react';
import { AddIcon, CalculatorIcon } from '../Icon';

const AddTransactionModel = lazy(() => import('../Model/AddTransactionMode'));

const IconHeader: FC = () => {

    const [transactionView, setTransactionView] = useState<Boolean>(false);
    const [calculatorView, setCalculatorView] = useState<Boolean>(false);

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
            {
                transactionView &&
                <div className="overlay">
                    <Suspense fallback={<div>Loading...</div>}>
                        <AddTransactionModel
                            handleTransactionView={handleTransactionView}
                        />
                    </Suspense>
                </div>
            }
        </Fragment>
    )

}

export default IconHeader;
