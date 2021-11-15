import React, { Fragment, FC, useRef } from 'react';
import { CancelIcon, DropDownIcon } from '../../../UI/Icon';
import { transactionType, FullMonthNameList, FullMonthName } from '../../../Util/DropdownInfo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/Reducers';


const TransactionFilter: FC = () => {

    // ref
    const groupByRef = useRef(null);
    const monthRef = useRef(null);


    // redux-state
    const { currentFilterGroupBy, currentFilterMonth } = useSelector((state: RootState) => state.transactionReducer);


    // dispatch
    const dispatch = useDispatch();


    const handleCustomDropDown = (parentRef: { [key: string]: any }) => {
        if (parentRef.current) {
            if (parentRef.current.classList.contains('show')) parentRef.current.classList.remove('show');
            else parentRef.current.classList.add('show');
        }
    }

    const handleFilterGroupBy = (e: React.MouseEvent<HTMLElement, MouseEvent>, parentRef: { [key: string]: any }) => {
        if (e !== null && e.target instanceof HTMLElement) {
            const element = e.target;
            handleCustomDropDown(parentRef);
            dispatch({
                type: 'SET_CURRENT_FILTER_GROUP_BY',
                filterGroupBy: element.dataset.value
            });
        }
    }

    const handleFilterMonth = (e: React.MouseEvent<HTMLElement, MouseEvent>, parentRef: { [key: string]: any }) => {
        if (e !== null && e.target instanceof HTMLElement) {
            const element = e.target;
            handleCustomDropDown(parentRef);
            dispatch({
                type: 'SET_CURRENT_FILTER_MONTH',
                filterMonth: element.dataset.value
            });
        }
    }

    const removeFilterGroupBy = () => {
        dispatch({
            type: 'SET_CURRENT_FILTER_GROUP_BY',
            filterGroupBy: ''
        });
    }

    const removeFilterMonth = () => {
        dispatch({
            type: 'SET_CURRENT_FILTER_MONTH',
            filterMonth: ''
        })
    }


    const renderFilteredOption = (displayName: string | undefined, callback: () => void) => (
        <div className="col-md-2">
            <div className="finance_filter_selected_option_container">
                <div className="name">{displayName}</div>
                <CancelIcon
                    cssClass="icon"
                    handleEvent={() => callback()}
                />
            </div>
        </div>
    )

    return (
        <Fragment>
            <div className="finance_filter_container">
                <div className="row" style={{ alignItems: 'center' }}>
                    {
                        currentFilterGroupBy && renderFilteredOption(currentFilterGroupBy, removeFilterGroupBy)
                    }
                    {
                        currentFilterMonth && renderFilteredOption(FullMonthName[Number(currentFilterMonth)], removeFilterMonth)
                    }
                    <div className="col-md-2">
                        <div className="finance_filter_custom_dropdown">
                            <div className='finance_filter_custom_dropdown_container' onClick={() => handleCustomDropDown(groupByRef)}>
                                <input
                                    className="model_custom_dropdown_value"
                                    placeholder="Group By"
                                    readOnly
                                    value={currentFilterGroupBy || ''}
                                />
                                <DropDownIcon cssClass="model_custom_dropdown_icon" />
                            </div>
                            <div className="finance_filter_custom_dropdown_list" ref={groupByRef}>
                                {
                                    transactionType.map((transactionInfo, index) => {
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
                                    value={currentFilterMonth ? FullMonthName[Number(currentFilterMonth)] : ''}
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
