import React, { FC, Fragment, lazy, Suspense } from 'react';
import { withRouter } from 'react-router';
import AuthHoc from '../Hoc/Auth';

const TransactionOverview = lazy(() => import('../Components/TransactionOverview'));
const CategoryDashboard = lazy(() => import('../Components/CategoryDashboard'));

interface objectKeys {
    [key: string]: any
}

type HomeProps = {
    history: objectKeys
}

const Home: FC<HomeProps> = (props) => {

    // props
    const { history } = props;

    return (
        <Fragment>
            <div className="home_main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <TransactionOverview
                                history={history}
                            />
                        </div>
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <CategoryDashboard
                            history={history}
                        />
                    </Suspense>
                </div>
            </div>
        </Fragment>
    )

};

export default withRouter(AuthHoc(Home));
