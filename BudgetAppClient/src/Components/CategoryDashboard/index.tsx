import React, { FC, Fragment, lazy, Suspense } from 'react';


const CategoryHeader = lazy(() => import('./CategoryHeader'));
const CategoryFilter = lazy(() => import('./CategoryFilter'));
const CategoryDataWrapper = lazy(() => import('./CategoryDataWrapper'));


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
                <CategoryDataWrapper
                    history={history}
                />
            </Suspense>
        </Fragment>
    )

}


export default CategoryDashboard;
