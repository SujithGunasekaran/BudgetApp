import React, { FC, Fragment, useState } from 'react';
import useForm from '../Hooks/useForm';
import useLoader from '../Hooks/useLoader';
import { Link } from 'react-router-dom';
import { formValidation } from '../Util';
import { userAxios } from '../Util/Api';
import ErrorMessage from '../UI/Messages/ErrorMessage';
import SuccessMessage from '../UI/Messages/SuccessMessage';
import { Redirect } from 'react-router-dom';

const Signup: FC = () => {

    // react-state
    const [signupError, setSignupError] = useState<string | null>('');
    const [signupSuccess, setSignupSuccess] = useState<string | null>('');

    // hooks
    const { formValue, formError, setFormError, handleFormValueWithEvent } = useForm();
    const { loader, setLoader } = useLoader();

    // session-data
    const userToken = sessionStorage.getItem('userToken');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isFormValid = formValidation(['username', 'email', 'password'], formValue, setFormError);
        if (isFormValid) {
            setLoader(true);
            try {
                const response: any = await userAxios.post(`/register`, formValue);
                if (response.data && response.data.status === 'Success') {
                    setSignupSuccess(response.data.message);
                }
            }
            catch (err: any) {
                if (err && err.response && err.response.data) {
                    setSignupError(err.response.data.message);
                }
                else setSignupError('Error while Signup, Please try again later!');
            }
            finally {
                setLoader(false);
            }
        }
    }

    const closeSuccessModel = () => {
        setSignupSuccess(null);
    }

    const closeErrorModel = () => {
        setSignupError(null);
    }


    const renderSuccessMessage = () => (
        <SuccessMessage
            message={signupSuccess}
            handleMessageModel={closeSuccessModel}
        />
    )

    const renderErrorMessage = () => (
        <Fragment>
            <ErrorMessage
                message={signupError}
                handleMessageModel={closeErrorModel}
            />
        </Fragment>
    )

    if (!userToken) {
        return (
            <Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4 mx-auto">
                            <div className="form_main_container">
                                <div className="form_app_info_container">
                                    <img src="/Budget_icon_512.png" alt="BugetIcon" className="form_app_logo" />
                                    <div className="form_app_name">Budget Tracker</div>
                                </div>
                                <div className="form_app_card_container">
                                    <div className="form_app_card_heading">Sign up to continue</div>
                                    {
                                        signupError && renderErrorMessage()
                                    }
                                    {
                                        signupSuccess && renderSuccessMessage()
                                    }
                                    <form onSubmit={handleFormSubmit}>
                                        <input
                                            type="text"
                                            className="form_app_card_form_input"
                                            placeholder="userName"
                                            name="username"
                                            value={formValue?.username ?? ''}
                                            onChange={handleFormValueWithEvent}
                                        />
                                        {
                                            formError.usernameError &&
                                            <div className="form_app_card_error_message">{formError.usernameError}</div>
                                        }
                                        <input
                                            type="email"
                                            className="form_app_card_form_input"
                                            placeholder="Email Address"
                                            name="email"
                                            value={formValue?.email ?? ''}
                                            onChange={handleFormValueWithEvent}
                                        />
                                        {
                                            formError.emailError &&
                                            <div className="form_app_card_error_message">{formError.emailError}</div>
                                        }
                                        <input
                                            type="password"
                                            className="form_app_card_form_input"
                                            placeholder="Password"
                                            name="password"
                                            value={formValue?.password ?? ''}
                                            onChange={handleFormValueWithEvent}
                                        />
                                        {
                                            formError.passwordError &&
                                            <div className="form_app_card_error_message">{formError.passwordError}</div>
                                        }
                                        <button disabled={loader ? true : false} type="submit" className="form_app_card_form_btn">
                                            {
                                                !loader ? 'Create Account' :
                                                    <div className="spinner-border" role="status">
                                                    </div>
                                            }
                                        </button>
                                        <div className="form_app_card_info_link">
                                            Already have an account ? <Link to='/'>Sign In</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    else return <Redirect to='/home' />

};


export default Signup;
