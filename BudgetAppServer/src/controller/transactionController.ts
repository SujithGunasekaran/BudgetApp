import { NextFunction, Request, Response } from 'express';
import TransactionModel from '../mongodb/model/transactionModel';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface objectKeys {
    [key: string]: any
}


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


const calculateTransaction = (transactionType: String, amount: String, transactionData: objectKeys) => {
    let { income = 0, expenses = 0, investment = 0, balance = 0 } = transactionData;
    switch (true) {
        case transactionType === 'Income':
            income = +income + +amount;
            balance = +income - (+expenses + +investment);
            break;
        case transactionType === 'Expenses':
            expenses = +expenses + +amount;
            balance = +income - (+expenses + +investment);
            break;
        case transactionType === 'Investment':
            investment = +investment + +amount;
            balance = +income - (+expenses + +investment);
            break;
        default: null;
    }
    const result = {
        income,
        expenses,
        investment,
        balance
    };
    return result;
}

const createNewEnrtyInTransaction = (inputData: { [key: string]: any }, userId: any) => {
    const { year, month, date, transactiontype, transactionCategory, amount, description } = inputData;
    const { income, expenses, investment, balance } = calculateTransaction(transactiontype, amount, {});
    const newTransactionData = {
        userId,
        year,
        income, expenses, investment, balance,
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

const addTransactionInfoToDate = async (inputData: objectKeys, userId: any, previousData: objectKeys) => {
    const { year, month, date, transactiontype, transactionCategory, amount, description } = inputData;
    const { income, expenses, investment, balance } = calculateTransaction(transactiontype, amount, previousData);
    const savedTransactionData = await TransactionModel.findOneAndUpdate(
        {
            userId,
            year
        },
        {
            income,
            expenses,
            investment,
            balance,
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
    if (!savedTransactionData) return false;
    return true;
}


const createNewDateInMonth = async (inputData: objectKeys, userId: any, previousData: objectKeys) => {
    const { year, month, date, transactiontype, transactionCategory, amount, description } = inputData;
    const { income, expenses, investment, balance } = calculateTransaction(transactiontype, amount, previousData);
    const savedTransactionData = await TransactionModel.findOneAndUpdate(
        {
            userId,
            year
        },
        {
            income,
            expenses,
            investment,
            balance,
            $push: {
                'transactionHistory.monthHistory.$[monthIndex].dateHistory': {
                    date,
                    transactionList: {
                        transactionCategory,
                        transactiontype,
                        amount,
                        description
                    }
                }
            }
        },
        {
            arrayFilters: [{ 'monthIndex.month': month }],
            new: true,
            runValidators: true
        }
    );
    if (!savedTransactionData) return false;
    return true;
}

const createNewMonthInYear = async (inputData: objectKeys, userId: any, previousData: objectKeys) => {
    const { year, month, date, transactiontype, transactionCategory, amount, description } = inputData;
    const { income, expenses, investment, balance } = calculateTransaction(transactiontype, amount, previousData);
    const savedTransactionData = await TransactionModel.findOneAndUpdate(
        {
            userId,
            year
        },
        {
            income,
            expenses,
            investment,
            balance,
            $push: {
                'transactionHistory.monthHistory': {
                    month,
                    dateHistory: {
                        date,
                        transactionList: {
                            transactionCategory,
                            transactiontype,
                            amount,
                            description
                        }
                    }
                }
            }
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (!savedTransactionData) return false;
    return true;
}

export const addTransaction = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const { year, month, date } = req.body;
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
        const monthData = await TransactionModel.findOne({ userId, year, 'transactionHistory.monthHistory': { $elemMatch: { month } } });
        if (monthData) {
            const dateData = await TransactionModel.findOne(
                {
                    userId,
                    year,
                    'transactionHistory.monthHistory': {
                        $elemMatch: {
                            month,
                            dateHistory: {
                                $elemMatch: {
                                    date
                                }
                            }
                        }
                    }
                }
            );
            if (dateData) {
                const isTransactionAdded = await addTransactionInfoToDate(req.body, userId, dateData);
                if (!isTransactionAdded) throw new Error('Error while adding Transaction');
                res.status(200).json({
                    status: 'Success',
                    message: 'transaction added Successfully'
                });
                return;
            }
            else {
                const isDateAdded = await createNewDateInMonth(req.body, userId, monthData);
                if (!isDateAdded) throw new Error('Errow while adding Transaction');
                res.status(200).json({
                    status: 'Success',
                    message: 'date added Successfully'
                });
                return;
            }
        }
        else {
            const isMonthAdded = await createNewMonthInYear(req.body, userId, userTransactionHistory);
            if (!isMonthAdded) throw new Error('Error while adding Transaction');
            res.status(200).json({
                status: 'Success',
                message: 'month added Successfully'
            })
        }
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: 'Error While adding traction, Please try again later..'
        })
    }
}
