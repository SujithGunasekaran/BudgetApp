import React, { Fragment, FC } from 'react';

type StatusConfirmModelProps = {
    message: string,
    loader?: boolean,
    successBtnDisplay: string,
    handleConfirmModelView: (input: boolean) => void,
    handleConfirmSuccess: () => void
}

const StatusConfirmModel: FC<StatusConfirmModelProps> = (props) => {

    // props
    const { message, loader, successBtnDisplay, handleConfirmModelView, handleConfirmSuccess } = props;

    return (
        <Fragment>
            <div className="model_confirm_container">
                <div className="model_confirm_header_name">{message}</div>
                <div className="model_confirm_footer_container">
                    <button className="model_confirm_cancel_btn" onClick={() => handleConfirmModelView(false)}>Cancel</button>
                    <button disabled={loader} className="model_confirm_success_btn" onClick={() => handleConfirmSuccess()}>
                        {
                            loader ?
                                <div className="spinner-border" role="status"></div>
                                : `${successBtnDisplay}`
                        }
                    </button>
                </div>
            </div>
        </Fragment>
    )

}

export default StatusConfirmModel;
