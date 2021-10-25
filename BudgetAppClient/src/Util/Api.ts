import axios from 'axios';
import { useApiUrl } from './ApiUrl';

const token = sessionStorage.getItem('userToken');

export const userAxios = axios.create({
    baseURL: `${useApiUrl}`,
    headers: {
        'Content-Type': 'application/json',
        'x-powered-token': `${token}`
    }
});

