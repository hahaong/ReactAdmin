import axios from 'axios'
import {message} from 'antd'

const instance = axios.create({
    timeout: 1000,
});

instance.interceptors.request.use((config) => {
    // const {method} = config
    // if(method.toLowerCase() === 'post'){

    // }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    (response) => {
         return response.data;
}, 
    (error) => {
        message.error(error.message,1)
        return new Promise(()=>{})
});


export default instance