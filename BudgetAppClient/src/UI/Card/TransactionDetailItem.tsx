import React, { Fragment, FC } from 'react';
import { transactionCategoryInput } from '../../Util/JsonInput';

interface objectKeys {
    [key: string]: any
}

type TransactionDetailItemProps = {
    dateInfo: objectKeys,
    monthInfo: objectKeys
}


const TransactionDetailItem: FC<TransactionDetailItemProps> = (props) => {

    // props
    const { dateInfo, monthInfo } = props;

    return (
        <Fragment>
            <div className="finance_transaction_detail_month_container">
                {
                    (dateInfo && dateInfo.transactionList.length > 0) &&
                    <div className="finance_transaction_detail_month_header">{`${dateInfo.date} ${monthInfo.month} ${new Date().getFullYear()}`}</div>
                }
                {
                    (dateInfo && dateInfo.transactionList.length > 0) &&
                    dateInfo.transactionList.map((transactionInfo: any, index: any) => {
                        const transactionType = transactionInfo.transactiontype;
                        const categoryIcon = transactionCategoryInput[transactionInfo.transactionCategory];
                        return (
                            <Fragment key={index}>
                                <div className={`finance_transaction_datail_item`}>
                                    <div className="finance_transaction_detail_item_info_container">
                                        <div className="icon" style={{ 'backgroundColor': categoryIcon ? categoryIcon.backgroundColor : '' }}>
                                            <i className={`${categoryIcon ? categoryIcon.icon : ''}`} style={{ padding: categoryIcon ? categoryIcon.padding : '', color: categoryIcon ? categoryIcon.color : '' }}></i>
                                        </div>
                                        <div className="category_container">
                                            <div className="category">{transactionInfo.transactionCategory}</div>
                                            <div className="type">{transactionInfo.transactiontype}</div>
                                        </div>
                                    </div>
                                    <div className="finance_transaction_detail_item_amount_container">
                                        <div className={`amount ${(transactionType === 'Expenses' || transactionType === 'Investment') ? 'expenses' : ''} ${transactionType === 'Income' ? 'income' : ''}`}>{(transactionType === 'Expenses' || transactionType === 'Investment') ? '- ' : '+ '} ₹ {Number(transactionInfo.amount).toLocaleString('en-IN') || ''}</div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                    // <div className="finance_transaction_detail_empty_message">{filterGroupBy !== 'Income' ? `You have not done any ${filterGroupBy} on this day.` : `There is no ${filterGroupBy} on this day.`} </div>
                }
            </div>
        </Fragment>
    )

}


export default TransactionDetailItem;
