import { v4 as uuid} from 'uuid';
let userTempId = localStorage.getItem('userTempId');

/*
    需求:
        如果当前用户没有uuid,那么就生成一个新的给他使用
        如果当前用户已经有生成过uuid,那么就继续使用上次的uuid
            细节:uuid不仅这次项目启动需要使用,下一次也需要使用
                所以应该存入localStorage
*/
function getTempId(){
    if(userTempId){
        return userTempId;
    }else{
        userTempId = uuid();
        localStorage.setItem('userTempId',userTempId);
        return userTempId;
    }
}

export default getTempId;