import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在请求发送前做一些处理，例如添加token等
    return config;
  },
  error => {
    // 处理请求错误
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 对响应数据做一些处理
    return response.data;
  },
  error => {
    // 处理响应错误
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default api;
