// 该文件专门收集测试的接口
import request from '@/utils/request';


const reqCreateNative = (orderId)=>
    request.get(`/api/payment/weixin/createNative/${orderId}`);


export default {
    reqCreateNative
}



