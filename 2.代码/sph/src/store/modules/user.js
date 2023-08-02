const state = {
    token:"",
    userInfo:{}
};

const mutations = {
    SET_TOKEN(state,token){
        state.token = token;
    },
    SET_USER_INFO(state,userInfo){
        state.userInfo = userInfo;
    }
};

const actions = {
    async login({commit},{phone,password}){
        // action中的this是当前的store对象
        // 所以可以通过store._vm找到一个Vue的实例对象

        // async函数一定会返回一个promise对象
        // 该promise对象的初始状态为pending,
        // 当async函数内部所有的代码都执行结束,他的状态就会变为成功
      const {token} = await this._vm.$API.user.reqLogin({
        phone,
        password
      });

      commit('SET_TOKEN',token);
    },
    async getUserInfo({commit}){
        const userInfo = await this._vm.$API.user.reqUserInfo();
        commit('SET_USER_INFO',userInfo);
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