import React, { FC, Fragment } from 'react';


const CategoryData: FC = () => {

    return (
        <Fragment>
            <div className="category_data_container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="category_card_container">
                            <div className="category_card_header">
                                <div className="info">
                                    <div className="category_card_header_name">Share Market</div>
                                    <div className="category_card_header_info_value">₹ 1,000</div>
                                </div>
                                <div className="category_card_header_value_bg">
                                    <div className="category_card_header_value">15%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="category_card_container">
                            <div className="category_card_header">
                                <div className="info">
                                    <div className="category_card_header_name">Other</div>
                                    <div className="category_card_header_info_value">₹ 3,000</div>
                                </div>
                                <div className="category_card_header_value_bg">
                                    <div className="category_card_header_value">45%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

}


export default CategoryData;
