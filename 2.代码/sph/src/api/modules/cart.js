// 该文件专门收集首页的接口
import request from "@/utils/request";

const reqCartList = () => request.get("/api/cart/cartList");

const reqChangeCheck = (skuID, isChecked) =>
  request.get(`/api/cart/checkCart/${skuID}/${isChecked}`);

const reqChangeAllSelected = (isChecked,idList) =>
  request.post(`/api/cart/batchCheckCart/${isChecked}`,idList);

export default {
  reqCartList,
  reqChangeCheck,
  reqChangeAllSelected
};
