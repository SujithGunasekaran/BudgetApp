import React, { FC, Fragment } from 'react';
import { AddIcon, CalculatorIcon } from '../Icon';

const IconHeader: FC = () => {

    return (
        <Fragment>
            <div className="finance_top_header_info_container">
                <div className="finance_top_header_logo_bg">
                    <AddIcon
                        cssClass="finance_top_header_logo"
                    />
                </div>
                <div className="finance_top_header_heading">Add Transaction</div>
            </div>
            <div className="finance_top_header_info_container">
                <div className="finance_top_header_logo_bg">
                    <CalculatorIcon
                        cssClass="finance_top_header_logo"
                    />
                </div>
                <div className="finance_top_header_heading">Calculator</div>
            </div>
        </Fragment>
    )

}

export default IconHeader;
