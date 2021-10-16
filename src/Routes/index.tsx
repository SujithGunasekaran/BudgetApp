import React, { FC, Fragment, lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const Header = lazy(() => import('../Components/Header'));
const Login = lazy(() => import('../Pages/Login'));
const Home = lazy(() => import('../Pages/Home'));


const Routes: FC = () => {

    return (
        <BrowserRouter>
            <div className="body-main">
                <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Route path='/' exact component={Login} />
                        <Fragment>
                            <Header />
                            <Route path='/home' exact component={Home} />
                        </Fragment>
                    </Suspense>
                </Switch>
            </div>
        </BrowserRouter>
    )

};

export default Routes;
