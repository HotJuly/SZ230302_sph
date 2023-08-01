// 该文件专门收集首页的接口
import request from "@/utils/request";

// 用于请求购物车中所有商品信息
const reqCartList = () => request.get("/api/cart/cartList");

// 用于请求将某个商品的选中状态进行切换
const reqChangeCheck = (skuID, isChecked) =>
  request.get(`/api/cart/checkCart/${skuID}/${isChecked}`);

// 用于请求将多个商品的选中状态进行切换(主要是实现全选效果)
const reqChangeAllSelected = (isChecked, idList) =>
  request.post(`/api/cart/batchCheckCart/${isChecked}`, idList);

// 用于请求将某个商品的删除
const reqDeleteGood = (skuId) =>
  request.delete(`/api/cart/deleteCart/${skuId}`);

// 用于请求将多个商品进行删除
// 此处是个大坑,后端接口文档写的是delete请求,实际上是post请求
const reqDeleteGoods = (idList) =>
  request.post(`/api/cart/batchDeleteCart`, idList);


export default {
  reqCartList,
  reqChangeCheck,
  reqChangeAllSelected,
  reqDeleteGood,
  reqDeleteGoods
};
