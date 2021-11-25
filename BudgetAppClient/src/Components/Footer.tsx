import React, { Fragment, FC } from 'react';
import { GithubIcon } from '../UI/Icon';

const Footer: FC = () => {

    return (
        <Fragment>
            <div className="footer_main">
                <a href="https://github.com/SujithGunasekaran" target="_blank" rel="noreferrer">
                    <GithubIcon
                        cssClass="footer_icon"
                    />
                </a>
            </div>
        </Fragment>
    )

}

export default Footer;
