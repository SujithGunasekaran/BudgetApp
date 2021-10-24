import React, { FC, Fragment } from 'react';
import { CancelIcon } from '../Icon';

type SuccessMessageProps = {
    message: string | null,
    handleMessageModel: () => void
}

const SuccessMessage: FC<SuccessMessageProps> = (props) => {

    const { message, handleMessageModel } = props;

    return (
        <Fragment>
            <div className="message_container success">
                <div className="message_text success">{message || ''}</div>
                <CancelIcon
                    cssClass="message_cancel success"
                    handleEvent={handleMessageModel}
                />
            </div>
        </Fragment>
    )

}

export default SuccessMessage;
