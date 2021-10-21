import mongoose, { Schema, model } from 'mongoose';


const userModelSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = model('BudgetUserInfo', userModelSchema);

export default userModel;
