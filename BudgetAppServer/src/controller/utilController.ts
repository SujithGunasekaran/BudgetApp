import { Request, Response, NextFunction } from 'express';
import userModel from '../mongodb/model/useModel';
import { config } from '../config';
import jwt from 'jsonwebtoken';


export const checkIsUserTokenValid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers['x-powered-token'] && config.JWTSECRET) {
            const userToken: any = req.headers['x-powered-token'];
            const decodedToken: any = jwt.verify(userToken, config.JWTSECRET);
            if (!decodedToken) throw new Error('Invalid Token');
            const { id } = decodedToken;
            const registeredUser = await userModel.findOne({ _id: id });
            if (!registeredUser) throw new Error('Invalid Token');
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
