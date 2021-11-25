import React, { FC, Fragment, lazy, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import AuthHoc from '../Hoc/Auth';

const TransactionOverView = lazy(() => import('../Components/Finance/TransactionOverview'));
const TransactionHistory = lazy(() => import('../Components/Finance/TransactionHistory'));

type FinanceProps = {
    history: any
}

const Finance: FC<FinanceProps> = (props) => {

    return (
        <Fragment>
            <div className="finance_main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <TransactionOverView
                                history={props.history}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Suspense fallback={<div>Loading...</div>}>
                                <TransactionHistory
                                    history={props.history}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};


export default withRouter(AuthHoc(Finance));
