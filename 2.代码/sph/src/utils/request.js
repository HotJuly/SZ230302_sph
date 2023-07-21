import axios from "axios";
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

/* 
    此处会创建一个axios的实例对象,方便后续发送请求
    baseUrl的作用,如果开发者使用当前的request对象发送请求
        请求路径为/list
        那么真正的请求路径就是 baseUrl+/list = '/a/list'
*/
const request = axios.create({
  baseURL: "/dev-api",
  timeout: 20000,
});

// 这是axios的请求拦截器
// 该函数会在请求发送出去之前执行
// 所有的请求都会经过这里
// 这里面一般会做所有请求都需要做的事情
// 请求拦截器和响应拦截器是面试的一大重点
request.interceptors.request.use(
    (config) => {
        // 在每个请求发送出去之后,都会执行start方法,用于开启进度条
        nProgress.start();

        // 注意:一定要写return config;
        return config;
    }
);

// 这是响应拦截器
// 这里是响应返回到浏览器之后才会触发的
// 所有的响应都会经过这里
// 第一个回调函数是请求成功之后才会执行的
// 第二个回调函数是请求失败之后才会执行的
request.interceptors.response.use(
  (response) => {
    // response是一个响应报文对象
    // 内部具有响应头和响应体的数据
    // 响应头是给浏览器使用的,响应体是给开发人员使用的

    const res = response.data;

    nProgress.done();

    // 本次项目中,响应体内部会有code属性,用于告知本次请求的真实请求状态
    // 如果code为200,说明本次请求成功,如果code不为200,说明本次请求失败,有问题
    if(res.code===200){
        // 默认返回响应体中的数据
        return res.data;
    }else{
        alert(res.message);
        return Promise.reject(res.message);
    }


  },
  () => {
    nProgress.done();
  }
);

export default request;
