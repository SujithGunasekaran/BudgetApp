import React, { FC, Fragment, useEffect, useRef } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { PersonIcon, LogoutIcon } from '../UI/Icon';
import { userAxios } from '../Util/Api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/Reducers';

type HeaderProps = {
    history: any,
    location: any,
    match: any
}

const Header: FC<HeaderProps> = (props) => {

    // props
    const { location, history } = props;

    // dispatch
    const dispatch = useDispatch();

    // redux state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);

    // ref
    const userModelRef = useRef<any>(null);


    useEffect(() => {
        checkIstokenValid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {

        const handleCloseUserModel = () => {
            if (userModelRef) {
                userModelRef.current.classList.remove('show');
            }
        }

        document.body.addEventListener('click', handleCloseUserModel);

        return () => {
            document.body.removeEventListener('click', handleCloseUserModel);
        }

    }, [])


    const checkIstokenValid = async () => {
        try {
            const response: any = await userAxios.get('/checkUser');
            if (response.data && response.data.status === 'Success') {
                const { data } = response;
                dispatch({
                    type: 'SET_USER_INFO',
                    userInfo: data.userInfo
                });
            }
        }
        catch (err: any) {
            if (err.response && err.response.data) {
                if (err.response.data.message === 'Invalid Token') {
                    sessionStorage.clear();
                    history.push('/');
                }
            }
        }
    }

    const showUserModel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, refObject: { [key: string]: any }) => {
        e.stopPropagation();
        if (refObject) {
            if (!refObject.current.classList.contains('show')) refObject.current.classList.add('show');
            else refObject.current.classList.remove('show');
        }
    }

    return (
        <Fragment>
            {
                (location.pathname !== '/' && location.pathname !== '/createAccount') &&
                <div className="header_main_container">
                    <div className="header_logo_info_container">
                        <img src='/Budget_icon_512.png' className="header_logo" alt="Budget_logo" />
                        <div className="header_logo_name">Budget Tracker</div>
                    </div>
                    <div className="header_menu_list_container">
                        <Link to="/home" className={`header_menu_item ${location.pathname === '/home' && 'active'}`}>Overview</Link>
                        <Link to="/finance" className={`header_menu_item ${location.pathname === '/finance' && 'active'}`}>Finance</Link>
                    </div>
                    <div className="header_user_info_container">
                        <div className="header_user_info_name" onClick={(e) => showUserModel(e, userModelRef)}>{userInfo.userName}</div>
                        <div className="header_user_info_logo_bg" onClick={(e) => showUserModel(e, userModelRef)}>
                            <PersonIcon
                                cssClass="header_user_info_logo"
                            />
                        </div>
                        <div className="header_user_model" ref={userModelRef}>
                            <div className="header_user_model_item">
                                <PersonIcon
                                    cssClass="header_user_model_icon"
                                />
                                <div className="header_user_model_name">Profile</div>
                            </div>
                            <div className="header_user_model_item">
                                <LogoutIcon
                                    cssClass="header_user_model_icon"
                                />
                                <div className="header_user_model_name">Logout</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </Fragment>
    )

};

export default withRouter(Header);
