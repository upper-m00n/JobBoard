import axios from 'axios'

const API = axios.create({
    // baseURL:'https://jobboard-ztsu.onrender.com/api',
    baseURL:"http://localhost:5000/api"
})

API.interceptors.request.use((req) => {

  const token = localStorage.getItem('token'); 
  // console.log(token)
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API