import mongoose from 'mongoose';
import { config } from '../config';

require('./model/useModel');
require('./model/transactionModel');

export const connectMongodb = () => {

    const { MONGODBURI } = config;

    mongoose.connect(`${MONGODBURI}`, () => {
        console.log("Mongodb Connected Successfully");
    })

}
