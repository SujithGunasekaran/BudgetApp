import React, { Fragment, FC, useRef } from 'react';
import { CancelIcon, DropDownIcon } from '../../../UI/Icon';
import { transactionType, FullMonthNameList, FullMonthName } from '../../../Util/DropdownInfo';


type TransactionFilterProps = {
    history?: any,
    filterGroupBy: string | undefined,
    filterMonth: string | undefined,
    setFilterGroupBy: React.Dispatch<React.SetStateAction<string | undefined>>,
    setFilterMonth: React.Dispatch<React.SetStateAction<string | undefined>>,
    handleFilterOptions: (inputValue: string | undefined, stateSetterCallback: React.Dispatch<React.SetStateAction<string | undefined>>) => void
}

const TransactionFilter: FC<TransactionFilterProps> = (props) => {

    // ref
    const groupByRef = useRef(null);
    const monthRef = useRef(null);

    // props
    const { filterGroupBy, filterMonth, setFilterGroupBy, setFilterMonth, handleFilterOptions, } = props;

    const handleCustomDropDown = (parentRef: { [key: string]: any }) => {
        if (parentRef.current) {
            if (parentRef.current.classList.contains('show')) parentRef.current.classList.remove('show');
            else parentRef.current.classList.add('show');
        }
    }

    const handleFilterGroupBy = (e: React.MouseEvent<HTMLElement, MouseEvent>, parentRef: { [key: string]: any }) => {
        if (e !== null && e.target instanceof HTMLElement) {
            const element = e.target;
            handleFilterOptions(element.dataset.value, setFilterGroupBy);
            handleCustomDropDown(parentRef);
        }
    }

    const handleFilterMonth = (e: React.MouseEvent<HTMLElement, MouseEvent>, parentRef: { [key: string]: any }) => {
        if (e !== null && e.target instanceof HTMLElement) {
            const element = e.target;
            handleFilterOptions(element.dataset.value, setFilterMonth);
            handleCustomDropDown(parentRef)
        }
    }


    const renderFilteredOption = (displayName: string | undefined, callback: React.Dispatch<React.SetStateAction<string | undefined>>) => (
        <div className="col-md-2">
            <div className="finance_filter_selected_option_container">
                <div className="name">{displayName}</div>
                <CancelIcon
                    cssClass="icon"
                    handleEvent={() => handleFilterOptions(undefined, callback)}
                />
            </div>
        </div>
    )

    return (
        <Fragment>
            <div className="finance_filter_container">
                <div className="row" style={{ alignItems: 'center' }}>
                    {
                        filterGroupBy && renderFilteredOption(filterGroupBy, setFilterGroupBy)
                    }
                    {
                        filterMonth && renderFilteredOption(FullMonthName[Number(filterMonth)], setFilterMonth)
                    }
                    <div className="col-md-2">
                        <div className="finance_filter_custom_dropdown">
                            <div className='finance_filter_custom_dropdown_container' onClick={() => handleCustomDropDown(groupByRef)}>
                                <input
                                    className="model_custom_dropdown_value"
                                    placeholder="Group By"
                                    readOnly
                                    value={filterGroupBy || ''}
                                />
                                <DropDownIcon cssClass="model_custom_dropdown_icon" />
                            </div>
                            <div className="finance_filter_custom_dropdown_list" ref={groupByRef}>
                                {
                                    transactionType.map((transactionInfo, index) => {
                                        console.log("list render")
                                        return (
                                            <div key={index} data-value={transactionInfo.value} onClick={(e) => handleFilterGroupBy(e, groupByRef)} className="model_custom_dropdown_item">{transactionInfo.displayValue}</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="finance_filter_custom_dropdown">
                            <div className='finance_filter_custom_dropdown_container' onClick={() => handleCustomDropDown(monthRef)}>
                                <input
                                    className="model_custom_dropdown_value"
                                    placeholder="Month"
                                    readOnly
                                    value={FullMonthName[Number(filterMonth)] || ''}
                                />
                                <DropDownIcon cssClass="model_custom_dropdown_icon" />
                            </div>
                            <div className="finance_filter_custom_dropdown_list" ref={monthRef}>
                                {
                                    FullMonthNameList.map((monthInfo, index) => {
                                        return (
                                            <div key={index} data-value={monthInfo.value} onClick={(e) => handleFilterMonth(e, monthRef)} className="model_custom_dropdown_item">{monthInfo.displayValue}</div>
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
