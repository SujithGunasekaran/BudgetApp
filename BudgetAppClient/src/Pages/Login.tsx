import React, { FC, Fragment, useState } from 'react';
import useForm from '../Hooks/useForm';
import useLoader from '../Hooks/useLoader';
import { Link } from 'react-router-dom';
import { userAxios } from '../Util/Api';
import { formValidation } from '../Util';
import ErrorMessage from '../UI/Messages/ErrorMessage';
import { Redirect, withRouter } from 'react-router';


type LoginProps = {
    history: any
}

const Login: FC<LoginProps> = (props) => {

    // react-state
    const [loginError, setLoginError] = useState<string | null>(null);

    // hooks
    const { formValue, formError, setFormError, handleFormValueWithEvent } = useForm();
    const { loader, setLoader } = useLoader();

    // props
    const { history } = props;

    // session-storage
    const userToken = sessionStorage.getItem('userToken');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isFormValid = formValidation(['username', 'password'], formValue, setFormError);
        if (isFormValid) {
            setLoader(true);
            try {
                const response: any = await userAxios.post(`/login?username=${formValue.username}&password=${formValue.password}`);
                if (response.data && response.data.status === 'Success') {
                    const { data } = response;
                    sessionStorage.setItem('userToken', data.token);
                    history.push('/home');
                }
            }
            catch (err: any) {
                setLoader(false);
                if (err && err.response && err.response.data) {
                    setLoginError(err.response.data.message);
                }
                else setLoginError('Error while Loggin in, Please try again later!');
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
                                    <div className="form_app_card_heading">Login in to continue</div>
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
    }

    else return <Redirect to='/home' />

};


export default withRouter(Login);
