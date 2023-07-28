import Vue from 'vue';
import VueRouter from 'vue-router';

import './rewriteNavigate.js';

import Home from '@/views/Home';
import Cart from '@/views/Cart';
import Login from '@/views/Login';
import Search from '@/views/Search';
import Register from '@/views/Register';
import Detail from '@/views/Detail';
import Test from '@/views/Test';

Vue.use(VueRouter);


export default new VueRouter({
    mode:"hash",
    routes:[
        {
            path:"/home",
            component:Home,
            meta:{
                isShowTypeNav:true,
                isShowFooter:true
            }
        },
        {
            path:"/cart",
            component:Cart,
            meta:{
                isShowFooter:true
            }
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
            component:Search,
            meta:{
                isShowTypeNav:true,
                isShowFooter:true
            }
        },
        {
            path:"/detail/:id",
            component:Detail,
            meta:{
                isShowTypeNav:true,
                isShowFooter:true
            }
        },
        {
            path:"/test",
            component:Test
        },
        {
            path:"*",
            redirect:"/home"
        }
    ]
})