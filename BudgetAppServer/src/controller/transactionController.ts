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
    transactionOverview?: objectKeys,
    monthTransactionOverview?: objectKeys
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
    let { monthIncome = 0, monthExpenses = 0, monthInvestment = 0, monthBalance = 0 } = (transactionData.transactionHistory && transactionData.transactionHistory.monthHistory) ? transactionData.transactionHistory.monthHistory[0] : transactionData;
    switch (true) {
        case transactionType === 'Income':
            income = +income + +amount;
            balance = +income - (+expenses + +investment);
            monthIncome = +monthIncome + +amount;
            monthBalance = +monthIncome - (+monthExpenses + +monthInvestment);
            break;
        case transactionType === 'Expenses':
            expenses = +expenses + +amount;
            balance = +income - (+expenses + +investment);
            monthExpenses = +monthExpenses + +amount;
            monthBalance = +monthIncome - (+monthExpenses + +monthInvestment);
            break;
        case transactionType === 'Investment':
            investment = +investment + +amount;
            balance = +income - (+expenses + +investment);
            monthInvestment = +monthInvestment + +amount;
            monthBalance = +monthIncome - (+monthExpenses + +monthInvestment);
            break;
        default: null;
    }
    const result = {
        income,
        expenses,
        investment,
        balance,
        monthIncome,
        monthExpenses,
        monthInvestment,
        monthBalance
    };
    return result;
}


