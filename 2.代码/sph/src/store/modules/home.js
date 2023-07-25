const state = {
    categoryList:[]
};

// mutation才有资格直接修改state数据
// mutation的数据类型:函数
// 该函数只能书写同步代码
const mutations = {
    SET_CATEGORY_LIST(state,categoryList){
        state.categoryList = categoryList.slice(0,15);
    }
};

// action中可以触发mutation
// 该函数可以书写异步代码,所以平常会在内部发送请求
const actions = {
    async getCategoryList(context){
        // 使用dispatch方法可以触发action
        // action的第一个参数是一个context对象,他是store对象的兄弟
        // action函数的this是谁? -> Store的实例对象
        
        // console.log('getCategoryList',context)
        // console.log('home/getCategoryList')

        // 通过this这个Store对象,获取他身上的_vm属性,该属性内部存储的是一个Vue的实例对象
        // 在通过该实例对象,可以快速获取到放在原型链上,所有的接口函数
        // await遇到成功的promise会执行后续的代码,如果遇到的是失败的promise,后续代码不执行
        const result = await this._vm.$API.home.reqBaseCategoryList();
        context.commit('SET_CATEGORY_LIST',result);
    }
};

const getters = {};


export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}