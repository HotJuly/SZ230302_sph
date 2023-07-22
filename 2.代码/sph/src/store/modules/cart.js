const state = {};

const mutations = {};

const actions = {
    getCategoryList(context){
        // 使用dispatch方法可以触发action
        // action的第一个参数是一个context对象,他是store对象的兄弟
        
        // console.log('getCategoryList',context)

        console.log('cart/getCategoryList')
    }};

const getters = {};


export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}