const createNewEnrtyInTransaction = (inputData: { [key: string]: any }, userId: any) => {
    const { year, month, date, transactiontype, transactionCategory, amount, description } = inputData;
    const { income, expenses, investment, balance, monthIncome, monthExpenses, monthInvestment, monthBalance } = calculateTransaction(transactiontype, amount, {});
    const newTransactionData = {
        userId,
        year,
        income, expenses, investment, balance,
        transactionHistory: {
            monthHistory: [
                {
                    month,
                    monthIncome,
                    monthExpenses,
                    monthInvestment,
                    monthBalance,
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
    const { income, expenses, investment, balance, monthIncome, monthExpenses, monthInvestment, monthBalance } = calculateTransaction(transactiontype, amount, previousData);
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
            $set: {
                'transactionHistory.monthHistory.$[monthIndex].monthIncome': monthIncome,
                'transactionHistory.monthHistory.$[monthIndex].monthExpenses': monthExpenses,
                'transactionHistory.monthHistory.$[monthIndex].monthInvestment': monthInvestment,
                'transactionHistory.monthHistory.$[monthIndex].monthBalance': monthBalance
            },
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
        monthTransactionOverview: {
            monthIncome,
            monthExpenses,
            monthInvestment,
            monthBalance
        },
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
    const { income, expenses, investment, balance, monthIncome, monthExpenses, monthInvestment, monthBalance } = calculateTransaction(transactiontype, amount, previousData);
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
            $set: {
                'transactionHistory.monthHistory.$[monthIndex].monthIncome': monthIncome,
                'transactionHistory.monthHistory.$[monthIndex].monthExpenses': monthExpenses,
                'transactionHistory.monthHistory.$[monthIndex].monthInvestment': monthInvestment,
                'transactionHistory.monthHistory.$[monthIndex].monthBalance': monthBalance
            },
            $push: {
                'transactionHistory.monthHistory.$[monthIndex].dateHistory': {
                    date,
                    transactionList: [
                        {
                            transactiontype,
                            transactionCategory,
                            description,
                            amount
                        }
                    ]
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
        monthTransactionOverview: {
            monthIncome,
            monthExpenses,
            monthInvestment,
            monthBalance
        },
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
    const { income, expenses, investment, balance, monthIncome, monthExpenses, monthInvestment, monthBalance } = calculateTransaction(transactiontype, amount, previousData);
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
                    monthIncome,
                    monthInvestment,
                    monthExpenses,
                    monthBalance,
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
        monthTransactionOverview: {
            monthIncome,
            monthExpenses,
            monthInvestment,
            monthBalance
        },
        transactionOverview: {
            income: savedTransactionData.income,
            expenses: savedTransactionData.expenses,
            investment: savedTransactionData.investment,
            balance: savedTransactionData.balance
        }
    }
    return result;
}


const getTransactionDataByMonth = async (objectTypeUserId: any, month: string, year: string) => {
    const transactionData = await TransactionModel.findOne(
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
    return transactionData;
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
            const transactionData = await getTransactionDataByMonth(objectTypeUserId, month, year);
            if (!savedData || !transactionData) throw new Error('Error while adding data');
            const { monthIncome, monthBalance, monthExpenses, monthInvestment } = savedData.transactionHistory.monthHistory[0];
            res.status(200).json({
                status: 'Success',
                message: 'Transaction added Successfully',
                transactionDetail: transactionData.transactionHistory,
                monthTransactionOverview: {
                    monthIncome,
                    monthExpenses,
                    monthInvestment,
                    monthBalance,
                },
                transactionOverview: {
                    income: savedData.income,
                    expenses: savedData.expenses,
                    investment: savedData.investment,
                    balance: savedData.balance
                }
            });
            return;
        }
        const monthData = await TransactionModel.findOne(
            {
                userId: objectTypeUserId, year,
                'transactionHistory.monthHistory': {
                    $elemMatch: { month }
                }
            },
            {
                'income': 1,
                'expenses': 1,
                'investment': 1,
                'balance': 1,
                'transactionHistory.monthHistory.$': 1
            }
        );
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
                },
                {
                    'income': 1,
                    'expenses': 1,
                    'investment': 1,
                    'balance': 1,
                    'transactionHistory.monthHistory.$': 1
                }
            );
            if (dateData) {
                const transactionResult: ValidAndInvalidResult = await addTransactionInfoToDate(req.body, userId, dateData);
                const transactionData = await getTransactionDataByMonth(objectTypeUserId, month, year);
                const { isTransactionAdded, transactionOverview = {}, monthTransactionOverview = {} } = transactionResult;
                if (!isTransactionAdded || !transactionData) throw new Error('Error while adding Transaction');
                res.status(200).json({
                    status: 'Success',
                    message: 'Transaction added Successfully',
                    transactionDetail: transactionData.transactionHistory,
                    monthTransactionOverview,
                    transactionOverview
                });
                return;
            }
            else {
                const transactionResult: ValidAndInvalidResult = await createNewDateInMonth(req.body, userId, monthData);
                const { isTransactionAdded, transactionOverview = {}, monthTransactionOverview = {} } = transactionResult;
                const transactionData = await getTransactionDataByMonth(objectTypeUserId, month, year);
                if (!isTransactionAdded || !transactionData) throw new Error('Error while adding Transaction');
                res.status(200).json({
                    status: 'Success',
                    message: 'Transaction added Successfully',
                    transactionDetail: transactionData.transactionHistory,
                    monthTransactionOverview,
                    transactionOverview
                });
                return;
            }
        }
        else {
            const userTransaction = {
                income: userTransactionHistory.income,
                expenses: userTransactionHistory.expenses,
                investment: userTransactionHistory.investment,
                balance: userTransactionHistory.balance
            }
            const transactionResult: ValidAndInvalidResult = await createNewMonthInYear(req.body, userId, userTransaction);
            const { isTransactionAdded, transactionOverview = {}, monthTransactionOverview = {} } = transactionResult;
            const transactionData = await getTransactionDataByMonth(objectTypeUserId, month, year);
            if (!isTransactionAdded || !transactionData) throw new Error('Error while adding Transaction');
            res.status(200).json({
                status: 'Success',
                message: 'Transaction added Successfully',
                transactionDetail: transactionData.transactionHistory,
                monthTransactionOverview,
                transactionOverview
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


export const getTransactionDetail = async (req: Request, res: Response) => {
    try {
        const { year, groupBy, userId, month } = req.query;
        const userInfoId: any = userId;
        const objectTypeUserId = new mongoose.Types.ObjectId(userInfoId);
        let transactionData;
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
                    transactionDetail: {
                        monthHistory: []
                    }
                });
                return;
            }
            transactionData = transactionData[0];
        }
        const { monthHistory } = transactionData.transactionHistory;
        const { monthIncome = 0, monthExpenses = 0, monthInvestment = 0, monthBalance = 0 } = monthHistory.length > 0 ? monthHistory[0] : [{}];
        const monthTransactionOverview = {
            monthIncome,
            monthExpenses,
            monthInvestment,
            monthBalance
        }
        res.status(200).json({
            status: 'Success',
            monthTransactionOverview,
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
