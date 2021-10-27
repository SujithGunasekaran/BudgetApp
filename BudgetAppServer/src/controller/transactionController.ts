import { NextFunction, Request, Response } from 'express';
import TransactionModel from '../mongodb/model/transactionModel';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const checkIsUserTokenValid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers['x-powered-token'] && config.JWTSECRET) {
            const userToken: any = req.headers['x-powered-token'];
            const decodedToken = jwt.verify(userToken, config.JWTSECRET);
            if (!decodedToken) throw new Error('Invalid Token');
            next();
        }
        else throw new Error('Invalid Token');
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: 'Invalid Token'
        })
    }
}

const createNewEnrtyInTransaction = (inputData: { [key: string]: any }, userId: any) => {
    const { year, month, date, transactiontype, transactionCategory, amount, description } = inputData;
    const newTransactionData = {
        userId,
        year,
        transactionHistory: {
            monthHistory: [
                {
                    month,
                    dateHistory: [
                        {
                            date,
                            transactionList: [
                                {
                                    transactiontype,
                                    transactionCategory,
                                    amount,
                                    description
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
    return newTransactionData;
}

export const addTransaction = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const { year, month, date, transactiontype, transactionCategory, amount, description } = req.body;
        const userTransactionHistory = await TransactionModel.findOne({ userId, year });
        if (!userTransactionHistory) {
            let savedData = createNewEnrtyInTransaction(req.body, userId);
            savedData = await TransactionModel.create(savedData);
            res.status(200).json({
                status: 'Success',
                data: savedData
            });
            return;
        }
        const monthData = await TransactionModel.findOne({ userId, 'transactionHistory.monthHistory': { $elemMatch: { month } } });
        if (monthData) {
            const dateData = await TransactionModel.findOne({ userId, 'transactionHistory.monthHistory.dateHistory': { $elemMatch: { date } } });
            if (dateData) {
                const savedTransactionData = await TransactionModel.findOneAndUpdate(
                    {
                        userId,
                        year
                    },
                    {
                        $push: {
                            'transactionHistory.monthHistory.$[monthIndex].dateHistory.$[dateIndex].transactionList': {
                                transactionCategory,
                                transactiontype,
                                amount,
                                description
                            }
                        }
                    },
                    {
                        arrayFilters: [{ 'monthIndex.month': month }, { 'dateIndex.date': date }],
                        new: true,
                        runValidators: true
                    }
                );
                if (savedTransactionData) {
                    res.status(200).json({
                        status: 'Success',
                        data: savedTransactionData
                    });
                    return;
                }
            }
        }
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: 'Error While adding traction, Please try again later..'
        })
    }
}
