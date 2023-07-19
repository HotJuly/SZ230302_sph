import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/views/Home';
import Cart from '@/views/Cart';
import Login from '@/views/Login';
import Search from '@/views/Search';
import Register from '@/views/Register';

Vue.use(VueRouter);

export default new VueRouter({
    mode:"hash",
    routes:[
        {
            path:"/home",
            component:Home
        },
        {
            path:"/cart",
            component:Cart
        },
        {
            path:"/login",
            component:Login
        },
        {
            path:"/register",
            component:Register
        },
        {
            path:"/search",
            component:Search
        }
    ]
})