import React, { FC, Fragment, useState } from 'react';
import ScrollableItem from '../../UI/List/ScrollableItems';


const CategoryFilter: FC = () => {

    // react-state
    const [currentActiveItem, setCurrentActiveItem] = useState<string>('Income');


    const handleCategoryItem = (value: string) => {
        setCurrentActiveItem(value);
    }

    return (
        <Fragment>
            <div className="category_filter_container">
                <ScrollableItem
                    itemList={['Income', 'Expenses', 'Investment']}
                    itemCssClass="category_filter_item"
                    activeItem={currentActiveItem}
                    handleItemClick={handleCategoryItem}
                />
            </div>
        </Fragment>
    )

}

export default CategoryFilter;
