import express from 'express';
import cors from 'cors';
import { connectMongodb } from './mongodb';
import { config } from './config';
import userRouter from './routes/userRoute';

const { LOCAL_URL } = config;

// Initializing server
const server = express();

const PORT = process.env.PORT || 5000;

// parse request
server.use(express.json());

// restrict response header
server.use(cors({
    origin: `${LOCAL_URL}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// mongodb connection
connectMongodb();

server.use('/api/v1/user', userRouter);

server.listen(PORT, () => {
    console.log(`Server Running on PORT : ${PORT}`);
})
