import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3000/api',
    Headers: { 'Content-Type': 'x-www-form-urlencoded' },
    responseType: 'json',
})
