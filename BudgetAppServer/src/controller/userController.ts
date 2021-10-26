import { Request, Response, NextFunction } from 'express';
import userModel from "../mongodb/model/useModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';


export const checkIsUserTokenValid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers['x-powered-token'] && config.JWTSECRET) {
            const token: any = req.headers['x-powered-token'];
            const decode: any = jwt.verify(token, config.JWTSECRET);
            if (!decode) throw new Error('Invalid Token');
            const { id } = decode;
            const userInfo = await userModel.findById(id);
            if (!userInfo) throw new Error('Something Went wrong');
            res.status(200).json({
                status: 'Success',
                token,
                userInfo: {
                    id: userInfo._id,
                    email: userInfo.email,
                    userName: userInfo.username
                }
            });
        }
        else throw new Error('Invalid Token');
    }
    catch (err) {
        res.status(404).json({
            status: "Error",
            message: 'Invalid Token'
        });
    }
}


export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const userInfo = await userModel.findOne({ username });
        if (userInfo) throw new Error('Username already exists');
        const hasedValue = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, hasedValue);
        const savedUser = await userModel.create({ username, email, password: encryptedPassword });
        if (!savedUser) throw new Error('Error while saving the user');
        res.status(200).json({
            status: 'Success',
            message: 'User Registered Successfully'
        })
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}


export const loginUser = async (req: Request, res: Response) => {
    const queryData: any = req.query;
    const { username, password } = queryData;
    try {
        const userInfo = await userModel.findOne({ username });
        if (!userInfo) throw new Error('Invalid Username');
        const isPasswordMatched = await bcrypt.compare(password, userInfo.password);
        if (!isPasswordMatched) throw new Error('Invalid Password');
        const token = jwt.sign({ id: userInfo._id }, `${config.JWTSECRET}`, { expiresIn: '7d' });
        if (!token) throw new Error('Error while getting token');
        res.status(200).json({
            status: 'Success',
            token,
            userInfo: {
                id: userInfo._id,
                email: userInfo.email,
                userName: userInfo.username
            }
        })
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}
