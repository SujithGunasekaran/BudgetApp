import { Request, Response } from 'express';
import userModel from "../mongodb/model/useModel";
import bcrypt from 'bcrypt';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const userInfo = await userModel.findOne({ username });
        if (userInfo) throw new Error('User already exists');
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
        const isUserNameRegistered = await userModel.findOne({ username });
        if (!isUserNameRegistered) throw new Error('Invalid Username');
        const isPasswordMatched = await bcrypt.compare(password, isUserNameRegistered.password);
        if (!isPasswordMatched) throw new Error('Invalid Password');
        res.status(200).json({
            status: 200,
            message: 'Success'
        })
    }
    catch (err: any) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}
