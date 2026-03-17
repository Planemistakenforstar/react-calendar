
import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables();
console.log('API URL being used:', VITE_API_URL); // Add this line to check
 const calendarApi = axios.create({
    baseURL: VITE_API_URL,
 });


 //  configurar interceptores
calendarApi.interceptors.request.use( config => {
   console.log('Making request to:', config.baseURL + config.url); // Add this
   config.headers = {
      ...config.headers,
      'x-token': localStorage.getItem('token')
   }
   return config;
})



export default calendarApi;

 