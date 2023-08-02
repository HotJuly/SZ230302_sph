// 该文件专门收集测试的接口
import request from "@/utils/request";

const reqCode = (phone) => request.get(`/api/user/passport/sendCode/${phone}`);

const reqRegister = (info) => request.post(`/api/user/passport/register`,info);


export default {
  reqCode,
  reqRegister
};
