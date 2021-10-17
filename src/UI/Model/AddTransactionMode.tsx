import React, { FC, Fragment, useEffect } from 'react';
import { CancelIcon, DropDownIcon } from '../Icon';

type TransactionModelProps = {
    handleTransactionView: (value: boolean) => void
}

const AddTransactionModel: FC<TransactionModelProps> = (props) => {

    // props
    const { handleTransactionView } = props;

    useEffect(() => {

        let customDopdown = document.querySelector('#custom-dropdown');
        let customDopdownList = document.querySelector('#custom-dropdown-list');
        if (customDopdown) {
            customDopdown.addEventListener('click', function () {
                if (customDopdownList && !customDopdownList.classList.contains('show')) customDopdownList.classList.add('show');
                else if (customDopdownList && customDopdownList.classList.contains('show')) customDopdownList.classList.remove('show');
            })
        }

    }, [])

    return (
        <Fragment>
            <div className="model_container">
                <div className="model_header_container">
                    <div className="model_header_name">Add Transaction</div>
                    <CancelIcon
                        handleEvent={handleTransactionView}
                        cssClass="model_header_icon"
                    />
                </div>
                <form style={{ margin: '30px 0px 15px 0px' }}>
                    <div className='model_custom_dropdown_container' id="custom-dropdown">
                        <div className="model_custom_dropdown_value">Value</div>
                        <DropDownIcon cssClass="model_custom_dropdown_icon" />
                    </div>
                    <div className="model_custom_dopdown_list" id="custom-dropdown-list">
                        <div className="model_custom_dropdown_item">Income</div>
                        <div className="model_custom_dropdown_item">Expenses</div>
                        <div className="model_custom_dropdown_item">Investment</div>
                    </div>
                    <input
                        className="model_form_input"
                        placeholder="Enter Amount"
                    />
                    <button type="submit" className="model_form_btn">Add Transaction</button>
                </form>
            </div>
        </Fragment>
    )

}

export default AddTransactionModel;
