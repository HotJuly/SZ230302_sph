// 该文件专门收集首页的接口
import request from "@/utils/request";

const reqCartList = () =>
  request.get("/api/cart/cartList");

export default {
  reqCartList,
};
