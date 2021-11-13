import { NextFunction, Request, Response } from 'express';
import TransactionModel from '../mongodb/model/transactionModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from '../config';

interface objectKeys {
    [key: string]: any
}

type ValidAndInvalidResult = {
    isTransactionAdded: boolean,
    transactionHistory?: objectKeys[],
    transactionOverview?: objectKeys
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
            message: 'InvalidToken'
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
    if (!savedTransactionData) return { isTransactionAdded: false };
    const result = {
        isTransactionAdded: true,
        transactionHistory: savedTransactionData.transactionHistory,
        transactionOverview: {
            income: savedTransactionData.income,
            expenses: savedTransactionData.expenses,
            investment: savedTransactionData.investment,
            balance: savedTransactionData.balance
        }
    }
    return result;
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
    if (!savedTransactionData) return { isTransactionAdded: false };
    const result = {
        isTransactionAdded: true,
        transactionHistory: savedTransactionData.transactionHistory,
        transactionOverview: {
            income: savedTransactionData.income,
            expenses: savedTransactionData.expenses,
            investment: savedTransactionData.investment,
            balance: savedTransactionData.balance
        }
    }
    return result;
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
    if (!savedTransactionData) return { isTransactionAdded: false };
    const result = {
        isTransactionAdded: true,
        transactionHistory: savedTransactionData.transactionHistory,
        transactionOverview: {
            income: savedTransactionData.income,
            expenses: savedTransactionData.expenses,
            investment: savedTransactionData.investment,
            balance: savedTransactionData.balance
        }
    }
    return result;
}

export const addTransaction = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const { year, month, date } = req.body;
        const userInfoId: any = userId;
        const objectTypeUserId = new mongoose.Types.ObjectId(userInfoId);
        const userTransactionHistory = await TransactionModel.findOne({ userId: objectTypeUserId, year });
        if (!userTransactionHistory) {
            let savedData = createNewEnrtyInTransaction(req.body, userId);
            savedData = await TransactionModel.create(savedData);
            res.status(200).json({
                status: 'Success',
                message: 'Transaction added Successfully',
                transactionHistory: savedData.transactionHistory,
                transactionOverview: {
                    income: savedData.income,
                    expenses: savedData.expenses,
                    investment: savedData.investment,
                    balance: savedData.balance
                }
            });
            return;
        }
        const monthData = await TransactionModel.findOne({ userId: objectTypeUserId, year, 'transactionHistory.monthHistory': { $elemMatch: { month } } });
        if (monthData) {
            const dateData = await TransactionModel.findOne(
                {
                    userId: objectTypeUserId,
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
                const transactionResult: ValidAndInvalidResult = await addTransactionInfoToDate(req.body, userId, dateData);
                const { isTransactionAdded, transactionOverview = {}, transactionHistory } = transactionResult;
                if (!isTransactionAdded) throw new Error('Error while adding Transaction');
                res.status(200).json({
                    status: 'Success',
                    message: 'Transaction added Successfully',
                    transactionHistory,
                    transactionOverview: {
                        income: transactionOverview.income,
                        expenses: transactionOverview.expenses,
                        investment: transactionOverview.investment,
                        balance: transactionOverview.balance
                    }
                });
                return;
            }
            else {
                const transactionResult: ValidAndInvalidResult = await createNewDateInMonth(req.body, userId, monthData);
                const { isTransactionAdded, transactionOverview = {}, transactionHistory } = transactionResult;
                if (!isTransactionAdded) throw new Error('Error while adding Transaction');
                res.status(200).json({
                    status: 'Success',
                    message: 'Transaction added Successfully',
                    transactionHistory,
                    transactionOverview: {
                        income: transactionOverview.income,
                        expenses: transactionOverview.expenses,
                        investment: transactionOverview.investment,
                        balance: transactionOverview.balance
                    }
                });
                return;
            }
        }
        else {
            const transactionResult: ValidAndInvalidResult = await createNewMonthInYear(req.body, userId, userTransactionHistory);
            const { isTransactionAdded, transactionOverview = {}, transactionHistory } = transactionResult;
            if (!isTransactionAdded) throw new Error('Error while adding Transaction');
            res.status(200).json({
                status: 'Success',
                message: 'Transaction added Successfully',
                transactionHistory,
                transactionOverview: {
                    income: transactionOverview.income,
                    expenses: transactionOverview.expenses,
                    investment: transactionOverview.investment,
                    balance: transactionOverview.balance
                }
            });
            return;
        }
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: 'Error While adding traction, Please try again later..'
        })
    }
}


