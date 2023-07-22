import Vue from "vue";
import Vuex from 'vuex';

import home from './modules/home';
import cart from './modules/cart';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{},
    mutations:{
        // mutation才有资格直接修改state的数据
        // 这里面可以书写多个mutation
    },
    actions:{},
    getters:{},
    modules:{
        home,
        cart
    }
})