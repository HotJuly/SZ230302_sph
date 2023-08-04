import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home'
import Hot from '../pages/Hot'
import Like from '../pages/Like'

 Vue.use(VueRouter)

 /*
	1.导航守卫是什么?
		导航守卫又称为路由守卫
		导航守卫其实就是一个函数

		我个人认为,他其实更像是一种监听
			他监听的是路由的跳转操作

	2.为什么使用导航守卫?
		它可以监视用户跳转路由的操作,
			然后会自动执行导航守卫函数,从而做一些特殊的事情

	3.怎么使用导航守卫?
		问题:导航守卫分为几大类,几个?
		回答:
			一共分为3大类,有7个
				-全局守卫
					全局前置守卫(beforeEach)
						在路由跳转出发之前,就会触发该守卫
						例如:中->美

					全局解析守卫(beforeResolve)
						在路由组件代码解析结束之后,就会触发
						主要就是针对懒加载的组件使用的

					全局后置守卫(afterEach)
						在路由跳转到达之后,就会触发该守卫
						例如:中->菲
						注意:后置守卫不是用来监视离开的

					书写位置:绑定在路由器身上

				-路由独享守卫(beforeEnter)
					在准备进入某个路由的时候,会触发
						
					书写位置:绑定在路由对象身上

				-组件内置守卫
					-组件进入守卫(beforeRouteEnter)
						在准备进入某个组件的时候,会触发

					-组件更新守卫(beforeRouteUpdate)
						在当前组件被复用的时候会触发
						主要是针对多个路由地址,都显示同一个组件的情况准备的
							因为如果跳转路由之后,显示的还是同一个路由组件,该组件不会卸载
								那么当前组件的mounted中的代码,很可能不会再次执行
									相当于替代mounted的效果

					-组件离开守卫(beforeRouteLeave)
						在准备离开某个组件的时候,会触发
						注意:7个守卫中,只有这一个能监视到离开操作
						
					书写位置:绑定在组件的配置对象身上

		问题:导航守卫的触发顺序
		回答:
			例如:从A跳转到B
			1.先触发A组件的组件离开守卫(beforeRouteLeave)
			2.然后触发全局前置守卫(beforeEach)
			3.然后触发B路由的路由独享守卫(beforeEnter)
			4.最后触发B组件的组件进入守卫(beforeRouteEnter)

		
 
 */

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

/*
	需求:当用户跳转到某些特定权限才能进入的路由地址时候,
		检查是否具有权限,如果有就允许进入,否则回到首页

	拆解:
		1.当用户跳转到某些特定权限才能进入的路由地址时候
			需要监听用户的路由跳转
			此时需要监视的是整个项目的路由跳转
				所以选择使用beforeEach,来控制用户跳转

		2.如何知道用户是否具有权限?
			我人为创建一个标识
				通过变量isVIP进行辨别,true代表是vip,false代表不是

		3.路由的权限划分
			Home和Hot路由,无论是不是vip都可以进入
			Like路由,只有vip才能进入


*/

// 当前账号是否是vip的标识
const isVIP = false;

// 用于告知哪些路由不需要权限就能进入
const whiteList = ["/home",'/hot'];

router.beforeEach((to,from,next)=>{
	/*
		to->你想去哪里
		from->你从哪来
		next->放行
			next是一个函数
			next()->你想去哪就去哪
			next(false)->你从哪来回哪去
			next('/login')->带你去个好地方
							强行控制路由跳转到新的地址上去
	*/
	// console.log()

	if(isVIP){
		// 能进入这里,就说明当前账号是vip
		next();
	}else{
		// 能进入这里,就说明当前账号不是vip
		// 开始判断当前想去的路由是否需要vip权限
		// 如果不需要,就可以进入,如果需要,那就从哪来回哪去

		// 这是当前想要去哪里
		const currentPath = to.path;

		// 是否有资格进入
		const result = whiteList.includes(currentPath);

		if(result){
			// 能进入这里,说明当前想进入的路由,在白名单中,不需要权限
			next();
		}else{
			// 能进入这里,说明当前没有资格进入该路由,从哪来回哪去
			next(false)
		}
	}
})

export default router
