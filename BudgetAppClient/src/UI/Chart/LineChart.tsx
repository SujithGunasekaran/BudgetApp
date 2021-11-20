import React, { FC, Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface objectKeys {
    [key: string]: any
}

type TransactionDashBoardProps = {
    history?: objectKeys,
    dashboardData: objectKeys[]
}


const MonthDashboard: FC<TransactionDashBoardProps> = (props) => {

    // props
    const { dashboardData } = props;

    return (
        <Fragment>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={dashboardData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="displayName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Income" stroke="#4cbb59" />
                    <Line type="monotone" dataKey="Expenses" stroke="#ff5a4e" />
                    <Line type="monotone" dataKey="Investment" stroke="#0068FF" />
                </LineChart>
            </ResponsiveContainer>
        </Fragment>
    )

}

export default MonthDashboard;
