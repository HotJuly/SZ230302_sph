// 该文件专门收集测试的接口
import request from '@/utils/request';

const reqList = (searchParams)=>
    request.post('/api/list',searchParams);


export default {
    reqList
}



