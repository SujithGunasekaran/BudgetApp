import React, { FC, Fragment, lazy, Suspense } from 'react';

const PieChat = lazy(() => import('../../UI/Chart/PieChart'));


interface objectKeys {
    [key: string]: any
}

type MonthCategoriesProps = {
    history?: objectKeys
}

const MonthCategories: FC<MonthCategoriesProps> = (props) => {

    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <div className="dashboard_month_sub_transaction_container">
                    <PieChat />
                </div>
            </Suspense>
        </Fragment>
    )

}

export default MonthCategories;
