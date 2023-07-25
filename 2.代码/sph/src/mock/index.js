import Mock from 'mockjs';

import floor from './datas/floor.json';
import slide from './datas/slide.json';

// http协议的默认端口号是80
// https协议的默认端口号是443
// 使用mock不存在跨域问题,因为地址是假的,请求也是假的
// 在请求发出去之前就已经被mock拦截了
Mock.mock('http://www.baidu.com','get',"恭喜你获取到了假数据");

Mock.mock('http://www.baidu.com/slide','get',{
    code:200,
    message:'成功',
    ok:true,
    data:slide
});

Mock.mock('http://www.baidu.com/floor','get',{
    code:200,
    message:'成功',
    ok:true,
    data:floor
});