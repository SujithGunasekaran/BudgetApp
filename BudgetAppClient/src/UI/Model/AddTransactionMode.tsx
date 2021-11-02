import React, { FC, Fragment, useRef, useState, lazy, Suspense } from 'react';
import { CancelIcon, DropDownIcon } from '../Icon';
import { transactionType, transactionOptions } from '../../Util/DropdownInfo';
import useForm from '../../Hooks/useForm';
import { formValidation, FullMonth } from '../../Util';
import { transactionAxios } from '../../Util/Api';
import { RootState } from '../../ReduxStore/Reducers';
import { useSelector, useDispatch } from 'react-redux';

const SuccessMessage = lazy(() => import('../Messages/SuccessMessage'));
const ErrorMessage = lazy(() => import('../Messages/ErrorMessage'));

type TransactionModelProps = {
    history?: any
    handleTransactionView: (value?: boolean) => void
}

const AddTransactionModel: FC<TransactionModelProps> = (props) => {

    // state
    const [apiSuccessMessage, setApiSuccessMessage] = useState<string | null>(null);
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // props
    const { history, handleTransactionView } = props;

    // hooks
    const { formValue, formError, handleFormValueWithEvent, handleFormValueWithParams, setFormError } = useForm();

    // ref
    const transactionTypeRef = useRef(null);
    const transactionCategoryRef = useRef(null);

    // redux-state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);

    // dispatch
    const dispatch = useDispatch();


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

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isFormValid = formValidation(['transactiontype', 'transactionCategory', 'amount'], formValue, setFormError);
        if (isFormValid) {
            setIsLoading(true);
            const userToken = sessionStorage.getItem('userToken');
            const todaysDate = new Date();
            const year = todaysDate.getFullYear();
            const month = FullMonth[todaysDate.getMonth()];
            const date = todaysDate.getDate();
            const inputData = {
                year,
                month,
                date,
                ...formValue
            };
            try {
                const response: any = await transactionAxios.post(`/addTransaction?userId=${userInfo.id}`, inputData, {
                    headers: {
                        'x-powered-token': userToken || ''
                    }
                });
                if (response && response.data && response.data.status === 'Success') {
                    dispatch({
                        type: 'SET_TRANSACTION_OVERVIEW',
                        transactionOverview: response.data.transactionOverview
                    })
                    setApiSuccessMessage('Transaction Added Successfully');
                }
            }
            catch (err: any) {
                if (err && err.response && err.response.data) {
                    const { message } = err.response.data;
                    if (message === 'InvalidToken') {
                        setApiErrorMessage('Invalid Token, User not Authenticated');
                        sessionStorage.removeItem('userToken');
                        setTimeout(() => {
                            history.push('/');
                        }, 3000)
                    }
                }
                else setApiErrorMessage('Error while Adding Transaction Please Try agin later!');
            }
            finally {
                setIsLoading(false);
            }
        }
    }

    const handleSuccessMessageModel = () => {
        setApiSuccessMessage(null);
    }

    const handleErrorMessageModel = () => {
        setApiErrorMessage(null);
    }


    const renderSuccessMessage = () => (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessMessage
                message={apiSuccessMessage}
                handleMessageModel={handleSuccessMessageModel}
            />
        </Suspense>
    );

    const renderErrorMessage = () => (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorMessage
                message={apiErrorMessage}
                handleMessageModel={handleErrorMessageModel}
            />
        </Suspense>
    )

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
                {
                    apiSuccessMessage && renderSuccessMessage()
                }
                {
                    apiErrorMessage && renderErrorMessage()
                }
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
                    {
                        formError.transactiontypeError &&
                        <div className="form_app_card_error_message">{formError.transactiontypeError}</div>
                    }
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
                            {
                                formError.transactionCategoryError &&
                                <div className="form_app_card_error_message">{formError.transactionCategoryError}</div>
                            }
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
                        data-remove="comma"
                        onChange={handleFormValueWithEvent}
                        value={formValue.amount ? Number(formValue.amount).toLocaleString('en-IN') : ''}
                    />
                    {
                        formError.amountError &&
                        <div className="form_app_card_error_message">{formError.amountError}</div>
                    }
                    <button disabled={isLoading} type="submit" className="model_form_btn">
                        {
                            !isLoading ? 'Add transaction' :
                                <div className="spinner-border" role="status">
                                </div>
                        }
                    </button>
                </form>
            </div>
        </Fragment>
    )

}

export default AddTransactionModel;
