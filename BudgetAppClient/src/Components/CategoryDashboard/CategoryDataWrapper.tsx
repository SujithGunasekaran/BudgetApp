import React, { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../ReduxStore/Reducers';
import { dashboardAxios } from '../../Util/Api';
import { currentYearValue, currentMonthName } from '../../Util/index';

const CategoryData = lazy(() => import('./CategoryData'));
const MonthCategories = lazy(() => import('../TansactionDashBoard/monthCategories'));

interface objectKeys {
    [key: string]: any
}

type CategoryDataWrapperProps = {
    history: objectKeys
}

const CategoryDataWrapper: FC<CategoryDataWrapperProps> = (props) => {

    // react-state
    const [apiErrorMessage, setApiErrorMessage] = useState<string>('');

    // props
    const { history } = props;

    // redux-state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);


    useEffect(() => {
        getTransactionDataByCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getTransactionDataByCategory = async () => {
        const userToken = sessionStorage.getItem('userToken');
        try {
            const response: any = await dashboardAxios.get(`/getTransactioDataByCategory?userId=${userInfo.id}&year=${currentYearValue}&month=${currentMonthName}&category=Income`, {
                headers: {
                    'x-powered-token': userToken || ''
                }
            });
            if (response && response.data && response.data.status === 'Success') {
                console.log(response.data);
            }
        }
        catch (err: any) {
            if (err && err.response && err.response.data) {
                const { message } = err.response.data;
                if (message === 'InvalidToken') {
                    setApiErrorMessage('Invalid Token, User not Authenticated');
                    sessionStorage.removeItem('userToken');
                    setTimeout(() => {
                        history.push('/');
                    }, 3000)
                }
                else setApiErrorMessage('Error while getting transaction detail');
            }
            else setApiErrorMessage('Error while getting transaction detail');
        }
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-7">
                    <Suspense fallback={<div>Loading...</div>}>
                        <MonthCategories />
                    </Suspense>
                </div>
                <div className="col-md-5">
                    <Suspense fallback={<div>Loading...</div>}>
                        <CategoryData />
                    </Suspense>
                </div>
            </div>
        </Fragment>
    )

}

export default CategoryDataWrapper;
