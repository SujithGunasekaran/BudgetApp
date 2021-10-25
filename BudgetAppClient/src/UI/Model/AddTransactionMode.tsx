import React, { FC, Fragment, useRef } from 'react';
import { CancelIcon, DropDownIcon } from '../Icon';
import { transactionType, transactionOptions } from '../../Util/DropdownInfo';
import useForm from '../../Hooks/useForm';
import { RootState } from '../../ReduxStore/Reducers';
import { useDispatch, useSelector } from 'react-redux';

type TransactionModelProps = {
    handleTransactionView: (value?: boolean) => void
}

const AddTransactionModel: FC<TransactionModelProps> = (props) => {

    // props
    const { handleTransactionView } = props;

    // hooks
    const { formValue, handleFormValueWithEvent, handleFormValueWithParams } = useForm();

    // redux-state
    const { transactionData } = useSelector((state: RootState) => state.transactionReducer);

    // dispatch
    const dispatch = useDispatch();

    // ref
    const transactionTypeRef = useRef(null);
    const transactionCategoryRef = useRef(null);


    const handleCustomDropDown = (refObject: { [key: string]: any }) => {
        if (refObject) {
            if (refObject.current.classList.contains('show')) refObject.current.classList.remove('show');
            else refObject.current.classList.add('show');
        }

    }

    const handleCustomDropDownValue = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, parenRef: { [key: string]: any }) => {
        if (e !== null && e.target instanceof HTMLElement) {
            const element = e.target;
            handleFormValueWithParams(element.dataset.name, element.dataset.value, element.dataset.clearkey);
            handleCustomDropDown(parenRef);
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const todaysDate = new Date();
        dispatch({
            type: 'SET_TRANSACTION',
            value: {
                month: `${todaysDate.getMonth()}`,
                date: `${todaysDate.getDate()}`,
                transactionInput: formValue
            }
        });
    }

    return (
        <Fragment>
            <div className="model_container">
                <div className="model_header_container">
                    <div className="model_header_name">Add Transaction</div>
                    <CancelIcon
                        handleEvent={() => handleTransactionView(false)}
                        cssClass="model_header_icon"
                    />
                </div>
                <form onSubmit={handleFormSubmit} style={{ margin: '30px 0px 15px 0px' }}>
                    <div className='model_custom_dropdown_container' onClick={() => handleCustomDropDown(transactionTypeRef)}>
                        <input
                            className="model_custom_dropdown_value"
                            placeholder="Select TransactionType"
                            readOnly
                            value={formValue?.transactiontype ?? ''}
                        />
                        <DropDownIcon cssClass="model_custom_dropdown_icon" />
                    </div>
                    <div className="model_custom_dopdown_list" ref={transactionTypeRef}>
                        {
                            transactionType.map((transactionInfo, index) => (
                                <div key={index} onClick={(e) => handleCustomDropDownValue(e, transactionTypeRef)} data-value={transactionInfo.value} data-name="transactiontype" data-clearkey="transactionCategory" className="model_custom_dropdown_item">{transactionInfo.displayValue}</div>
                            ))
                        }
                    </div>
                    {
                        transactionOptions[formValue.transactiontype] &&
                        <Fragment>
                            <div className='model_custom_dropdown_container' onClick={() => handleCustomDropDown(transactionCategoryRef)}>
                                <input
                                    className="model_custom_dropdown_value"
                                    placeholder="Select Transaction Categories"
                                    readOnly
                                    value={formValue?.transactionCategory ?? ''}
                                />
                                <DropDownIcon cssClass="model_custom_dropdown_icon" />
                            </div>
                            <div className="model_custom_dopdown_list" ref={transactionCategoryRef}>
                                {
                                    transactionOptions[formValue.transactiontype] &&
                                    transactionOptions[formValue.transactiontype].map((optionInfo: any, index: number) => (
                                        <div key={index} onClick={(e) => handleCustomDropDownValue(e, transactionCategoryRef)} data-value={optionInfo.value} data-clearkey={undefined} data-name="transactionCategory" className="model_custom_dropdown_item">{optionInfo.displayValue}</div>
                                    ))
                                }
                            </div>
                        </Fragment>
                    }
                    <input
                        className="model_form_input"
                        placeholder="Enter Description"
                        name="description"
                        onChange={handleFormValueWithEvent}
                        value={formValue?.description ?? ''}
                    />
                    <input
                        className="model_form_input"
                        placeholder="Enter Amount"
                        name="amount"
                        onChange={handleFormValueWithEvent}
                        value={formValue?.amount ?? ''}
                    />
                    <button type="submit" className="model_form_btn">Add Transaction</button>
                </form>
            </div>
        </Fragment>
    )

}

export default AddTransactionModel;
