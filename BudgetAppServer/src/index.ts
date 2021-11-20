import express from 'express';
import cors from 'cors';
import { connectMongodb } from './mongodb';
import userRouter from './routes/userRoute';
import transactionRouter from './routes/transactionRoute';
import dashboardRoute from './routes/dashboardRoute';


// Initializing server
const server = express();

const PORT = process.env.PORT || 5000;

// parse request
server.use(express.json());

// restrict response header
server.use(cors({
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-powered-token']
}));

// mongodb connection
connectMongodb();

server.use('/api/v1/user', userRouter);
server.use('/api/v1/transaction', transactionRouter);
server.use('/api/v1/dashboard', dashboardRoute);

server.listen(PORT, () => {
    console.log(`Server Running on PORT : ${PORT}`);
})
