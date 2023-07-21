import VueRouter from 'vue-router';

const originPush = VueRouter.prototype.push;
const originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function(path,successCb,failCb){
    // 该方法的调用代码:this.$router.push()
    // 所以当前新的push的this,应该是$router对象

    /* 
        重写一个方法的目的,是为了在原先的功能上,还能增加一些新的功能
        
        本次增加的效果是在于判断用户的传参情况:
            如果开发者有传入成功或者失败的回调,就是用他们传入的回调函数
            否  则我们传入两个空的函数,防止报错的出现
    */ 
    if(successCb||failCb){
        originPush.call(this,path,successCb,failCb)
    }else{
        originPush.call(this,path,()=>{},()=>{})
    }
}

VueRouter.prototype.replace = function(path,successCb,failCb){

    if(successCb||failCb){
        originReplace.call(this,path,successCb,failCb)
    }else{
        originReplace.call(this,path,()=>{},()=>{})
    }
}