import React, { FC, Fragment } from 'react';


type ScrollabelItemProps = {
    itemCssClass: string,
    itemList: string[],
    activeItem: string,
    handleItemClick: (value: string) => void
}


const ScrollableItem: FC<ScrollabelItemProps> = (props) => {

    // props
    const { itemCssClass, itemList, activeItem, handleItemClick } = props;

    return (
        <Fragment>
            {
                itemList && itemList.length > 0 &&
                itemList.map((element: string, index: number) => (
                    <div onClick={() => handleItemClick(element)} key={index} className={`${itemCssClass} ${(activeItem === element) ? 'active' : ''}`}>
                        {element}
                    </div>
                ))
            }
        </Fragment>
    )

}

export default ScrollableItem;
