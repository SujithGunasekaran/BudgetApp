import dotEnv from 'dotenv';

dotEnv.config();

export const config = {
    PORT: process.env.PORT,
    MONGODBURI: process.env.MONGODBURI,
    JWTSECRET: process.env.JWTSECRET,
    LOCAL_URL: process.env.LOCAL_URL
}
