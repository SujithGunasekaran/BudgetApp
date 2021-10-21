import dotEnv from 'dotenv';

dotEnv.config();

export const config = {
    PORT: process.env.PORT,
    MONGODBURI: process.env.MONGODBURI,
    LOCAL_URL: process.env.LOCAL_URL
}
