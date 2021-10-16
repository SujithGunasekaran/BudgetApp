import React, { FC, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../ReduxStore/Reducers';
import { Redirect } from 'react-router';


const Login: FC = () => {

    const [userInfo, setUserInfo] = useState<string>('');

    // redux-state
    const { userName } = useSelector((state: RootState) => state.userInfoReducer);

    // redux-dispatch
    const dispatch = useDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo(e.target.value);
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({
            type: 'SET_USER_NAME',
            userName: userInfo
        })
    }

    if (!userName) {
        return (
            <Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-5 mx-auto">
                            <div className="login_main_container">
                                <div className="login_app_info_container">
                                    <img src="/Budget_icon_512.png" alt="BugetIcon" className="login_app_logo" />
                                    <div className="login_app_name">Budget Tracker</div>
                                </div>
                                <div className="login_app_card_container">
                                    <div className="login_app_card_heading">Welcome</div>
                                    <form onSubmit={handleFormSubmit}>
                                        <input
                                            className="login_app_card_form_input"
                                            placeholder="Enter Your Name"
                                            value={userInfo}
                                            onChange={handleInputChange}
                                        />
                                        <button type="submit" className="login_app_card_form_btn">Sign In</button>
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


export default Login;
