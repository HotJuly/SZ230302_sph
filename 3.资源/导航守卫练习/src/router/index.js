import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home'
import Hot from '../pages/Hot'
import Like from '../pages/Like'

 Vue.use(VueRouter)

//暴露路由器
const router =  new VueRouter({
	mode:'history',
	routes:[
		{
			path:'/home',
			component:Home
		},
		{
			path:'/hot',
			component:Hot
		},
		{
			path:'/like',
			component:Like
		}
	]
})

export default router
