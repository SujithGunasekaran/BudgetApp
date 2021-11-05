import React, { Fragment, FC, useRef } from 'react';
import { CancelIcon, DropDownIcon } from '../../../UI/Icon';
import { transactionType, FullMonthNameList } from '../../../Util/DropdownInfo';

type TransactionFilterProps = {
    history?: any
}

const TransactionFilter: FC<TransactionFilterProps> = (props) => {

    // ref
    const groupByRef = useRef(null);
    const monthRef = useRef(null);

    const handleCustomDropDown = (e: React.MouseEvent<HTMLElement, MouseEvent>, parentRef: { [key: string]: any }) => {
        if (parentRef.current) {
            if (parentRef.current.classList.contains('show')) parentRef.current.classList.remove('show');
            else parentRef.current.classList.add('show');
        }
    }

    return (
        <Fragment>
            <div className="finance_filter_container">
                <div className="row" style={{ alignItems: 'center' }}>
                    <div className="col-md-2">
                        <div className="finance_filter_selected_option_container">
                            <div className="name">Group</div>
                            <CancelIcon
                                cssClass="icon"
                                handleEvent={() => { }}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="finance_filter_custom_dropdown">
                            <div className='finance_filter_custom_dropdown_container' onClick={(e) => handleCustomDropDown(e, groupByRef)}>
                                <input
                                    className="model_custom_dropdown_value"
                                    placeholder="Group By"
                                    readOnly
                                />
                                <DropDownIcon cssClass="model_custom_dropdown_icon" />
                            </div>
                            <div className="finance_filter_custom_dropdown_list" ref={groupByRef}>
                                {
                                    transactionType.map((transactionInfo, index) => {
                                        return (
                                            <div key={index} data-value={transactionInfo.value} className="model_custom_dropdown_item">{transactionInfo.displayValue}</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="finance_filter_custom_dropdown">
                            <div className='finance_filter_custom_dropdown_container' onClick={(e) => handleCustomDropDown(e, monthRef)}>
                                <input
                                    className="model_custom_dropdown_value"
                                    placeholder="Group By"
                                    readOnly
                                />
                                <DropDownIcon cssClass="model_custom_dropdown_icon" />
                            </div>
                            <div className="finance_filter_custom_dropdown_list" ref={monthRef}>
                                {
                                    FullMonthNameList.map((monthInfo, index) => {
                                        return (
                                            <div key={index} data-value={monthInfo.value} className="model_custom_dropdown_item">{monthInfo.displayValue}</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

}


export default TransactionFilter;
