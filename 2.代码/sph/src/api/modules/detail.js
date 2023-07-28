// 该文件专门收集测试的接口
import request from '@/utils/request';

const reqDetailInfo = (skuId)=>
    request.get(`/api/item/${skuId}`);


export default {
    reqDetailInfo
}



