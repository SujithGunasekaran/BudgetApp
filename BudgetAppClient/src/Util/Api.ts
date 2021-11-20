import axios from 'axios';
import { useApiUrl, transactionUrl, dashboardUrl } from './ApiUrl';

const token = sessionStorage.getItem('userToken');

export const userAxios = axios.create({
    baseURL: `${useApiUrl}`,
    headers: {
        'Content-Type': 'application/json',
        'x-powered-token': `${token}`
    }
});

export const transactionAxios = axios.create({
    baseURL: `${transactionUrl}`,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const dashboardAxios = axios.create({
    baseURL: `${dashboardUrl}`,
    headers: {
        'Content-Type': 'application/json',
    }
})


