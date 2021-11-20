import React, { FC, Fragment, lazy, Suspense, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../ReduxStore/Reducers';
import { dashboardAxios } from '../../Util/Api';
import { unstable_batchedUpdates } from 'react-dom';
import { LeftArrowIcon, RightArrowIcon } from '../../UI/Icon';
import { currentMonthValue, currentYearValue, FullMonth, lastDateOfCurrentMonth } from '../../Util';

const MonthlyDashboard = lazy(() => import('../../UI/Chart/LineChart'));

interface objectKeys {
    [key: string]: any
};

type TransactionDashBoardProps = {
    history?: objectKeys
}


const TransactionDashBoard: FC<TransactionDashBoardProps> = () => {

    // react-state
    const [monthDashboard, setMonthDashboard] = useState<objectKeys[] | []>([]);
    const [startDate, setStartDate] = useState<number>(1);
    const [endDate, setEndDate] = useState<number>(7);
    const [previousStartDate, setPreviousStartDate] = useState<number>(0);
    const [previousEndDate, setPreviousEndDate] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // redux-state
    const { userInfo } = useSelector((state: RootState) => state.userInfoReducer);


    useEffect(() => {
        getMonthTransactionData(startDate, endDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const updateState = (monthDashboard: objectKeys) => {
        unstable_batchedUpdates(() => {
            const { dashBoardData, nextEndDate, nextStartDate, previousEndDate, previousStartDate } = monthDashboard;
            setStartDate(nextStartDate);
            setEndDate(nextEndDate);
            setPreviousStartDate(previousStartDate);
            setPreviousEndDate(previousEndDate);
            setMonthDashboard(dashBoardData);
        })
    }

    const getMonthTransactionData = async (startDateValue: number, endDateValue: number) => {
        try {
            setLoading(true);
            const userToken = sessionStorage.getItem('userToken');
            const response: any = await dashboardAxios.get(`/getMonthTransactionOverview?userId=${userInfo.id}&month=${FullMonth[Number(currentMonthValue)]}&year=${currentYearValue}&currentStartDate=${startDateValue}&currentEndDate=${endDateValue}`,
                {
                    headers: {
                        'x-powered-token': userToken || ''
                    }
                }
            );
            if (response && response.data && response.data.status === 'Success') {
                const { monthDashboard } = response.data;
                updateState(monthDashboard);
            }
        }
        catch (err: any) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (!loading) getMonthTransactionData(startDate, endDate);
    }

    const handlePrevious = () => {
        if (!loading) getMonthTransactionData(previousStartDate, previousEndDate);
    }

    return (
        <Fragment>
            <div className="dashboard_transaction_container">
                <div className="dashboard_transaction_header_container">
                    <div className="heading">
                        <div className="dashboard_transaction_heading">Dashboard</div>
                        <div className="dashboard_transaction_sub_heading">Transaction for Nov 2021</div>
                    </div>
                    <div className="select_option">
                        {
                            (+previousStartDate >= 1 && +previousEndDate >= 7) &&
                            <div className="dashboard_select_option_bg" onClick={() => handlePrevious()}>
                                <LeftArrowIcon
                                    cssClass="icon"
                                />
                            </div>
                        }
                        {
                            (+startDate !== +lastDateOfCurrentMonth || +endDate !== +lastDateOfCurrentMonth) &&
                            <div className="dashboard_select_option_bg" onClick={() => handleNext()}>
                                <RightArrowIcon
                                    cssClass="icon"
                                />
                            </div>
                        }
                    </div>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="dashboard_month_transaction_container">
                        <MonthlyDashboard
                            dashboardData={monthDashboard}
                        />
                    </div>
                </Suspense>
            </div>
        </Fragment>
    )

}

export default TransactionDashBoard;
