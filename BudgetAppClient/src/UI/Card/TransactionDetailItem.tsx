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
                <div className="finance_transaction_detail_month_header">{`${dateInfo.date} ${monthInfo.month} ${new Date().getFullYear()}`}</div>
                {
                    dateInfo.transactionList.length > 0 &&
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
                                        <div className="category">{transactionInfo.transactionCategory}</div>
                                    </div>
                                    <div className="finance_transaction_detail_item_amount_container">
                                        <div className={`amount ${(transactionType === 'Expenses' || transactionType === 'Investment') ? 'expenses' : ''} ${transactionType === 'Income' ? 'income' : ''}`}>{(transactionType === 'Expenses' || transactionType === 'Investment') ? '- ' : '+ '} ₹ {Number(transactionInfo.amount).toLocaleString('en-IN') || ''}</div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
        </Fragment>
    )

}


export default TransactionDetailItem;
