import mongoose from 'mongoose';
import { Response, Request, NextFunction } from 'express';
import TransactionModel from "../mongodb/model/transactionModel";
import MonthData from '../util/monthData';


const getMonthTransactionData = async (userId: any, year: any, month: any) => {
    const monthData = await TransactionModel.findOne(
        {
            userId,
            year,
            'transactionHistory.monthHistory': {
                $elemMatch: {
                    month
                }
            }
        },
        {
            'transactionHistory.monthHistory.$': 1
        }
    );
    return monthData;
}



export const getMonthTransactionOverview = async (req: Request, res: Response) => {
    try {
        const { currentStartDate, currentEndDate, userId, year, month } = req.query;
        const userInfoId: any = userId;
        const userObjectId = new mongoose.Types.ObjectId(userInfoId);
        const monthTransactionData = await getMonthTransactionData(userObjectId, year, month);
        if (!monthTransactionData) {
            res.status(200).json({
                status: 'Success',
                message: `There is no transaction data for ${month} month`
            });
            return;
        }
        const monthData = new MonthData(currentStartDate, currentEndDate, monthTransactionData);
        const monthDashboard = await monthData.getTransactionData();
        if (!monthDashboard) throw new Error('Error while calculating the transaction data');
        res.status(200).json({
            status: 'Success',
            monthDashboard
        });
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: 'Error while getting the month transaction overview'
        })
    }
}


export const getTransactioDataForCategory = async (req: Request, res: Response) => {
    try {
        const { userId, year, month, category } = req.query;
        const userInfoId: any = userId;
        const userObjectId = new mongoose.Types.ObjectId(userInfoId);
        const transactionData: any = await TransactionModel.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    year
                }
            },
            {
                $project: {
                    "transactionHistory.monthHistory": {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$transactionHistory.monthHistory",
                                    as: "monthHistory",
                                    cond: {
                                        $eq: [
                                            "$$monthHistory.month",
                                            month
                                        ]
                                    }
                                }
                            },
                            as: "monthHistory",
                            in: {
                                month: "$$monthHistory.month",
                                monthIncome: "$$monthHistory.monthIncome",
                                monthExpenses: "$$monthHistory.monthExpenses",
                                monthInvestment: "$$monthHistory.monthInvestment",
                                monthBalance: "$$monthHistory.monthBalance",
                                dateHistory: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$$monthHistory.dateHistory",
                                                as: "dateHistory",
                                                cond: {}
                                            }
                                        },
                                        as: "dateHistory",
                                        in: {
                                            date: "$$dateHistory.date",
                                            transactionList: {
                                                $filter: {
                                                    input: "$$dateHistory.transactionList",
                                                    as: "transactionList",
                                                    cond: {
                                                        $eq: [
                                                            "$$transactionList.transactiontype",
                                                            category
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);
        if (!transactionData || transactionData.length === 0) throw new Error('Error while getting transaction');
        res.status(200).json({
            status: 'Success',
            transactionData: transactionData[0]
        })
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: 'Error while getting transaction data'
        })
    }
}
