// 该文件专门收集首页的接口
import request from "@/utils/request";
import mockRequest from "@/utils/mockRequest";

// const reqBaseCategoryList = ()=>{
//     return request.get('/api/product/getBaseCategoryList')
// }

const reqBaseCategoryList = () =>
  request.get("/api/product/getBaseCategoryList");

// 用于请求mock数据中的轮播图数据
const reqSlide = () => mockRequest.get("/slide");

// 用于请求mock数据中的楼层数据
const reqFloor = () => mockRequest.get("/floor");

export default {
  // reqBaseCategoryList:reqBaseCategoryList
  reqBaseCategoryList,
  reqSlide,
  reqFloor
};
