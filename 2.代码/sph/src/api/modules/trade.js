// 该文件专门收集测试的接口
import request from "@/utils/request";

// 这是接口文档中的第10个接口,用于请求当前需要购买的商品信息
const reqTradeInfo = () => request.get("/api/order/auth/trade");

const reqUserAddress = () =>
  request.get("/api/user/userAddress/auth/findUserAddressList");

const reqSubmitOrder = (tradeNo,params) =>
  request.post(`/api/order/auth/submitOrder?tradeNo=${tradeNo}`,params);

export default {
  reqTradeInfo,
  reqUserAddress,
  reqSubmitOrder
};