export const getTransactionOverview = async (req: Request, res: Response) => {
    try {
        const { userId, year } = req.query;
        const userInfoId: any = userId;
        const objectTypeUserId = new mongoose.Types.ObjectId(userInfoId);
        const userTransactionData = await TransactionModel.findOne({ userId: objectTypeUserId, year });
        if (!userTransactionData) throw new Error('Error while getting transaction');
        const result = {
            income: userTransactionData.income,
            expenses: userTransactionData.expenses,
            investment: userTransactionData.investment,
            balance: userTransactionData.balance
        };
        res.status(200).json({
            status: 'Success',
            transactionOverview: result
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: 'Something went wrong while getting transaction data.'
        })
    }
}


const getMonthCount = async (userId: any, year: any) => {
    const monthCount = await TransactionModel.aggregate([
        {
            $match: {
                userId,
                year
            }
        },
        {
            $project: {
                count: {
                    $size: '$transactionHistory.monthHistory'
                }
            }
        }
    ]);
    return monthCount.length > 0 ? monthCount[0].count : 0;
}

export const getTransactionDetail = async (req: Request, res: Response) => {
    try {
        const { year, groupBy, userId, month, visitedMonth } = req.query;
        const userInfoId: any = userId;
        let visitedMonthLength: any = visitedMonth;
        const objectTypeUserId = new mongoose.Types.ObjectId(userInfoId);
        let transactionData;
        let monthCount = await getMonthCount(objectTypeUserId, year);
        let hasMoreData = (Number(visitedMonthLength) < monthCount - 2) ? true : false;
        let nextMonthIndex = (Number(visitedMonthLength) < monthCount - 2) ? Number(visitedMonthLength) + 2 : Number(visitedMonthLength);
        if (!month && !groupBy) {
            transactionData = await TransactionModel.findOne({ userId: objectTypeUserId, year }, { 'transactionHistory.monthHistory': { $slice: [Number(visitedMonth), 2] } });
            if (!transactionData) throw new Error('Error while getting transaction data');
        }
        if (month && !groupBy) {
            transactionData = await TransactionModel.findOne(
                {
                    userId: objectTypeUserId,
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
            if (!transactionData) {
                res.status(200).json({
                    status: 'Success',
                    transactionDetail: {
                        monthHistory: []
                    }
                });
                return;
            }
        }
        if (!month && groupBy) {
            transactionData = await TransactionModel.aggregate([
                {
                    $match: {
                        userId: objectTypeUserId,
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
                                        cond: {}
                                    }
                                },
                                as: "monthHistory",
                                in: {
                                    month: "$$monthHistory.month",
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
                                                                groupBy
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
            if (!transactionData || transactionData.length === 0) {
                res.status(200).json({
                    status: 'Success',
                    message: 'You have not done any transaction for the selected categories.'
                });
                return;
            }
            transactionData = transactionData[0];
        }
        if (month && groupBy) {
            transactionData = await TransactionModel.aggregate([
                {
                    $match: {
                        userId: objectTypeUserId,
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
                                                                groupBy
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
            if (!transactionData || transactionData.length === 0) {
                res.status(200).json({
                    status: 'Success',
                    message: 'You have not done any transaction for the selected month and groupBy'
                });
                return;
            }
            transactionData = transactionData[0];
        }
        res.status(200).json({
            status: 'Success',
            hasMoreData,
            nextMonthIndex,
            transactionDetail: transactionData.transactionHistory
        });
        return;
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: 'Error while getting the transaction data'
        })
    }
}
