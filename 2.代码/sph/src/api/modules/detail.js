// 该文件专门收集测试的接口
import request from "@/utils/request";

const reqDetailInfo = (skuId) => request.get(`/api/item/${skuId}`);

const reqAddCart = (skuId,skuNum) =>
  request.post(`/api/cart/addToCart/${ skuId }/${ skuNum }`);

export default {
  reqDetailInfo,
  reqAddCart
};
