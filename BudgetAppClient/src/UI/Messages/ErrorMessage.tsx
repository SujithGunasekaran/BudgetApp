import React, { FC, Fragment } from 'react';
import { CancelIcon } from '../Icon';

type ErrorMessageProps = {
    message: string | null,
    handleMessageModel: () => void
}

const ErrorMessage: FC<ErrorMessageProps> = (props) => {

    const { message, handleMessageModel } = props;

    return (
        <Fragment>
            <div className="message_container error">
                <div className="message_text error">{message || ''}</div>
                <CancelIcon
                    cssClass="message_cancel error"
                    handleEvent={handleMessageModel}
                />
            </div>
        </Fragment>
    )

}

export default ErrorMessage;
