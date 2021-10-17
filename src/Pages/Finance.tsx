import React, { FC, Fragment, lazy, Suspense } from 'react';

const FinanceTractionHeader = lazy(() => import('../UI/Finance/TransactionHeader'));
const FinanceIconHeader = lazy(() => import('../UI/Finance/IconHeader'));

const Finance: FC = () => {

    return (
        <Fragment>
            <div className="finance_main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <FinanceTractionHeader />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="finance_top_header_container">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <FinanceIconHeader />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};


export default Finance;
