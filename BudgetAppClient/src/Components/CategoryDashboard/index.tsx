import React, { FC, Fragment, lazy, Suspense } from 'react';


const CategoryHeader = lazy(() => import('./CategoryHeader'));
const CategoryFilter = lazy(() => import('./CategoryFilter'));
const CategoryData = lazy(() => import('./CategoryData'));
const MonthCategories = lazy(() => import('../TansactionDashBoard/monthCategories'));
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
                <div className="row">
                    <div className="col-md-7">
                        <MonthCategories />
                    </div>
                    <div className="col-md-5">
                        <CategoryData />
                    </div>
                </div>
            </Suspense>
        </Fragment>
    )

}


export default CategoryDashboard;
