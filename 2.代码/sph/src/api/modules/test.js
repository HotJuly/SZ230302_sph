// 该文件专门收集测试的接口
import request from '@/utils/request';

// const reqBaseCategoryList = ()=>{
//     return request.get('/api/product/getBaseCategoryList')
// }

const reqBaseCategoryList = ()=>
    request.get('/api/product/getBaseCategoryList');


export default {
    // reqBaseCategoryList:reqBaseCategoryList
    reqBaseCategoryList
}



