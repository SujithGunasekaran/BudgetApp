import React, { FC, Fragment } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { PersonIcon } from '../UI/Icon';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/Reducers';

type HeaderProps = {
    history: any,
    location: any,
    match: any
}

const Header: FC<HeaderProps> = (props) => {

    // props
    const { location } = props;

    // redux-State
    const { userName } = useSelector((state: RootState) => state.userInfoReducer);

    return (
        <Fragment>
            {
                location.pathname !== '/' &&
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
                        <div className="header_user_info_logo_bg">
                            <PersonIcon
                                cssClass="header_user_info_logo"
                            />
                        </div>
                        <div className="header_user_info_name">{userName}</div>
                    </div>
                </div>
            }
        </Fragment>
    )

};

export default withRouter(Header);
