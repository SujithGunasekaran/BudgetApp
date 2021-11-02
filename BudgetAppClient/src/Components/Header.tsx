import React, { FC, Fragment, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { PersonIcon, LogoutIcon } from '../UI/Icon';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/Reducers';

const StatusConfirmModel = lazy(() => import('../UI/Model/StatusConfirmModel'));

type HeaderProps = {
    history: any,
    location: any,
    match: any
}

const Header: FC<HeaderProps> = (props) => {

    // react-state
    const [showLogoutModel, setShowLogoutModel] = useState<boolean>(false);
    const [logoutLoader, setLogoutLoader] = useState<boolean>(false);

    // props
    const { location, history } = props;

    // redux state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);

    // ref
    const userModelRef = useRef<any>(null);

    useEffect(() => {
        if (location.pathname !== '/' && location.pathname !== '/createAccount') {
            const handleCloseUserModel = () => {
                if (userModelRef.current) {
                    userModelRef.current.classList.remove('show');
                }
            }
            document.body.addEventListener('click', handleCloseUserModel);
            return () => {
                document.body.removeEventListener('click', handleCloseUserModel);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const showUserModel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, refObject: { [key: string]: any }) => {
        e.stopPropagation();
        if (refObject) {
            if (!refObject.current.classList.contains('show')) refObject.current.classList.add('show');
            else refObject.current.classList.remove('show');
        }
    }

    const handleLogoutModel = (input: boolean) => {
        setShowLogoutModel(input);
    }

    const handleLogout = () => {
        setLogoutLoader(true);
        setTimeout(() => {
            sessionStorage.removeItem('userToken');
            setLogoutLoader(false);
            setShowLogoutModel(false);
            history.push('/');
        }, 2000)
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
                        <div className="header_user_info_name" onClick={(e) => showUserModel(e, userModelRef)}>{userInfo?.userName ?? ''}</div>
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
                                <div className="header_user_model_name" onClick={() => handleLogoutModel(true)}>Logout</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                showLogoutModel &&
                <div className="overlay">
                    <Suspense fallback={<div>Loading...</div>}>
                        <StatusConfirmModel
                            message="Are you sure you want to logout"
                            successBtnDisplay="Logout"
                            handleConfirmModelView={handleLogoutModel}
                            handleConfirmSuccess={handleLogout}
                            loader={logoutLoader}
                        />
                    </Suspense>
                </div>
            }
        </Fragment>
    )

};

export default withRouter(Header);
