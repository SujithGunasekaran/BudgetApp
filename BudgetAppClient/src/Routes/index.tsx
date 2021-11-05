import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Login = lazy(() => import('../Pages/Login'));
const Sinup = lazy(() => import('../Pages/Signup'));
const Home = lazy(() => import('../Pages/Home'));
const Finance = lazy(() => import('../Pages/Finance'));

const Routes: FC = () => {

    return (
        <BrowserRouter>
            <Header />
            <div className="body-main">
                <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Route path='/' exact component={Login} />
                        <Route path='/createAccount' exact component={Sinup} />
                        <Route path='/home' exact component={Home} />
                        <Route path='/finance' exact component={Finance} />
                    </Suspense>
                </Switch>
            </div>
            <Footer />
        </BrowserRouter>
    )

};

export default Routes;
