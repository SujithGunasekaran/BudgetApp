import React, { FC, Fragment, lazy, Suspense } from 'react';


const CategoryHeader = lazy(() => import('./CategoryHeader'));
const CategoryFilter = lazy(() => import('./CategoryFilter'));
const CategoryData = lazy(() => import('./CategoryData'));

interface objectKeys {
    [key: string]: any
}

type CategoryDashboardProps = {
    history: objectKeys
}

const CategoryDashboard: FC<CategoryDashboardProps> = (props) => {

    // props
    const { history } = props;

    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <CategoryHeader />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <CategoryFilter />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <CategoryData />
            </Suspense>
        </Fragment>
    )

}


export default CategoryDashboard;
