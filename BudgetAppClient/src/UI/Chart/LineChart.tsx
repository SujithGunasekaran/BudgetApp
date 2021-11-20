import React, { FC, Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface objectKeys {
    [key: string]: any
}

type TransactionDashBoardProps = {
    history?: objectKeys
}

const data = [
    {
        name: 'Page A',
        Income: 4000,
        Expenses: 2400,
        Investment: 2400,
    },
    {
        name: 'Page B',
        Income: 3000,
        Expenses: 1398,
        Investment: 2210,
    },
    {
        name: 'Page C',
        Income: 2000,
        Expenses: 9800,
        Investment: 2290,
    },
    {
        name: 'Page D',
        Income: 2780,
        Expenses: 3908,
        Investment: 2000,
    },
    {
        name: 'Page E',
        Income: 1890,
        Expenses: 4800,
        Investment: 2181,
    },
    {
        name: 'Page F',
        Income: 2390,
        Expenses: 3800,
        Investment: 2500,
    },
    {
        name: 'Page G',
        Income: 3490,
        Expenses: 4300,
        Investment: 2100,
    },
];




const MonthDashboard: FC<TransactionDashBoardProps> = (props) => {

    return (
        <Fragment>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="name" />
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
