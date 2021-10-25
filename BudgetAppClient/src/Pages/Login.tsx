import React, { FC, Fragment, useState } from 'react';
import useForm from '../Hooks/useForm';
import useLoader from '../Hooks/useLoader';
import { Link } from 'react-router-dom';
import { userAxios } from '../Util/Api';
import { formValidation } from '../Util';
import ErrorMessage from '../UI/Messages/ErrorMessage';


const Login: FC = () => {

    // react-state
    const [loginError, setLoginError] = useState<string | null>(null);

    // hooks
    const { formValue, formError, setFormError, handleFormValueWithEvent } = useForm();
    const { loader, setLoader } = useLoader();

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isFormValid = formValidation(['username', 'password'], formValue, setFormError);
        if (isFormValid) {
            setLoader(true);
            try {
                const response = await userAxios.post(`/login?username=${formValue.username}&password=${formValue.password}`);
                console.log(response);
            }
            catch (err: any) {
                if (err.response.data) {
                    setLoginError(err.response.data.message);
                }
            }
            finally {
                setLoader(false);
            }
        }
    }

    const closeModel = () => {
        setLoginError(null);
    }


    const renderErrorMessage = () => (
        <ErrorMessage
            message={loginError}
            handleMessageModel={closeModel}
        />
    )

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-5 mx-auto">
                        <div className="form_main_container">
                            <div className="form_app_info_container">
                                <img src="/Budget_icon_512.png" alt="BugetIcon" className="form_app_logo" />
                                <div className="form_app_name">Budget Tracker</div>
                            </div>
                            <div className="form_app_card_container">
                                <div className="form_app_card_heading">Login</div>
                                {
                                    loginError && renderErrorMessage()
                                }
                                <form onSubmit={handleFormSubmit}>
                                    <input
                                        type="text"
                                        className="form_app_card_form_input"
                                        placeholder="userName"
                                        name="username"
                                        value={formValue.username || ''}
                                        onChange={handleFormValueWithEvent}
                                    />
                                    {
                                        formError.usernameError &&
                                        <div className="form_app_card_error_message">{formError.usernameError}</div>
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
                                    <Link className="form_app_card_forgot_password" to="/">Forgot Password</Link>
                                    <button disabled={loader ? true : false} type="submit" className="form_app_card_form_btn">
                                        {
                                            !loader ? 'Sign In' :
                                                <div className="spinner-border" role="status">
                                                </div>
                                        }
                                    </button>
                                    <div className="form_app_card_info_link">
                                        Don't have an account ? <Link to='/createAccount'>SignUp</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )




};


export default Login;