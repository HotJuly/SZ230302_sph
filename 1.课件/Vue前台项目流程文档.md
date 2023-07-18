# Vue前台项目笔记

## day01

### 1. 了解项目功能

- 简单的看看项目有什么功能。

### 2. 初始化脚手架

1. 执行`vue create xxxxxx`初始化项目。

2. 调整`index.html`，配置好网页的`<title>`。

3. 删掉`src`下所有文件，自己创建：`main.js`、`App.vue`。

4. 配置`vue.config.js`，关闭语法检查：

   ```js
   const { defineConfig } = require('@vue/cli-service')

   module.exports = defineConfig({
     transpileDependencies: true,
   	lintOnSave:false,//关闭语法检查
   })
   ```

5. 配置less解析环境：

   - 第一步：`npm i less-loader`。

   - 第二步：组件中编写一段`less`样式，测试一下：

     ```less
     <style lang="less">
     	.app{
     		background-color: gray;
     		.title{
     			color: orange;
     		}
     	}
     </style>
     ```


### 3. 关于生产依赖、开发依赖（重要）

帮我们实现【功能效果】的库，不加-D   ==> 生产依赖

帮我们【加工代码】的库，加-D   ==>  开发依赖

> 举例子，铺瓷砖：
> 第一种：买工人、买工具、买瓷砖 ===> 瓷砖铺好了，工具、工人
> 第二种：雇工人、租工具、买瓷砖 ===> 瓷砖铺好了

### 4. 搭建整体结构

1. 分析得知，需要两个**一般** 组件：`Header`、`Footer`。

2. 在`src/components`中编写这两个组件，把它们的结构、样式写好，注意：

   >  1. 组件用文件夹形式编写 。
   >  2. 组件中用到的图片，放在对应的 `images` 文件夹中。

3. 备注：

   > 组件结构在：`谷粒商城-辉鸿/home.html`中。
   >
   > 对应样式在：`谷粒商城-辉鸿/css/home.less`中。
   >
   > 重置CSS样式在：`谷粒商城-辉鸿/css/reset.css`。

4. `App`组件中引入，并使用：`Header`组件、`Footer`组件。

### 5. 实现路由切换

1. 分析得知，暂时需要四个路由组件：

   - **Home（主页）**
   - **Login（登录）**
   - **Register（注册）**
   - **Search（搜索）**

2. 在`src/pages`下编写上述路由组件。

   > 注意 ：先不用写这个四个组件的具体内容，后期用到再写。

3. 安装vue-router：`npm i vue-router@3`。

4. 编写路由配置文件：`src/router/index.js`：

   > - 配置路由器工作模式：`mode:'history'`。
   > - 在脚手架中`@`代表`src`根目录。

5. `main.js`中引入并配置`router`，并在`App.vue`中，写好`<router-view/>`。

6. 去`Header`组件中指定位置，编写好路由跳转：

   ```vue
   <!-- 跳转登录 -->
   <router-link to="/login">登录</router-link>

   <!-- 跳转注册 -->
   <router-link to="/register" class="register">免费注册</router-link>

   <!-- 跳转主页 -->
   <router-link class="logo" title="尚品汇" to="/home">
     <img src="./images/logo.png" alt="" />
   </router-link>

   <!-- 跳转搜索 -->
   <button class="sui-btn btn-xlarge btn-danger" type="button" @click="toSearch">
     搜索
   </button>

   <script>
     export default {
       name: "Header",
       methods: {
         toSearch(){
           this.$router.push('/search')
         }
       },
     };
   </script>
   ```

7. 编写一个重定向，让项目一上来就去`/home`。

### 6.对原生方法进行增强（重要）

1. 需求：对数组的`push`方法做增强，让`push`进去的数字，比写的数字大`1`。

2. 具体实现：

   ```js
   //将Array原型上的push方法备份一份
   const originPush = Array.prototype.push

   //修改push方法为我们写的方法
   Array.prototype.push = function (value){
     value += 1 //数字加1
     return originPush.call(this,value) //调用原始的push，完成添加元素
   }
   ```

### 7.处理路由重复跳转报错（重要）

1. 问题描述：编程式路由导航，若重复跳转会抛出： <strong style="color:red">NavigationDuplicated</strong> 的错误。

2. 问题原因：

   - `vue-router 3.1.0` 之后，编程式路由导航内部使用了`Promise`语法。

   - 如果路由跳转时没有指定：成功、失败回调函数，返回值就是`Promise`实例。

   - 且内部会判断路径否变化，规则如下：

     1. 若<strong style="color:red">无变化</strong>，则返回的`Promise`实例状态为<strong style="color:red">失败</strong>；
     2. 若<strong style="color:green">有变化</strong>，则返回的`Promise`实例状态为<strong style="color:green">成功</strong>；

3. 解决办法：

   1. 办法一：指定成功、失败的回调函数，代码如下：

      ```js
      this.$router.replace('/home/message',()=>{})
      ```

   2. 办法二：使用`catch`处理错误，代码如下：

      ```js
      this.$router.replace('/home/message').catch(() => {})
      ```

   3. 办法三：见下面

### 8.增强 VueRouter.prototype.push（重要）

修改 VueRouter 原型上的 push 和 replace 方法 （推荐）

```js
//将VueRouter原型上的push和replace保存一份
const originPush = VueRouter.prototype.push 
const originReplace = VueRouter.prototype.replace 

//修改VueRouter原型上的push，用于解决重复跳转报错
VueRouter.prototype.push  = function(location,okCallback,errCallback){
	if(okCallback || errCallback){
		return originPush.call(this,location,okCallback,errCallback)
	}else{
		return originPush.call(this,location).catch(()=>{})
	}
}
//修改VueRouter原型上的replace，用于解决重复跳转报错
VueRouter.prototype.replace  = function(location,okCallback,errCallback){
	if(okCallback || errCallback){
		return originReplace.call(this,location,okCallback,errCallback)
	}else{
		return originReplace.call(this,location).catch(()=>{})
	}
}
```

### 9. 配置一个测试路由

1. 开发时，我们可能临时写一些测试的代码，所以最好临时配置一个测试的路由组件。
2. 具体操作：
   - 第一步：在`src\pages`编写一个`Test`路由组件。
   - 第二步：去`src\router\index.js`追加一个路由规则。
   - 第三步：去`src\components\Header\index.vue`追加一个按钮，点击可以去`/test`。

### 10. 配置代理解决跨域_方法一（重要）

- 在`Test`组件中，尝试发请求，获取首页三级分类信息。

- 给谁发请求，用什么方式发请求，请求参数是什么？要参考接口文档。

- 核心代码如下，遗憾的是：由于跨域问题，未能获取成功！！！

  ```js
  handleTest(){
    axios.get('http://sph-h5-api.atguigu.cn/api/product/getBaseCategoryList').then(
      response => {console.log(response)},
      error => {console.log('出错了',error)}
    )
  }
  ```

- 如何解决？—— 配置代理，在`vue.config.js`中添加配置，代码如下：

  ```js
  devServer:{
    proxy:"http://sph-h5-api.atguigu.cn"
  }
  ```

- 随后修改发送请求的代码如下，随后就可以成功获取数据

  ```js
  handleTest(){
    axios.get('/api/product/getBaseCategoryList').then(
      response => {console.log(response)},
      error => {console.log('出错了',error)}
    )
  }
  ```

- 注意：此种方式只能配置一个代理

### 11.配置代理解决跨域_方法二（重要）

- 编写`vue.config.js`配置具体代理规则：

  ```js
  module.exports = {
    devServer: {
      proxy: {
        '/sph': {// 匹配所有以 /sph 开头的请求路径
          target: 'http://sph-h5-api.atguigu.cn',// 代理目标的基础路径
          changeOrigin: true,
          pathRewrite: {'^/sph': ''}
        },
        '/yulu': {// 匹配所有以 /yulu 开头的请求路径
          target: 'https://api.uixsj.cn',// 代理目标的基础路径
          changeOrigin: true,
          pathRewrite: {'^/yulu': ''}
        }
      }
    }
  }
  /*
     changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
     changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:8080
     changeOrigin默认值为true
  */
  ```

## day02

### 1. 二次封装axios（重要）

1. 作用：让项目中发送`ajax`请求更加方便。

2. 封装目标： 

   - 配置`ajax`请求：基本路径、超时时间。

   - 给`ajax`请求添加进度条效果。

   - 返回服务器响应的真正数据。

   - 统一处理`ajax`请求错误。

3. 备注：

   > 具体代码请参考：`src/api/myAxios.js`。
   >
   > 安装`nprogress`的命令：`npm i nprogress`

### 2. 统一管理ajax请求（重要）

1. 好处：对项目中的请求进行统一管理，便于后期维护和升级。

2. 参考文件：`src/api/index.js`

   ```js
   /* 
   	该文件用于：管理整个项目的ajax请求，每一个后端接口，都在这文件中对应一个函数
   	该文件中，所有的函数，命名规范都为：reqXxxxx
   */
   import myAxios from './myAxios'

   //请求三级分类信息
   export const reqCategoryList = () => myAxios.get('/api/product/getBaseCategoryList')
   ```

3. 总结：

   - `src\api\myAxios.js`是对`axios`的封装，组件中不要引入`myAxios.js`！
   - `src\api\index.js`是统一管理请求的，发请求时要引入这里名为`reqXxxxx`的函数！

### 3. Home子组件

1. 包含7个组件（实现不难，但是比较“恶心”，得处理图片、路径问题）：
   - TypeNav（三级分类导航）
   - ListContainer（轮播+右分类）
   - Recommend（今日推荐）
   - Rank（商品排行）
   - Like（猜你喜欢）
   - Floor（楼层，即：家用电器、手机通讯）
   - Brand（商标区）
2. 建议大家自己写完一到三个，剩下的就可以直接复制我们的静态组件了。

### 4. 搭建vuex环境（重要）

1. 明确：项目中要使用Vuex存储数据

2. 安装Vuex：`npm i vuex@3`。

3. 创建store：`src/store/index.js`。

   ```js
   import Vue from 'vue'
   import vuex from 'vuex'

   //使用插件
   Vue.use(vuex)

   //用于响应组件中的“动作”  —— 服务员
   const actions = {}

   //用于真正操作数据  —— 厨师
   const mutations = {}

   //初始化的数据 —— 原材料
   const state = {
   	a:1
   }

   //vuex层面的计算属性
   const getters = {}

   //创建store
   const store = new vuex.Store({
   	actions,
   	mutations,
   	state,
   	getters
   })

   //暴露store
   export default store
   ```

4. 记得在`main.js`中引入并配置`store`。

   ```js
   /******/
   import store from './store'
   /******/
   new Vue({
   	/******/
   	store
   })
   ```

### 5. vuex模块化编码（重要）

1. 目的：将`state`中的数据进行分类，且每个分类都对应一个`.js`文件。

2. 创建`vuex`中的`home`模块：`src/store/home.js`，用于保存主页关的数据。

   ```js
   //用于响应组件中的“动作”  —— 服务员
   const actions = {}

   //用于真正操作数据  —— 厨师
   const mutations = {}

   //初始化的数据 —— 原材料
   const state = {
   	categoryList:[]
   }

   //vuex层面的计算属性
   const getters = {}

   export default {
   	actions,
   	mutations,
   	state,
   	getters
   }
   ```

3. 创建vuex中的user模块：`src/store/user.js`，用于保存用户相关的数据；

   ```js
   //用于响应组件中的“动作”  —— 服务员
   const actions = {}

   //用于真正操作数据  —— 厨师
   const mutations = {}

   //初始化的数据 —— 原材料
   const state = {
   	name:'老六'
   }

   //vuex层面的计算属性
   const getters = {}

   export default {
   	actions,
   	mutations,
   	state,
   	getters
   }
   ```

4. 在`src/store/index.js`中合并：home模块、user模块

   ```js
   import Vue from 'vue'
   import vuex from 'vuex'
   import home from './home'
   import user from './user'

   //*********************

   //创建store
   const store = new vuex.Store({
   	actions,
   	mutations,
   	state,
   	getters,
     //追加一个配置：modules
   	modules:{
   		home,
   		user
   	}
   })

   //暴露store
   export default store
   ```

### 6. 三级分类数据存入vuex

- 编写`store/home.js`

- `TypeNav`组件一挂载就发`dispatch`（联系对应服务员获取数据）。

  ```js
  mounted() {
    this.$store.dispatch('getCategoryList')
  }
  ```

- 注意要在actions中发请求

  ```js
  import {reqCategoryList} from '@/api'

  const actions = {
  	//专门用于获取三级分类列表 —————— 服务员
  	async getCategoryList({commit}){
  		// 调用reqCategoryList去联系服务器，要三级分类列表
  		const result = await reqCategoryList()
  		// 判断业务逻辑是否成功 ---- 代码只要能走到这一行，响应一定是成功的，接下来就是判断业务逻辑是否成功了
  		if(result.code === 200){
  			//若业务逻辑成功，联系厨师
  			commit('SAVE_CATEGORY_LIST',result.data)
  		}else{
        //若业务逻辑失败，提示原因
  			alert(result.message)
  		}
  	}
  }

  const mutations = {
    //保存分类数据
  	SAVE_CATEGORY_LIST(state,list){
  		state.categoryList = list
  	}
  }

  const state = {
  	categoryList:[] //初始化三级分类数据
  }

  const getters = {}

  export default {
  	actions,
  	mutations,
  	state,
  	getters
  }
  ```

> 注意区分：响应成功  和  业务逻辑成功
>
> 举例1：登录系统，若用户名密码正确，服务器返回登录成功，这是：响应成功、业务逻辑也成功。
>
> 举例2：登录系统，若密码输入错误，服务器返回登录失败，这是：响应成功、业务逻辑却失败。
>
> 举例3：登录系统，服务器繁忙，无法做出响应，这是：响应失败，业务逻辑必定失败。

### 7.mapState读取深层次数据（重要）

需求：在`TypeNav`组件中读取出`state.home.categoryList`，具体代码如下：

```js
computed:{
  ...mapState({
    categoryList: state => state.home.categoryList
  })
}
```

### 8. 动态展示三级分类

1. 使用mapState读取数据

   > 注意此处使用了一个特殊的写法，让`mapState`可以读取深层次的数据。

   ```js
   import { mapState } from "vuex";

   export default {
     name: "TypeNav",
     //*******
     computed: {
       //通过mapState读取出vuex中的分类数据
       ...mapState({
         categoryList: state => state.home.categoryList //读取深层次的数据。
       })
     },
   	//*******
   };
   ```

2. 分析好导航结构，分析好数据层次，使用`v-for`遍历数据；

3. 服务器返回的一级分类过多，我们只时候用前15个，去action中处理一下。

   ```js
   //******
   commit('SAVE_CATEGORY_LIST',result.data.slice(0,15))
   //****
   ```

4. 注意点：`v-for`的嵌套使用；

   ```html
   <!-- 每一个一级分类 -->
   <div class="item" v-for="c1 in categoryList" :key="c1.categoryId">
     <h3>
       <a href="">{{c1.categoryName}}</a>
     </h3>
     <div class="item-list clearfix">
       <!-- 每一个二级分类 -->
       <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
         <dl class="fore">
           <dt>
             <a href="">{{c2.categoryName}}</a>
           </dt>
           <dd>
             <!-- 每一个三级分类 -->
             <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
               <a href="">{{c3.categoryName}}</a>
             </em>
           </dd>
         </dl>
       </div>
     </div>
   </div>
   ```

### 9. 优化分类样式

调整了几个地方的样式

```less
/*TypeNav的样式*/
h3 {
  line-height: 30px;
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
  padding: 0 20px;
  margin: 0;
	&:hover{
		background-color: #e1251b;
		a{
			color: white;
		}
	}
  a {
    color: #333;
  }
}

dd{
  /*********/
  width: 520px;
  /*********/
}
dt{
  /*********/
  width: 68px;
  /*********/
}

/*reset.css*/
/* 重置文本格式元素 */
a:link:hover{
    color : rgb(79, 76, 212) !important;
    text-decoration: none;
}
```

## day03

### 1. 动态展示Footer（重要）

- 登录组件（`Login`）、注册组件（`Register`），不展示底部的`Footer`组件，使用路由元配置——`meta`配置

  ```js
  //创建并暴露一个路由器
  export default new VueRouter({
  	mode:'history',
  	routes:[
  		/**********/
  		{
  			path:'/login',
  			component:Login,
  			meta:{isHiddenFooter:true},//路由元信息
  		},
  		{
  			path:'/register',
  			component:Register,
  			meta:{isHiddenFooter:true}
  		},
  		/**********/
  	]
  })
  ```

- 在`App.vue`中做出判断

  ```vue
  <!-- 底部组件 -->
  <Footer v-show="!$route.meta.isHiddenFooter"/>
  ```

### 2. 点击分类跳转Search（重要）

- 第一种写法：把分类链接的 `<a>`改为`<router-link>` ——  不推荐，很占内存。
- 第二种写法：依然写```<a>```，靠事件委派实现跳转 —— 推荐，节约内存。

```vue
<!-- 使用事件委派跳转/search -->
<div class="all-sort-list2" @click="toSearch">
  <!-- ------- -->
</div>

<script>
	methods:{
		toSearch(){
			this.$router.push('/search')
		}
	}
</script>
```

> 注意：此时还是有bug的，点击空白处也能跳转，一会就解决！

### 3. 获取点击分类的信息

1. 要获取三个东西：分类级别、分类名称、分类编号。

2. 具体操作：

   - 给每导航里的分类加2个自定义属性：`data-level`、`data-id`。

     ```vue
     <!-- 一级分类 -->
     <a data-level="1" :data-id="c1.categoryId">{{c1.categoryName}}</a>
     <!-- 二级分类 -->
     <a data-level="2" :data-id="c2.categoryId">{{c2.categoryName}}</a>
     <!-- 三级分类 -->
     <a data-level="3" :data-id="c3.categoryId">{{c3.categoryName}}</a>
     ```

   - 分类名称，使用：`event.target.innerText`获取。

   - 分类名称、分类编号，使用：`event.target.dataset.???`获取。

   ```js
   methods:{
     //跳转到search路由
     toSearch(e){
       //获取到点击分类的：分类级别、分类编号、分类名称
       const {level,id} = e.target.dataset
       const {innerText} = e.target
       //判断点击的是否为分类
       if(level){
         //分类名称
         console.log(level,id,innerText)
       }
     }
   }
   ```

### 4. 给 Search 传递参数

- 分类编号（`category1Id` 或 `category2Id` 或 `category3Id` ）

- 分类名字（`categoryName`）

- 完善`toSearch`方法，实现了给Search传参

  ```js
  //跳转到search路由
  toSearch(e){
    //第一步：获取到点击分类的：分类级别、分类编号、分类名称
    const {level,id} = e.target.dataset
    const {innerText} = e.target
    //判断点击的是否为分类
    if(level){
      //第二步：跳转search
      this.$router.push({
        path:'/search',
        query:{
          [`category${level}Id`]:id,
          categoryName:innerText
        }
      })
    }
  }
  ```

- Search组件中简单的呈现一下参数：

  ```vue
  <div class="search">
    <h1>Search</h1>
    <h1>我收到的路由参数：{{$route.query}}</h1>
  </div>
  ```

### 5. TypeNav 变全局组件

1. 为什么这样做？—— 因为发现很多组件中都要用`TypeNav`。

2. 具体操作：

   - 第一步：将`TypeNav`组件，放入`/src/components`中。

   - 第二步：`src/main.js`中引入，并全局注册`TypeNav`组件。

     ```js
     //***************
     import TypeNav from './components/TypeNav'
     //全局注册TypeNav组件
     Vue.component('TypeNav',TypeNav)
     //***************
     ```

   - 第三步：去除`src/pages/Home/index.vue`中对`TypeNav`的引入与注册。

   - 第四步：去`Search`组件中，直编写`TypeNav`组件标签即可。

###  6. Search 中的 TypeNav

1. 三个需求：

   - 需求1：在`Search`组件中使用`TypeNav`组件。
   - 需求2：三级分类默认隐藏，鼠标移入时展示，鼠标移出隐藏。
   - 需求3：若所处路由是`/home`那分类导航永不消失！

2. 分析得知：

   - 要给最外侧的 `<div class="nav-left">` 加：鼠标移出事件。
   - 要给 `<h2 class="all">全部商品分类</h2>` 加：鼠标移入事件。

3. 参考代码：`src/components/TypeNav/index.js`

   ```js
   data() {
     return {
       //根据当前路径决定isShow的值
       isShowSort:this.$route.path === '/home' ? true : false
     }
   }

   /***********/
   methods:{
     /***********/
     executeHidden(){
       if(this.$route.path !== '/home'){
         this.isShowSort = false
       }
     }
   }
   ```

### 7. TypeNav动画效果（重要）

1. 需求：`TypeNav`组件下拉框加上动画效果。

2. 安装：`npm i animate.css`。

3. 具体编码：

   ```vue
   <transition	
   	enter-active-class="animate__fadeIn"	
   	leave-active-class="animate__fadeOut"
   >	
     <div class="sort animate__animated" v-show="isShowNav">
       <!------------>
     </div>
   </transition>

   <script>	
     import 'animate.css'
     /**********/
   </script>	

   <style>    
     .sort {        
       /**********/
       --animate-duration: 0.5s;    
     }
   </style>
   ```

### 8. 携带关键词跳Search

1. 目标：点击搜索按钮，携带关键词，跳转到`/search`。

2. 思路：`v-model`收集用户输入的关键词，点击事件实现跳转。

3. 具体代码：

   ```vue
   <form class="searchForm">
     <input v-model="keyword" **** />
     <button type="button" @click="toSearch">搜索</button>
   </form>

   <script>
   	export default {
   		name: 'Header',
   		data() {
   			return {
   				keyword:'' //用户输入的搜索关键词
   			}
   		},
   		methods:{
   			//点击搜索按钮的回调
   			toSearch(){
           this.$router.push({
             path:'/search',
             query:{
               keyword:this.keyword || undefined
             }
           })
         }
   		}
   	}
   </script>
   ```

### 9.  合并搜索参数（难点 ）（重要）

1. 明确需求：搜索的关键词 和 分类名，要进行合并的。

   > 例如：点击【手机分类】，随后再搜索【华为】，最终是一个组合的条件：【手机分类+华为】。

2. `Header`组件、`TypeNav`组件中的 `toSearch` 方法都要改一下。

3. `TypeNav`组件的`toSearch`方法：

   ```js
   //用于跳转到：/search
   toSearch(e){
     //获取点击分类的信息
     const {level,id} = e.target.dataset
     const {innerText} = e.target
     //获取当先的关键词
     const {keyword} = this.$route.query
     //判断点击的是否为分类
     if(level){
       this.$router.push({
         path:'/search',
         query:{
           keyword,//携带关键词
           [`category${level}Id`]:id,
           categoryName:innerText
         }
       })
     }
   },
   ```

4. `Header`组件的`toSearch`方法：

   ```js
   toSearch(){
     //获取当前所有的参数
     const {query} = this.$route
     //跳转路由
     this.$router.push({
       path:'/search',
       query:{
         ...query, //携带之前所有的参数
         //携带关键词，如果用户输入为空，则将值置为undefined，目的是为了忽略该参数
         keyword:this.keyword || undefined
       }
     })
   }
   ```

## day04


### 1. mockjs基本使用（重要）

1. 安装：`npm i mockjs`。

2. 在`src/mock/index.js`内容如下：

   ```js
   import Mock from 'mockjs'
   //制订拦截规则
   Mock.mock('http://www.0307.com','get','你好啊，今天没下雨！')
   ```

3. 记得在`main.js`中引入一下，让其参与整个项目的运行。

4. 只要通过发出去的是`get`类型的ajax请求，地址只要是`http://www.0307.com`就能拦截了。

5. 备注：使用`mockjs`后，浏览器的网络选项卡中一定看不到任何的请求。

6. 去`Test`组件中发送一个请求测试一下。

   ```js
   async handleTest(){
     const result = await axios.get('http://www.0307.com')
     console.log(result)
   }
   ```

### 2. 模拟：楼层、轮播图数据

1. 复制：`首页广告轮播数据.json`、`首页楼层数据.json`到`src/mock`中。

2. 分别改名为：`slide.json`、`floor.json`。

3. 修改`/src/mock/index.js`如下：

   ```js
   import Mock from 'mockjs'
   import floor from './floor.json'
   import slide from './slide.json'

   //模拟轮播图的接口
   Mock.mock('http://www.0307.com/slide','get',{
   	code:200,
   	message:'成功',
   	ok:true,
   	data:slide
   })

   //模拟获取楼层信息的接口
   Mock.mock('http://www.0307.com/floor','get',{
   	code:200,
   	message:'成功',
   	ok:true,
   	data:floor
   })
   ```

4. 去`src\pages\Test`里发个请求，测试一下。

   ```js
   //注意此处临时使用未经封装的axios发送请求，因为myAxios有固定的前缀/sph
   methods:{
     async test(){
       let result1 = await axios.get('http://www.0307.com/slide')
       let result2 = await axios.get('http://www.0307.com/floor')
       console.log(result1.data)
       console.log(result2.data)
     }
   }
   ```

### 3. 为 mock 封装 axios

1. 为什么要为`mock`封装`axios`？ —— 想模拟的真实一些，模拟请求也需要：进度条、超时时间等等。

2. 具体操作：

   - 复制一份：`src/api/ajax.js`到`src/api`中，改名为：`mockAxios.js`，并修改其中的`baseURL`：

     ```js
     //........
     	const mockAxios = axios.create({	
         baseURL:'http://www.0307.com', //请求基本路径
         //.......
       })
       
       //.......
       
       export default mockAxios
       
     //........
     ```

- 以后只要想获取模拟数据，就用`mockAxios`发，而且会自动携带 `http://www.0307.com`前缀。


### 4. 轮播图数据存入vuex

1. 去`src\api\index.js`追加两个请求函数，分别用于：请求楼层数据、请求轮播图数据。

   ```js
   import ajax from './ajax'
   import mockAxios from './mockAxios'

   //******

   //该函数专门用于：请求轮播图数据（模拟数据）
   export const reqSlideList = () => mockAxios.get('/slide')

   //该函数专门用于：请求楼层数据（模拟数据）
   export const reqFloorList = () => mockAxios.get('/floor')
   ```

2. 编写`src/store/home.js`，添加属于轮播图的：`actions`、`mutations`、`state`，代码如下：

   ```js
   import {reqCategoryList,reqSlideList} from '@/api'

   const actions = {
   	/*......*/
   	//专门用于获取轮播图数据
   	async getSlideList({commit}){
   		let result = await reqSlideList()
   		// 判断是否获取成功
   		if(result.code === 200){
   			//若成功，联系对应的muatation去存储数据
   			commit('SAVE_SLIDE_LIST',result.data)
   		}else{
   			// 若获取不成功，提示原因
   			alert(result.message)
   		}
   	}
   }
   const mutations = {
   	/*......*/
   	//存储轮播图数据
   	SAVE_SLIDE_LIST(state,list){
   		state.slideList = list
   	}
   }

   const state = {
   	categoryList:[], //首页的三级分类导航数据
   	slideList:[],//首页大轮播图数据
   }

   const getters = {}

   export default {
   	actions,
   	mutations,
   	state,
   	getters
   }
   ```

3. `ListContainer`组件一挂载，就分发一个 `getslideList `获取轮播图数据。

   ```js
   mounted() {	
     this.$store.dispatch('getSlideList')
   }
   ```

### 5.  处理vuex假报错（重要）

1. 问题描述：从`undefined`上读取属性会报错。

2. 代码演示：

   ```js
   //例如vuex中数据格式如下：
   const state = {
     a:[],
     x:{}
   }
   ```

   ```html
   <!--下写法均会报错-->
   <h1>{{a[0].id}}</h1>
   <h1>{{x.y.z}}</h1>
   ```

3. 如何解决？

   - 第一种方法：在最初就设计好数据层次。

     ```js
     const state = {
       a:[{}],
       x:{y:{}}
     }
     ```

   - 第二种方法：使用数据时加判断。

     ```vue
     <h1 v-if="a[0]">{{a[0].id}}</h1>
     <h1 v-if="x.y">{{x.y.z}}</h1>
     ```

   - 备注：若模板中恰巧使用了`v-for`遍历，那么问题自动消失。

     ```vue
     <h1 v-for="s in slideList" :key="s.id">{{s.imgUrl}}</h1>
     ```

### 6. 准备模拟数据中的图片

- 脚手架的根路径是：`public`文件夹。
- 操作是：把`ListContainer`中的图片剪切一份，放在`public\images`中，这样项目才能用。

### 7. vue-awesome-swiper的使用（重要）

1. `Swiper`是专门做轮播图的库，在：原生项目、Vue项目、Reatc项目中，均可使用。

2. 在`Vue`项目中，可以使用`vue-awesome-swiper`来更方便的实现轮播图。

3. 安装：`npm i vue-awesome-swiper@4.1.1 `。

4. 在`Test`组件中实现一个简单的轮播

   ```vue
   <template>
     <swiper class="swiper" :options="swiperOption">
   	<!-- 每一屏 -->
       <swiper-slide><h1 class="item">第1屏</h1></swiper-slide>
       <swiper-slide><h1 class="item">第2屏</h1></swiper-slide>
       <swiper-slide><h1 class="item">第3屏</h1></swiper-slide>
       <swiper-slide><h1 class="item">第4屏</h1></swiper-slide>
   		<!-- 底部小圆点 -->
       <div class="swiper-pagination" slot="pagination"></div>
   		<!-- 上一张、下一张按钮 -->
       <div class="swiper-button-prev" slot="button-prev"></div>
       <div class="swiper-button-next" slot="button-next"></div>
     </swiper>
   </template>

   <script>
   	//引入组件
     import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
   	//引入样式
     import 'swiper/css/swiper.css'

     export default {
       name: 'Test',
       components: {
         Swiper,
         SwiperSlide
       },
       data() {
         return {
   				swiperOption: {
             slidesPerView: 1,
             spaceBetween: 30,
             loop: true,
             pagination: {
               el: '.swiper-pagination',
               clickable: true
             },
             navigation: {
               nextEl: '.swiper-button-next',
               prevEl: '.swiper-button-prev'
             }
           }
         }
       }
     }
   </script>

   <style lang="less" scoped>
     .item{
   		height: 300px;
   		font-size: 40px;
   		text-align: center;
   		line-height: 300px;
   		background-image: linear-gradient(45deg,red,yellow,green);
   	}
   </style>
   ```

### 8. 轮播图参数说明

```js
				//轮播图配置对象
        swiperOption: {
          slidesPerView: 1, //同时展示几屏
          spaceBetween: 30, //每屏间隔
          loop: true, //是否循环轮播
					speed:1000, //切换速度
					//自动轮播
					autoplay: {
            delay: 2500,//轮播间隔
            disableOnInteraction: false //鼠标点击后，是否禁止自动轮播
          },
					//分页器配置（小圆点）
          pagination: {
            el: '.swiper-pagination', //分页器元素
            clickable: true //小圆点是否可以点击
          },
					//导航按钮（左箭头、右箭头）
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
```

### 9. ListContainer 中的轮播

```vue
<swiper class="swiper" :options="swiperOption">
  <!-- 每一屏 -->
  <swiper-slide v-for="slide in slideList" :key="slide.id">
    <img :src="slide.imgUrl" />
  </swiper-slide>
  <!-- 分页器 -->
  <div class="swiper-pagination" slot="pagination"></div>
  <!-- 左箭头 -->
  <div class="swiper-button-prev" slot="button-prev"></div>
  <!-- 右箭头 -->
  <div class="swiper-button-next" slot="button-next"></div>
</swiper>

<script>
  /*********/
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
	import 'swiper/css/swiper.css'
  
  export default {
      name: "ListContainer",
      components: {Swiper,SwiperSlide},
      data() {
        return {
          swiperOption: {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            speed:1000,
            autoplay: {
              delay: 1000,
              disableOnInteraction: false
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
          }
        }
    	},
  };
</script>
```

### 10. 楼层数据存入Vuex

- 编写vuex一套流程保存`floor`数据，编写`home.js`中的：`actions`、`mutatiosn`、`state`。

  ```js
  import {reqCategory,reqSlideList,reqFloorList} from '@/api'

  //用于响应组件中的“动作”  —— 服务员
  const actions = {
  	//******
  	//专门用于获取轮楼层数据
  	async getFloorList({commit}){
  		let result = await reqFloorList()
  		if(result.code === 200){
  			commit('SAVE_FLOOR_LIST',result.data)
  		}else{
  			alert(result.message)
  		}
  	}
  }

  //用于真正操作数据  —— 厨师
  const mutations = {
    //******
  	//存储楼层数据
  	SAVE_FLOOR_LIST(state,value){
  		state.floorList = value
  	}
  }

  //初始化的数据 —— 原材料
  const state = {
  	categoryList:[], //三级分类数据
  	slideList:[], //轮播图数据
  	floorList:[]
  }

  //vuex层面的计算属性
  const getters = {}

  export default {
  	actions,
  	mutations,
  	state,
  	getters
  }
  ```

- `Home`组件一挂载就：联系action获取楼层数据，随后读取出来，准备使用。

  ```js
  //组件一挂载就请求数据
  mounted(){
    this.$store.dispatch('getFloorList')
  }
  //利用计算属性+mapState方法读取数据
  computed:{
    ...mapState({
      floorList : state => state.home.floorList
    })
  },
  ```

### 11. 实现Floor组件(不包含轮播图)

1. 说明：这个任务没有技术含量，就是一个体力活，大家选择性练习。

2. 由于`Floor`组件是`Home`的子组件，`Home`组件中要根据数据决定使用几个`Floor`。

3. `Home`组件读取楼层数据

   ```js
   ...mapState({
     floorList:state => state.home.floorList
   })
   ```

4. 后通过`props`传给`Floor`组件。

   ```vue
   <!-- 楼层 -->
   <Floor v-for="floor in floorList" :key="floor.id" :floor="floor"/>
   ```

5. `Floor`组件接收数据

   ```js
   export default {
     name: 'Floor',
     props:['floor']
   }
   ```

6. 复制`Floor`组件中的图片到：`src/public/images`

7. 数据说明：

   - imgUrl：左侧图片
   - carouselList：轮播数据（暂时不用）
   - keywords：左侧关键词
   - name：楼层名
   - navList：右上角分类
   - recommendList：右侧四个图片
   - bigImg：右侧图片组的大图

   <img src="http://49.232.112.44/images/floor_about.png"/>

### 12. Floor中的轮播图

```vue
<template>
	<div class="floor">
		<div class="py-container">
			<div class="title clearfix">
				<h3 class="fl">{{floor.name}}</h3>
				<div class="fr">
					<ul class="nav-tabs clearfix">
						<li class="active" v-for="(nav,index) in floor.navList" :key="index">
							<a :href="nav.url" data-toggle="tab">{{nav.text}}</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="tab-content">
				<div class="tab-pane">
					<div class="floor-1">
						<div class="blockgary">
							<ul class="jd-list">
								<li v-for="(kw,index) in floor.keywords" :key="index">{{kw}}</li>
							</ul>
							<img :src="floor.imgUrl" />
						</div>
						<div class="floorBanner">
							<!-- 轮播图 -->
							<swiper class="swiper" :options="swiperOption">
								<!-- 每一屏 -->
								<swiper-slide v-for="carouse in floor.carouselList" :key="carouse.id">
									<img :src="carouse.imgUrl" alt="pic">
								</swiper-slide>
								<!-- 小圆点 -->
								<div class="swiper-pagination" slot="pagination"></div>
								<!-- 左按钮 -->
								<div class="swiper-button-prev" slot="button-prev"></div>
								<!-- 右按钮 -->
								<div class="swiper-button-next" slot="button-next"></div>
							</swiper>
						</div>
						<div class="split">
							<span class="floor-x-line"></span>
							<div class="floor-conver-pit">
								<img :src="floor.recommendList[0]" />
							</div>
							<div class="floor-conver-pit">
								<img :src="floor.recommendList[1]" />
							</div>
						</div>
						<div class="split center">
							<img :src="floor.bigImg" />
						</div>
						<div class="split">
							<span class="floor-x-line"></span>
							<div class="floor-conver-pit">
								<img :src="floor.recommendList[2]" />
							</div>
							<div class="floor-conver-pit">
								<img :src="floor.recommendList[3]" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

	export default {
		name: 'Floor',
		components: {Swiper,SwiperSlide},
		props:['floor'],
		data() {
			return {
				swiperOption: {
          slidesPerView: 1, //同时展示几屏
          spaceBetween: 10, //屏与屏的间距
          loop: true, //循环轮播
					speed:1500,//切换速度
					autoplay:{ //自动轮播
						delay: 2000, //每一屏看多久
						disableOnInteraction:false //操作轮播图后是否禁用自动轮播
					},
					//小圆点
          pagination: {
            el: '.swiper-pagination',//指定小圆点呈现位置
            clickable: true //小圆点是否可以点击
          },
					//左箭头、右箭头
          navigation: {
            nextEl: '.swiper-button-next',//指定右箭头呈现位置
            prevEl: '.swiper-button-prev'//指定左箭头呈现位置
          }
        }
			}
		},
	}
</script>
```

## day05

### 1. Search组件静态

1. 复制我们提前准备好的`Search`静态组件到自己的项目当中。
2. `SearchSelector`组件是`Search`组件的一个子组件，父子关系。

<img src="http://49.232.112.44/images/search.png" style="zoom:20%;" /> 

### 2. 准备搜索参数

搜索需要的参数很多，且好多地方都用，所以在`Search`组件的`data`中准备好一个参数对象。 强烈推荐这样做！

```js
data() {	
  return {		
    //搜索参数		
    searchParams:{			
      category1Id:'', //一级分类id(可选参数)		
      category2Id:'', //二级分类id(可选参数)		
      category3Id:'', //三级分类id(可选参数)			
      categoryName:'', //分类名(可选参数)			
      keyword:'', //关键词(可选参数)		
      props:[], //商品属性(可选参数)			
      trademark:'', //品牌(可选参数)				
      order:'', //排序(可选参数)			
      pageNo:1, //当前页码（必选项！！！！）			
      pageSize:10 //每页展示多少条（必选项！！！！）			
    }	
  }
}
```

### 3.  Search组件接收参数

1. 目标：无论是点击**分类**，还是点击**搜索**，`Search`组件都需要接收路由参数。

2. 注意：不能在`mounted`钩子中接收参数，因为初次展示时是组件挂载，以后传参才是组件更新。

3. 正确做法：使用`watch`监听`$route`

   ```js
   watch:{	
     $route:{		
       //立即监视，目的是为了让第一次搜索的时候，可以拿到参数。
       immediate:true,
       //此处的value是谁？ —— 是$route的新值（监视的是谁，handler得到的就是谁的新值）
       handler(value){	
         console.log(value.query)		
       }	
     }
   }
   ```

### 4. Search组件合并参数

- 具体思路：使用`watch`监听`$route`，只要当前路由信息变化，就存储搜索参数。


```js
watch:{
  $route:{
    //追加立即监视，为了初次挂载拿到参数
    immediate:true,
      //为了以后拿到参数
      handler(value){ //注意此处的value是谁？ —— $route的新值（监视的是谁，就是谁新的值）
      	console.log('路由收到参数了：',value.query)
        //重置之前所有收到的路由query参数、并将最新参数合并进去
        Object.assign(this.searchParams,{
          category1Id:'',   //重置一级分类ID
          category2Id:'',   //重置二级分类ID
          category3Id:'',   //重置三级分类ID
          categoryName:'',  //重置分类名称
          keyword:'',				//重置搜索关键字
        },value.query)
     }
  }
}
```

### 5. 发起搜索请求（重要）

1. 去`src/api/index.js`中配置一个请求函数，一定注意要携带参数！！

   ```js
   //请求搜索
   export const reqSearchInfo = (params)=> myAxios.post('/api/list',params)
   ```

2. 去`Search`组件中发个请求试一试

   ```js
   import {reqSearchInfo} from '@/api'

   watch:{
   	$route:{
   		immediate:true,
   		async handler(value){
   			/**********/
   			//发个请求试试
   			const result = await reqSearchInfo(this.searchParams)
   			console.log(result)
   		}
   	}
   }
   ```

### 6. 搜索结果存入vuex

2. 新建 `store/search.js` 编写`vuex`一套流程，注意：`getSearchInfo`要接收到搜索参数。

   ```js
   import {reqSearchInfo} from '@/api'

   const actions = {
   	//专门用于搜索
   	async getSearchInfo({commit},searchParams){
   		let result = await reqSearchInfo(searchParams)
   		if(result.code === 200){
   			commit('SAVE_SEARCH_INFO',result.data)
   		}else{
   			alert(result.message)
   		}
   	}
   }

   const mutations = {
   	SAVE_SEARCH_INFO(state,value){
   		state.searchInfo = value
   	}
   }

   const state = {
   	searchInfo:{} //存储搜索结果
   }

   const getters = {}

   export default {
   	actions,
   	mutations,
   	state,
   	getters
   }
   ```

3. 在 `store/index.js`中引入并配置 `search.js`  

   ```js
   //......
   import search from './search'
   //......
   export default new Vuex.Store({	
     modules:{		
       home,		
       user,		
       search	
     },	
     //......
   })
   ```

4. 去Search组件中，在`watch`的`handler`中，最后把请求发出去。

   ```js
   watch:{
     $route:{
       immediate:true,
        	/************/
         // 重置完毕，收集完毕，合并完毕 参数后，带着参数发请求 ==========>追加这一句
         this.$store.dispatch('getSearchInfo',this.searchParams)
       }
     }
   }
   ```

5. 通过开发者工具，去看看`vuex`中是否有了搜索的数据。

### 7. Search组件展示数据

1. 展示商品列表，先不实现：面包屑、搜索选择器  这些功能。

2. `goodsList`是商品列表，使用`mapState`读取`goodsList`。

   ```js
   computed: {
     ...mapState({
       goodsList:state => state.search.searchInfo.goodsList
     })
   }
   ```

3. 使用`v-for`根据`goodsList`遍历生成商品列表。

   ```vue
   <!-- 遍历生成多个商品 -->
   <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
     <div class="list-wrap">
       <div class="p-img">
         <a href="item.html" target="_blank">
           <!-- 商品图片 -->
           <img :src="good.defaultImg" />
         </a>
       </div>
       <div class="price">
         <strong>
           <em>¥</em>
           <!-- 商品价格 -->
           <i>{{good.price}}</i>
         </strong>
       </div>
       <div class="attr">
         <!-- 商品名称 -->
         <a target="_blank" href="item.html" v-html="good.title"/>
       </div>
       <div class="operate">
         <a 
            href="success-cart.html" 
            target="_blank" 
            class="sui-btn btn-bordered btn-danger"
         >
           加入购物车
         </a>
         <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
       </div>
     </div>
   </li>
   ```

### 8. SearchSelector展示数据

1. `SearchSelector`读取Vuex中数据

   ```js
   computed: {
     ...mapState({
       trademarkList:state => state.search.searchInfo.trademarkList,
       attrsList:state => state.search.searchInfo.attrsList,
     })
   }
   ```

2. 使用`v-for`根据`trademarkList`、`attrsList`遍历生成：品牌列表、属性列表；（注意：数据的层次、名字）具体代码如下：

   ```vue
   <!-- 品牌列表区 -->
   <ul class="logo-list">
     <!-- 遍历生成品牌列表 -->
     <li v-for="trademark in trademarkList" :key="trademark.tmId">
       {{trademark.tmName}}
     </li>
   </ul>

   <!-- -------- -->

   <!-- 商品属性区 -->
   <!-- 遍历生成每个属性对应的div -->
   <div class="type-wrap" v-for="attrs in attrsList" :key="attrs.attrId">
     <!-- 属性名（颜色、重量、屏幕尺寸....） -->
     <div class="fl key">{{attrs.attrName}}</div>
     <div class="fl value">
       <ul class="type-list">
         <!-- 遍历属性值（黄色、绿色、橙色、200g、215g、6.5寸、7.0寸） -->
         <li v-for="(attrValue,index) in attrs.attrValueList" :key="index">
           <a>{{attrValue}}</a>
         </li>
       </ul>
     </div>
     <div class="fl ext"></div>
   </div>
   ```

### 9. 面包屑_展示分类名

1. 从`searchParams`中得到`categoryName`，展示到页面。

2. 使用`v-show`做判断： `v-show="searchParams.categoryName"` ，代码如下

   ```vue
   <!-- 面包屑_分类名 -->
   <li class="with-x" v-show="searchParams.categoryName">	
     {{searchParams.categoryName}}	
     <i>×</i>
   </li>
   ```


### 10. 面包屑_移除分类名

面包屑中移除分类名：

备注：这种写法依赖着之前 `watch`中对 `$route` 的监视 

```js
//移出分类名
methods: {
  removeCategoryName(){
    /* 
		分析：
			第一件事：路径得改，去掉分类名(categoryName)、分类编号(category?Id)。
			第二件事：将searchParams里的category?Id、categoryName置为空。
			第三件事：重新搜索。
			备注：关键词不要动，只是去除：分类名、分类编号。
		*/
    //尝试获取关键词
    const {keyword} = this.$route.query
    //重新跳转路由
    this.$router.push({
      path:'/search',
      query:{keyword}
    })
  }
}
```

## day06

### 1.  面包屑_展示关键词

1. 从路由`searchParams`中得到`keyword`，展示到页面上。

   ```vue
   <!-- 面包屑_关键词 -->
   <li class="with-x" v-show="searchParams.keyword">	
     {{searchParams.keyword}}	
     <i>×</i>
   </li>
   ```

2. 一个小优化，展示搜索列表时，为了实现高亮效果，使用`v-html`来呈现商品名称。

### 2. 面包屑_移除关键词

1. 在`Search`组件中添加`removeKeyword`

   ```js
   //移出关键词
   removeKeyword(){	
     //获取之前所有的路由参数	
     let {query} = this.$route	
     //去除关键词的同时，并携带所有之前的分类参数（category?Id,categoryName）跳转路由
     this.$router.push({
       path:'/search',		
       query:{
         ...query,			
         keyword:undefined
       }
     })
   }
   ```

   > 严重注意：路由的query对象、params对象是只读的，不可修改，改了底层也不认。
   >
   > 如果确实想修改，那么可以克隆一份再去修改。
   >
   > 第一种方法：
   >
   > <img src="http://http://49.232.112.44//images/query1.png" style="zoom:50%;" /> 
   >
   > 第二种方法：
   >
   > <img src="http://http://49.232.112.44//images/query2.png" style="zoom:50%;" /> 

### 3. 完善几个小细节

1. 删除关键词后，最好清空搜索框（用全局事件总线去做）
2. 点击主页的logo，最好清空搜索框。
3. 点击分类，隐藏导航窗。

- 安装全局事件总线，编辑`src/main.js`

  ```js
  new Vue({	
    //************
    beforeCreate(){ 		
      Vue.prototype.$bus = this 
      //安装全局事件总线	
    },	
    //************
  })
  ```

- `Header`组件中，给`$bus`绑定事件

  ```js
  mounted() {	
    //Header组件一挂载就给$bus绑定了一个clear-keyword事件，用于清空关键词	
    this.$bus.$on('clear-keyword',()=>{		
      this.keyword = ''
    })
  },
  beforeDestroy(){
  	//Header组件将要销毁前，解绑$bus上的clear-keyword	
  	this.$bus.$off('clear-keyword')
  }
  ```

- 在`Search`中`removeKeyword`方法最后补一句话：

  ```js
  //移出关键词
  removeKeyword(){	
    /************/ 
    //清空搜索框里的关键词    
    this.$bus.$emit('clear-keyword')
  }
  ```

### 4. 面包屑_Search接收品牌

1. `SearchSelector`组件把用户点击的【品牌】，传给`Search`组件。

   > 典型的 **子 ==> 父**，建议用自定义事件去做

2. `Search`组件中代码：

   ```vue
   <template> 
   	<!------------>
   		<!--给子组件SearchSelector绑定事件，用于获取点击的品牌信息-->
       <SearchSelector @get-trademark="saveTrademark"/>
     <!------------>
   </template>

   <script>    
     methods: {        
       /************/ 
       //用于接收子组件（SearchSelector）传递过来的品牌数据
       saveTrademark(trademark){
         console.log('我是Search组件，收到了儿子给我的品牌：',trademark)
       },
       /************/
     }
   </script>
   ```

3. `SearchSelector`组件代码：

   ```vue
   <template>  
     <!--***********--> 
     <!-- 给每个品牌绑定点击事件-->
     <li 
        v-for="trademark in trademarkList" 
        :key="trademark.tmId"
        @click="sendTrademark(trademark)"
     >
       {{trademark.tmName}}
     </li>
     <!--***********--> 
   </template>

   <script>    
     /************/
     methods: {               
       //点击品牌的回调
       sendTrademark(trademark){
         this.$emit('get-trademark',trademark)
       }
     },    
    /************/
   </script>
   ```

### 5. 面包屑_Search展示品牌

1. `SearchSelector`组件把用户点击的【品牌】，传给`Search`组件。

   > 思路：`Search`组件收到数据后将【品牌】维护到`data`中的`searchParams.trademark`中去，随后发请求即可，但要注意：`searchParams.trademark`中所要数据的格式为：`ID:品牌名称`

2. `Search`组件中代码：

   ```vue
   <template>  
     <!--展示品牌面包屑-->
   		<li class="with-x" v-show="searchParams.trademark">
       	{{searchParams.trademark.split(':')[1]}}
       	<i>×</i>
       </li>
   		<!--给子组件SearchSelector绑定事件，用于获取点击的品牌信息-->
       <SearchSelector @get-trademark="saveTrademark"/>
     <!------------>
   </template>

   <script>    
     methods: {        
       /************/ 
       //用于接收子组件（SearchSelector）传递过来的品牌数据
       saveTrademark(trademark){
         console.log('我是Search组件',trademark)
         //将收到的品牌数据，存入searchParams.trademark中
         this.searchParams.trademark = trademark.tmId + ':' + trademark.tmName
         //重新搜索
         this.$store.dispatch('getSearchInfo',this.searchParams)
       },
       /************/
     }
   </script>
   ```


### 6. 面包屑_Search移除品牌

在`Search`组件中

```vue
<template>
  <!-- 品牌面包屑 -->
	<li class="with-x" v-show="searchParams.trademark">
    {{searchParams.trademark.split(':')[1]}}
    <i @click="removeTrademark">×</i>
   </li>
	<!--***********--> 
</template>
<script>
  export default {
    methods: {
      /************/
      //移除品牌
      removeTrademark() {
        //移除参数
				this.searchParams.trademark = ''
				//重新搜索
				this.$store.dispatch('getSearchInfo',this.searchParams)
      },
      /************/
    },
  };
</script>
```

### 7. 面包屑_Search接收属性

1. `SearchSelector`组件把用户点击的【属性】，传给`Search`组件，使用自定义事件去做。

2. `Search`组件中：

   ```vue
   <template>
   	<!-- ------- -->
   	<SearchSelector 
         @get-trademark="saveTrademark"
         @get-attr="saveAttr"
      />
   	<!-- ------- -->
   </template>

   <script>
     export default {
       methods: {
         // 用于接收子组件（SearchSelector）传递过来的商品属性数据
   			saveAttr(attrs,attrValue){
   				console.log('我是Search组件，收到了属性信息',attrs,attrValue)
   			}
       },
     };
   </script>
   ```

3. `SearchSelector`组件中：

   ```vue
   <template>
    	<!-- 给每个属性值绑定点击事件 -->
   	<li v-for="(attrValue,index) in attrs.attrValueList" :key="index">
     	<a @click="handleClickAttrValue(attrs,attrValue)">
         {{attrValue}}
     	</a>
     </li>
   </template>

   <script>
     export default {
       methods: {
         //点击商品属性的回调
   			handleClickAttrValue(attrs,attrValue){
   				// console.log('你点击的属性是：',attrs,attrValue)
   				this.$emit('get-attr',attrs,attrValue)
   			}
       },
     };
   </script>
   ```

### 8. 面包屑_Search展示属性

1. `Search`组件收到【属性】后，维护到`searchParams.props`数组中去，随后发请求即可。

   > 注意点1：`searchParams.props`中所要数据的格式为：`属性ID:属性值:属性名`。
   >
   > 注意点2：`searchParams.props`中的数据不能重复。

2. `Search`组件中：

   ```vue
   <template>
   	<!-- ********* -->
   	<!-- 属性面包屑 -->
   	<li class="with-x" v-for="(p,index) in searchParams.props" :key="index">
       {{p.split(':')[2] +':' + p.split(':')[1]}}
       <i>×</i>
     </li>
   	<SearchSelector 
         @get-trademark="saveTrademark"
         @get-attr="saveAttr"
      />
   	<!-- ********* -->
   </template>

   <script>
     export default {
       methods: {
         // 用于接收子组件（SearchSelector）传递过来的商品属性数据
   			saveAttr(attrs,attrValue){
   				// 将收到的属性信息，整理好
   				const str = attrs.attrId + ':' + attrValue + ':' + attrs.attrName
   				// 存入searchParams.props中
           this.searchParams.props.push(str)
           // 发请求
           this.$store.dispatch('getSearchInfo',this.searchParams)
   			}
       },
     };
   </script>
   ```

### 9. 属性面包屑不能重复添加

```js
saveAttr(attrs,attrValue){
  //拼接成一个合法的参数
  const str = attrs.attrId + ':' + attrValue + ':' + attrs.attrName
  //判断属性是否重复
  const result = this.searchParams.props.includes(str)
  if(!result){
    //将拼接出来的属性信息，放入searchParams中
    this.searchParams.props.push(str)
    //发请求
    this.$store.dispatch('getSearchInfo',this.searchParams)
  }
}
```

### 10. methods优化属性名展示

```vue
<template>
	<li class="with-x" v-for="(p,index) in searchParams.props" :key="index">
    {{attrShowName(p)}}
    <i>×</i>
  </li>
</template>

<script>
  methods: {
    //专门用于格式化每个商品属性的方法
    attrShowName(p){
      return p.split(':')[2] +':' + p.split(':')[1]
    }
  },
</script>
```

### 11. 面包屑_Search移除属性

在`Search`组件中

```vue
<template>
	<!-- ********* -->
	<!-- 属性面包屑 -->
	<li class="with-x" v-for="(p,index) in searchParams.props" :key="index">
    {{attrShowName(p)}}
    <i @click="removeProp(index)">×</i>
  </li>
  <!--***********--> 
</template>

<script>
  export default {
    methods: {
      /**************/
			//移出属性的回调
			removeProp(index){
				// 移出了searchParams.props中的指定值
				this.searchParams.props.splice(index,1)
				// 重新搜索
				this.$store.dispatch('getSearchInfo',this.searchParams)
			}
    },
  };
</script>
```

### 12. 一个小优化

- `this.$store.dispatch('getSearchInfo',this.searchParams)`要经常执行，且`searchParams`一变化就要执行。

- 具体操作：

  1. 去Search组件中，删掉每个方法里的`this.$store.dispatch('getSearchInfo',this.searchParams)`。
  2. 在`watch`中监视`searchParams`，回调中进行`dispatch`。

- 代码如下：

  ```vue
  <script>
    watch:{
      //监视searchParams，只要searchParams变化，直接拿着它发请求。
      searchParams:{
        deep:true,
          handler(){
          //拿着searchParams，发请求获搜索数据，并存入vuex
          this.$store.dispatch('getSearchInfo',this.searchParams)
        }
      }
    }
  </script>
  ```

### 13. 对分页器的理解（分页器都重要）

1. 为什么要用？—— 大量数据不能一次全部展示。
2. 分页器想工作，需要哪些数据？
   - **<font color="red">总数（total）</font>**
   - **<font color="red">页大小（pageSize）</font>**通俗理解：每页展示几条。
   - **<font color="red">页码（pageNo）</font>**通俗理解：看第几页。
   - **<font color="red">连续页数（continues）</font>**一般为奇数，例如：3、5、7 等，为什么？—— 好看，通常是5。
   - **<font color="green">总页数（totalPage）</font>** =  `total/pageSize`（注意要向上取整）

> 备注：红色是必须传项，绿色的不用传，可以根据红色算出来。

### 14. 分页器_静态组件

1. 不用静态页面中的分页器结构，因为不够精简。

   创建：`src\components\Pagination\index.vue`，内容如下：

   ```vue
   <template>  
   	<div class="pagination">
       <button>上一页</button>
       <button>1</button>
       <span>···</span>
       
       <button>6</button>
       <button>7</button>
       <button class="active">8</button>    
       <button>9</button>
       <button>10</button>
       
       <span>···</span>
       <button>21</button>
       <button>下一页</button>
       
       <span>共 103 条</span>
     </div>
   </template>

   <script>    
     export default {      
       name: "Pagination",    
     };
   </script>

   <style lang="less" scoped>
     .pagination {
       text-align: center;

       button {
         margin: 0 5px;
         background-color: #f4f4f5;
         color: gray;
         outline: none;
         border-radius: 2px;
         padding: 0 4px;
         vertical-align: top;
         display: inline-block;
         font-size: 13px;
         min-width: 35.5px;
         height: 28px;
         line-height: 28px;
         cursor: pointer;
         box-sizing: border-box;
         text-align: center;
         border: 0;

         &[disabled] {
           color: #c0c4cc;
           cursor: not-allowed;
         }

         &.active {
           cursor: not-allowed;
           background-color: #c81623;
           color: #fff;
         }
       }

       span {
         display: inline-block;
         line-height: 28px;
         font-size: 14px;
         color: gray;
         vertical-align: middle;
       }
     }
   </style>
   ```

2. 记得去`main.js`中引入并注册`Pagination`组件。

   ```js
   import Pagination from './components/Pagination'
   //全局注册Pagination组件
   Vue.component('Pagination',Pagination)
   ```

3. 去`Search`组件指定位置，直接编写组件标签`<Pagination/>`。

### 15. 分页器_算总页数

1. `Search`组件中传递一些模拟数据：

   ```html
   <!-- 分页器 -->
   <Pagination :total="103" :pageSize="5" :pageNo="16" :continues="5"/>
   ```

2. `Pagination`组件中：

   ```vue
   <template>  
   	<div class="pagination">
       <button>上一页</button>
       <button>1</button>
       <span>···</span>
       
       <button>6</button>
       <button>7</button>
       <button class="active">8</button>    
       <button>9</button>
       <button>10</button>
       
       <span>···</span>
       <button>{{totalPage}}</button>
       <button>下一页</button>
       
       <span>共 {{total}} 条</span>
     </div>
   </template>

   <script>    
     export default {      
       name: "Pagination",
   		props:['total','pageSize','pageNo','continues'],
   		computed: {
   			totalPage(){
   				return Math.ceil(this.total / this.pageSize)
   			}
   		}
     };
   </script>
   ```

### 16. 分页器_ 算连续页数_标准情况

- 根据当前页码进行：左推、右推，算出连续页的起始、结束。

  <img src="http://http://49.232.112.44//images/1.png" style="zoom:50%;" /> 

```js
export default {      
  name: "Pagination",
  props:['total','pageSize','pageNo','continues'],
  computed: {
    //算总页数
    totalPage(){
      return Math.ceil(this.total / this.pageSize)
    },
    //算连续页的【起始页】、【结束页】
    startEnd(){
      //获取分页器的各种参数
      const {total,pageSize,pageNo,continues} = this
      let start = 0 //连续页的起始位置
      let end = 0  //连续页的结束位置

      //各种计算
      start = pageNo - (continues-1)/2
      end = pageNo + (continues-1)/2

      return {start,end}
    }
  }
};
```

### 17. 分页器_ 算连续页数_特殊情况一 

- 连续页数`continues > totalPage`

  <img src="http://http://49.232.112.44//images/2.png" style="zoom: 33%;" /> 

- 具体编码：

  ```js
  export default {      
    name: "Pagination",
    props:['total','pageSize','pageNo','continues'],
    computed: {
      //算总页数
      totalPage(){
        return Math.ceil(this.total / this.pageSize)
      },
      //算连续页的【起始页】、【结束页】
      startEnd(){
        //获取分页器的各种参数
        const {total,pageSize,pageNo,continues,totalPage} = this
        let start = 0 //连续页的起始位置
        let end = 0  //连续页的结束位置

        if(continues > totalPage){
          console.log('你太变态了，要的连续页数，比我倾家荡产的总页数都多')
          start = 1
          end = totalPage
        }else{
          //各种计算
          start = pageNo - (continues-1)/2
          end = pageNo + (continues-1)/2
        }

        return {start,end}
      }
    }
  };
  ```

### 18. 分页器_ 算连续页数_特殊情况二

- 算连续页`start`的时候，往左推，推多了，出现 `start < 1 ` 了。

  <img src="http://http://49.232.112.44//images/3.png" style="zoom:33%;" /> 

- 处理方式如下：

  ```js
    export default {      
      name: "Pagination",
  		props:['total','pageSize','pageNo','continues'],
  		computed: {
  			//算总页数
  			totalPage(){
  				return Math.ceil(this.total / this.pageSize)
  			},
  			//算连续页的【起始页】、【结束页】
  			startEnd(){
  				//获取分页器的各种参数
  				const {total,pageSize,pageNo,continues,totalPage} = this
  				let start = 0 //连续页的起始位置
  				let end = 0  //连续页的结束位置

  				if(continues > totalPage){
  					console.log('你太变态了，要的连续页数，比我倾家荡产的总页数都多')
  					start = 1
  					end = totalPage
  				}else{
  					//各种计算
  					start = pageNo - (continues-1)/2
  					end = pageNo + (continues-1)/2
  					//判断左边是否“冒”了
  					if(start < 1){
  						start = 1
  						end = continues
  					}
  				}
  				return {start,end}
  			}
  		}
    };
  ```

### 19. 分页器_ 算连续页数_特殊情况三

- 往右推，算结束页码的时候，推多了，出现`end < totalPage `了。

  <img src="http://http://49.232.112.44//images/4.png" style="zoom:30%;" /> 

- 处理方式如下：

  ```js
    export default {      
      name: "Pagination",
  		props:['total','pageSize','pageNo','continues'],
  		computed: {
  			//算总页数
  			totalPage(){
  				return Math.ceil(this.total / this.pageSize)
  			},
  			//算连续页的【起始页】、【结束页】
  			startEnd(){
  				//获取分页器的各种参数
  				const {total,pageSize,pageNo,continues,totalPage} = this
  				let start = 0 //连续页的起始位置
  				let end = 0  //连续页的结束位置

  				if(continues > totalPage){
  					console.log('你太变态了，要的连续页数，比我倾家荡产的总页数都多')
  					start = 1
  					end = totalPage
  				}else{
  					//各种计算
  					start = pageNo - (continues-1)/2
  					end = pageNo + (continues-1)/2
  					//判断左边是否“冒”了
  					if(start < 1){
  						start = 1
  						end = continues
  					}
  					//判断右边是否“冒”了
  					if(end > totalPage){
  						start = totalPage - continues + 1
  						end = totalPage
  					}
  				}
  				return {start,end}
  			}
  		}
    };
  ```

## day07

### 1. 分页器 _ 生成连续页

1. 此处要注意：`v-for`的优先级比`v-if`高

2. 具体编码：

   ```vue
   <!-- 第一种方法(存在问题，v-for的优先级比v-if高) -->
   <!-- v-for和v-if混在了一起，极其不推荐，效率低，v-for的优先级比v-if高，会做很多“无用功” --> 
   <button 
      v-for="(number,index) in startEnd.end" 
      :key="index" 
      v-if="number > 13"
   >
     {{number}}
   </button> 

   <!-- 第二种方法 -->
   <button 
      v-for="(number,index) in (startEnd.end - startEnd.start + 1)" 
      :key="index" 
      :class="{active: (index + startEnd.start) === pageNo }"
   >
     {{index + startEnd.start}}
   </button>
   		
   <!-- 第三种方法 -->
   <button 
   	v-for="(number,index) in (startEnd.end - startEnd.start + 1)" 
   	:key="index"
   	:class="{active: (number + startEnd.start - 1) === pageNo }"
   >
     {{number + startEnd.start - 1}}
   </button> 
   ```

### 2. 分页器_整体显示

- 分页器整体的显示，逻辑如下：

  - 当前已经是第一页了，那么【上一页】就不能点了。
  - 当前已经是最后一页了，那么【下一页】就不能点了。
  - 两个数中间，有其他数，再出现三个点。

  ```vue
  	<div class="pagination">
  		<button :disabled="pageNo === 1">上一页</button>
  		<button v-show="startEnd.start !== 1">1</button>
  		<span v-show="startEnd.start > 2">···</span> 
      
  		<!-- 连续页区域 -->
      <button 
  			v-for="(number,index) in (startEnd.end - startEnd.start + 1)" 
  			:key="index" 
  			:class="{active: (index + startEnd.start) === pageNo }"
  		>
  			{{index + startEnd.start}}
  		</button>
  	
  		<span v-show="startEnd.end < totalPage - 1">···</span>
  		<button v-show="startEnd.end !== totalPage">{{totalPage}}</button>
  		<button :disabled="pageNo === totalPage">下一页</button>
  		<span>共 {{total}} 条</span> 
    </div>
  ```

### 3.分页器_整体交互

- 第一步：对接真实数据，在`Search`组件从`vuex`中获取服务器返回的`total`，传递给`Pagination`组件。

  1. 去Search组件中读取toal。

     ```js
     computed:{
       //读取Vuex中的total
       ...mapState({
         goodsList:state => state.search.searchInfo.goodsList,
         total:state => state.search.searchInfo.total
       })
     },
     ```

  2. 传递给`Pagination`组件，此处注意：`pageSize`、`pageNo`不用从vuex中获取，因为这两个数据本身就是我们指定的

     ```vue
     <!-- 分页器 -->
     <Pagination 
     	:total="total" 
     	:pageNo="searchParams.pageNo" 
     	:pageSize="searchParams.pageSize" 
     	:continues="5"
     />
     ```

- 第二步：传递页码，`Pagination`组件将用户点击的页码传给`Search`组件，`Search`组件接收参数，随后重新请求数据。

  1. `Saecrh`组件中：

     ```vue
     <template>	
       <!-- 分页器 -->    
       <Pagination         
         :total="total" 
     		:pageSize="searchParams.pageSize" 
     		:pageNo="searchParams.pageNo" 
     		:continues="5"
     		:changePageNo="changePageNo" 
       />
     </template>

     <script>	
       //......    
       methods:{        
         //用于接收分页器传递过来的页码(pageNo)       
         changePageNo(n){            
           //更新参数            
           this.searchParams.pageNo = n
         }    
       }    
       //......
     </script>
     ```

  2. `Pagination`组件中：

     ```vue
     <template>	
     	<div class="pagination">
         <!-- 此处给所有能点击的东西绑定上click事件，事件的回调为sendPageNo -->
         <button @click="changePageNo(????)">????</button>
       </div>
     </<template>

     <script>   
       export default {        
         name: "Pagination",        
         props:['total','pageNo','pageSize','continues','changePageNo'],        
       }; 
     </script>
     ```

### 4. 分页器_处理bug+优化

- 优化1：搜索商品时，商品分类、品牌、属性、关键词若变化，`pageNo`应该重置为1，因为这些动作会引起列表数量的变化。

  ```js
  methods: {
  	//移出分类名面包屑的回调
  	removeCategoryName() {
  		//******
  		this.searchParams.pageNo = 1
  	},
  	//移出关键词面包屑的回调
  	removeKeyword() {
  		//******
  		this.searchParams.pageNo = 1
  	},
  	//得到子组件（SearchSelector）传递过来的品牌信息
  	saveTrademark(trademark) {
  		//******
  		this.searchParams.pageNo = 1
  	},
  	//移出品牌面包屑的回调
  	removeTrademark() {
  		//******
  		this.searchParams.pageNo = 1
  	},
  	//得到子组件（SearchSelector）传递过来的属性信息
  	saveAttr(attributeStr) {
  		//******
  		this.searchParams.pageNo = 1
  	},
  	//点击移出属性的回调
  	removeAttr(index) {
  		//******
  		this.searchParams.pageNo = 1
  	},
  	//******
  }
    
  watch: {
  	//......
    $route:{
      immediate:true,
      async handler(value){
        //重置并合并参数
        Object.assign(this.searchParams,{
          category1Id:'',//一级分类ID
          category2Id:'',//二级分类ID
          category3Id:'',//三级分类ID
          categoryName:'',//分类名称
          pageNo:1,//================================>追加这句
          keyword:'',//搜索关键字
        },value.query)
        //携带searchParams去联系对应的服务员
        this.$store.dispatch('getSearchInfo',this.searchParams)
      }
    }
  }
  ```

- 优化2：搜索没有结果时，展示一个好看的图片

  ```vue
  <!-- 搜索器 -->
  <SearchSelector v-show="total" ****** />

  <!--商品展示区-->
  <div class="details clearfix" v-if="total">
  </div>

  <!-- 数据为空的展示 -->
  <div v-show="!total" class="empty">
    <img src="https://static.360buyimg.com/devfe/error-new/1.0.0/css/i/error_06.png" alt="">
    <h1>抱歉，搜索结果为空！</h1>
  </div>
  ```

### 5. 商品排序_引入阿里图标

1. 在`publicl/index.html`中引入阿里图标样式：

   ```html
   <link rel="stylesheet" href="//at.alicdn.com/t/font_2747192_5zyzzzfhjrp.css">
   ```

2. 去`Search`组件中，测试一下：

   ```html
   <li>
     <a href="#">
       价格<span class="iconfont icon-down"></span>
     </a>
   </li>
   ```

3. 微调一下样式，给`.sui-nav`下的`li`下的`a`加一个：`display: flex`

### 6. 商品排序_初始化显示

1. 明确要做的是两种排序：综合排序、价格排序。

2. 依赖的是数据中的 `order` 属性，属性值格式为 `1:desc` 。

   - `1` 是综合排序， `2` 是价格排序。
   - `asc` 是升序（箭头往上指）， `desc` 是降序（箭头往下指）。

3. 编写思路：

   1. 谁有红色背景？—— 看 `order` 的第1位。
   2. 谁有箭头？——  看 `order` 的第1位。
   3. 箭头是上还是下？ —— 看 `order` 的第2位。

4. 核心代码：

   ```vue
   <template>
     <ul class="sui-nav">
       <li :class="{active:orderType == 1}">
         <a>
           综合<span v-show="orderType == 1" class="iconfont" :class="iconName"></span>
         </a>
       </li>
       <li :class="{active:orderType == 2}">
         <a>
           价格<span v-show="orderType == 2" class="iconfont" :class="iconName"></span>
         </a>
       </li>
     </ul>
   </template>

   <script>
     computed: {
   		/***********/
       //计算排序类型
       orderType(){
         return this.searchParams.order.split(':')[0]
       },
       //计算图标名字
       iconName(){
         return this.searchParams.order.split(':')[1] === 'desc' ? 'icon-down' :'icon-up'
       }
     } 
   </script>
   ```

### 7. 商品排序_完成交互

1. 思路：

   - 当前是【综合】排序，再点【综合】，去切换：升序、降序即可。
   - 当前是【综合】排序，点击【价格】，价格高亮且变为降序。

2. 核心代码：

   ```vue
   <template>
     <ul class="sui-nav">
       <li :class="{active:orderType == 1}" @click="changeOrder(1)">
         <a>
           综合<span v-show="orderType == 1" class="iconfont" :class="iconName"></span>
         </a>
       </li>
       <li :class="{active:orderType == 2}" @click="changeOrder(2)">
         <a>
           价格<span v-show="orderType == 2" class="iconfont" :class="iconName"></span>
         </a>
       </li>
     </ul>
   </template>

   <script>
     methods:{
       /*********/
       //修改排序方式按钮（综合、价格）的回调
   			changeOrder(type){ //type用于标识，点击的排序类型（综合？价格？）
   				// 获取目前的排序类型（综合？价格？）、排序标识（升序？降序？）
   				const [currentType,currentFlag] = this.searchParams.order.split(':')
   				//判断一下，用户所点击的排序类型，是新的，还是原来的。
   				if(type === currentType*1){
   					// 你点的排序类型（综合？价格？）和当前的，是一致的，切换箭头指向就行
   					let flag = currentFlag === 'asc' ? 'desc' : 'asc'
   					this.searchParams.order = currentType + ':' + flag
   				}else{
   					// 你点的排序类型和当前的，不一致，把order的第1位变为你点击的，第2位写死，就是desc
   					this.searchParams.order = type + ':desc'
   				}
   				//页码归位
   				this.searchParams.pageNo = 1
   			}
     }
   </script>
   ```

### 8. 详情组件_静态

1. 编写 `Detail` 组件静态组件，直接复制即可；

2. 配置路由规则（需要传递商品`id`到该组件，使用`parmas`参数接收id）；

   ```js
   {
       path:'/detail/:id',  //注意此处使用id占位
       component:Detail
   }
   ```

3. 把 `src/router/index.js`中的路由规则抽离出来，形成一个配置文件 `src/router/routes.js`  ;

4. 去 `Search`组件中找到商品列表，给每一个商品加跳转（点击图片跳转、点击文字也跳转）；

   ```vue
   <router-link :to="'/detail/'+goods.id">
       <img :src="goods.defaultImg" />
   </router-link>

   <div class="attr">
       <router-link :to="'/detail/'+goods.id" v-html="goods.title"/>
   </div>
   ```

## day08

### 1. 详情组件_滚动条（重要）

- 跳转 `Detail`组件时会出现一个滚动条问题，使用路由配置项： `scrollBehavior`解决 ；

- 最终目标：正常跳转路由时，滚动条直接最顶端；前进后退时，保留滚动条的位置；

  ```js
  export default new VueRouter({
    //......
    scrollBehavior (to, from, savedPosition) {
      if(savedPosition){
        //只有进行前进后退时savedPosition才有值,正常跳转，值为null
        return savedPosition
      }else{
        return {x:0,y:0}
      }
    }
  })
  /*	
  	scrollBehavior函数：每次路由跳转时都会执行
  	to:要跳到哪个路由
  	from:来自于哪个路由
  	savedPosition:跳转前滚动条的位置
  */
  ```

### 2. 详情组件_获取数据

1. 在`src/api/index.js`中编写求函数：`reqGoodsInfo`，用于获取商品详情；

   ```js
   //此函数专门用于请求商品详情
   export const reqGoodsInfo = (id) => myAxios.get('/api/item/'+id)
   ```

2. `Detail`组件一挂载就获取详情数据，且将请求回来的详细信息存入data中，供模板使用。

   ```js
   import {reqGoodsInfo} from '@/api'

   export default {
     name: 'Detail',
       components: {ImageList,Zoom},
   		methods:{
   			async getGoodsInfo(){
   				// 获取当前商品的id
   				const {id} = this.$route.params
   				let result = await reqGoodsInfo(id)
   				console.log(result)
   			}
   		},
   		mounted(){
   			this.getGoodsInfo()
   		}
   }
   ```

### 3. 商品详情_展示数据

1. 数据说明：

   <img src="http://http://49.232.112.44//images/detail.png" style="border:1px solid black" /> 

2. 将获取到的商品详情存储到data中

   ```js
   data() {
     return {
       info:{
         categoryView:{},//图片上方分类信息
         skuInfo:{},//商品详细信息（名称、描述等等）
         spuSaleAttrList:[]//属性列表（颜色、尺寸、版本等）
       }
     }
   },
     methods:{
       // 获取商品详情
       async getGoodsInfo(){
         // 获取商品的id
         const {id} = this.$route.params
         // 发请求获取详情
         let result = await reqGoodsInfo(id)
         // 根据code判断数据是否获取成功
         if(result.code === 200){
           this.info = result.data
         }else{
           alert(result.message)
         }
       }
     }
   ```

3. 删掉不用的结构：

   ```css
   <span>降价通知</span>
   <div class="remark">*****</div>
   <div class="priceArea2">*****</div>
   <div class="support">****</div>
   <div class="product-detail">****</div>
   ```

4. 展示：左上角分类条

   ```vue
   <!-- 导航路径区域 -->
   <div class="conPoin">
     <span v-for="n in 3" :key="n">
       {{info.categoryView[`category${n}Name`]}}
     </span>
   </div>
   ```

5. 展示：名称、价格

   ```html
   <div class="goodsDetail">
   	<!-- 商品名称 -->  
     <h3 class="InfoName">{{info.skuInfo.skuName}}</h3>
     <!-- 商品描述 -->
     <p class="news">{{info.skuInfo.skuDesc}}</p>
     <div class="priceArea">
       <div class="priceArea1">
         <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
         <div class="price">
           <i>¥</i>
           <!-- 商品价格 -->
           <em>{{info.price}}</em>
         </div>
       </div>
     </div>
   </div>
   ```

6. 展示：商品属性（此处需要双层`v-for`）

   ```html
   <dl v-for="s1 in info.spuSaleAttrList" :key="s1.id">
     <dt class="title">选择{{s1.saleAttrName}}</dt>
     <dd 
        changepirce="0" 
        :class="{active:s2.isChecked == 1 }" 
        v-for="s2 in  s1.spuSaleAttrValueList"
        :key="s2.id"
     >
       {{s2.saleAttrValueName}}
     </dd>
   </dl>
   ```

### 4. 商品详情 _ 放大镜（重要）

1. 清空`<div class="spec-preview"></div>`中的内容，因为我们要用第三方库去写。

2. 去`Detail`组件中，给`Zoom`传递图片`url`

   ```vue
   <Zoom :imgurl="info.skuInfo.skuDefaultImg"/>
   ```

3. 去Zoom组件中，收取imgurl

   ```js
   props:['imgurl']
   ```

4. 安装库：`npm i vue-photo-zoom-pro`，随后去Zoom组件中：


```vue
<template>
  <div class="spec-preview">
    <vue-photo-zoom-pro 
			:high-url="imgUrl"
			:out-zoomer="true"
			:width="200"
			:height="200"
		>
			<img :src="imgUrl"/>
		</vue-photo-zoom-pro>
  </div>
</template>

<script>
	import vuePhotoZoomPro from 'vue-photo-zoom-pro'
	import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'
  
  export default {
    name: "Zoom",
		components: {vuePhotoZoomPro},
		props:['imgUrl']
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;
		img{
			width: 100%;
			height: 100%;
		}
		.zoomer{
			z-index: 9;
		}
		.selector{
			background-color: rgba(255, 0, 0, 0.327);
		}
  }
</style>
```

### 5.props与data的优先级（重要）

1. `props`的优先级比`data`高。
2. `data`的优先级比其他配置项高。

### 6. 商品详情 _ 处理放大镜bug

1. bug描述：鼠标快速滑过时，不能隐藏预览区。

2. 解决办法：安装另一个版本`npm i vue-photo-zoom-pro@2.2.1`。

3. 样式也要做一下微调：

   ```css
   .zoomer{
     z-index: 5;
     top: 0 !important;
     left: 10px !important;
   }
   ```

### 7. 商品详情_商品图片组

1. `Detail`组件给`ImageList`传递图片数组

   ```html
   <!-- 小图列表 -->
   <ImageList :imgList="info.skuInfo.skuImageList"/>
   ```

2. `ImageList` 组件中接收数据。

   ```js
   export default {
     name: "ImageList",
     props:['imgList']
   }
   ```

3. 去 `ImageList` 中展示轮播图片

   ```vue
   <template>
     <swiper class="swiper" :options="swiperOption">
   		<!-- 每一屏 -->
   		<swiper-slide v-for="image in imageList" :key="image.id">
   			<img :src="image.imgUrl" alt="slide">
   		</swiper-slide>
   		<!-- 左按钮 -->
   		<div class="swiper-button-prev" slot="button-prev"></div>
   		<!-- 右按钮 -->
   		<div class="swiper-button-next" slot="button-next"></div>
   	</swiper>
   </template>

   <script>
   	import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
     import 'swiper/css/swiper.css'
     export default {
       name: "ImageList",
   		props:['imageList'],
   		components:{Swiper, SwiperSlide},
   		data() {
   			return {
   				swiperOption: {
             slidesPerView: 'auto', //同时展示几屏
             spaceBetween: 10, //屏与屏的间距
   					//左箭头、右箭头
             navigation: {
               nextEl: '.swiper-button-next',//指定右箭头呈现位置
               prevEl: '.swiper-button-prev'//指定左箭头呈现位置
             }
           }
   			}
   		},
     }
   </script>
   ```

### 8. 商品详情_切换商品属性

1. 样式做了一下微调:给`dd` 加`cursor: pointer;`

2. 点击属性的交互，思路：排他

3. 具体编码：

   ```vue
   <template>    
   <dd 
       changepirce="0" 
       :class="{active:s2.isChecked == 1}" 
       v-for="s2 in s1.spuSaleAttrValueList"
       :key="s2.id"
       @click="changeAttr(s1.spuSaleAttrValueList,s2.id)"
   >
     {{s2.saleAttrValueName}}
   </dd>
   </template>

   <script>    
       methods: {        
           // 点击商品属性的回调
           changeAttr(list,id){
             // 1.拿内存容量举例子，那么就是：取消所有内存选项的高亮，让当前的高亮（排他）
             list.forEach(item => {
               if(item.id === id) item.isChecked = '1'
               else item.isChecked = '0'
             });
             // 3.发请求，重新获取最新的详情数据（无法实现，因服务器缺少接口）
           } 
       }
   </script>
   ```


### 9. 商品详情_图片组切换

- 需求：在`ImageList`组件中点击图片，让放大镜区域呈现该图片。

- 思路：`ImageList`组件使用`$bus`传递点击图片的`url`给放大镜组件。

- 具体编码：

  - `ImageList`组件中：

    ```vue
    <img :src="img.imgUrl" @click="getImgUrl(image.imgUrl)">

    ```
    <script>
      methods: {
      getImgUrl(url){
          this.$bus.$emit('get-imgurl',url)
        }
      },
    </script>
    ```

    ```

  - `Zoom`组件中

    ```vue
    <div class="spec-preview">
      <vue-photo-zoom-pro 
          :url="givenImgurl || imgurl" 
          :high-url="givenImgurl || imgurl"
       		:width="200"
    			:height="200"
    			:out-zoomer="true"
      />
    </div>

    <script>
    	//....
      export default {
        //...
    		data() {
    			return {
    				givenImgurl:''
    			}
    		},
    		mounted() {
    			//给总线绑定事件，用于接收新的图片地址
    			this.$bus.$on('get-imgurl',(value)=>{
    				console.log('我是Zoom，我收到了一个新的图片地址',value)
    				this.givenImgurl = value
    			})
    		},
    		beforeDestroy() {
    			//解绑总线上的事件
    			this.$bus.$off('get-imgurl')
    		},
      }
    </script>
    ```

### 10. 限制购买数量_思路+正则

1. 规则：

   - 必须是正整数，最小是`1`，最大是`200`.
   - 若输入小于`1`，则重置为`1`。
   - 若输入大于`200`，则重置为`200`。
   - 若输入的是其他值，则重置为`1`。

2. 创建：`src\utils\reg.js`文件，内容如下：

   ```js
   export const goodsNumReg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
   ```


### 11. 限制购买数量_输入限制（重要）

完成`changeGoodsNum`逻辑

```js
//修改商品购买数量的回调
changeGoodsNum(e){
	//获取用户的输入
  const {value} = e.target
  //进行一些判断
  const result = goodsNumReg.test(value)
  console.log(result)
  if(result){
    console.log('你输入的很合法，是1-200的')
    this.goodsNum = value*1
  }else if(value > 200){
    console.log('你输入的不合法，但可以原谅，您输入的超出了200，我帮您重置为200')
    this.goodsNum = e.target.value = 200
  }else{
    console.log('你输入的太变态了，打你一巴掌，置为1')
    this.goodsNum = e.target.value = 1
  }
}
```

### 12. 商品详情_最终的限制

- 在刚才的基础之上做一个完善，响应：加、减按钮。

- 思路：无论是加、减、还是直接输入，都是修改数量，都使用`changeGoodsNum`去处理。

  ```vue
  <input class="itxt" :value="goodNum"@change="changeGoodsNum('input',$event)">
  <a href="javascript:" class="plus" @click="changeGoodsNum('increment')">+</a>
  <a href="javascript:" class="mins" @click="changeGoodsNum('decrement')">-</a>

  <script>
    changeGoodsNum(type,e){
      if(type === 'input'){
        //获取用户的输入
        const {value} = e.target
        //进行一些判断
        const result = goodsNumReg.test(value)
        console.log(result)
        if(result){
          console.log('你输入的很合法，是1-200的')
          this.goodsNum = value*1
        }else if(value > 200){
          console.log('你输入的不合法，但可以原谅，您输入的超出了200，我帮您重置为200')
          this.goodsNum = e.target.value = 200
        }else{
          console.log('你输入的太变态了，打你一巴掌，置为1')
          this.goodsNum = e.target.value = 1
        }
      }else if(type === 'increment'){
        if (this.goodsNum === 200) alert('最大购买数量为200')
        else this.goodsNum += 1
      }else if(type === 'decrement'){
        if (this.goodsNum === 1) alert('最小购买数量为1')
        else this.goodsNum -= 1
      }
    }  
  </script>
  ```

## day09

### 1. 加入购物车_发送请求

1. 去`src\api\index.js`配置一个请求函数

   ```js
   //请求添加商品到购物车
   export const reqAddGood2Cart = (id,num)=> myAxios.post(`/api/cart/addToCart/${id}/${num}`)
   ```

2. 去`src\pages\Detail\index.vue`中发送请求

   ```js
   methods:{
     async handleAddCart(){
       //获取商品id
       const {id} = this.$route.params
       //发送请求添加购物车
       const result = await reqAddGood2Cart(id,this.goodsNum)
       if(result.code === 200){
         console.log('添加成功')
       }else{
         alert(result.message)
       }
     }
   }
   ```

### 2. 加入购物车_收集属性

添加购物车成功界面，要展示商品信息，所以需要提前收集好当前商品信息。

给`handleAddCart`方法追加逻辑

```js
// 添加购物车按钮的回调
async handleAddCart(){
	//获取商品的id，获取数量
	const {id} = this.$route.params
	const {goodsNum} = this
  //发送请求添加商品到购物车
	const result =  await reqAddGoods2Cart(id,goodsNum)
  //判断是否添加成功
	if(result.code === 200){
		console.log('成功了',result)
		//获取商品的：名称、单价、购买数量、属性
		const {skuName,skuDefaultImg} = this.info.skuInfo
		const {price} = this.info
		//提前准备好一个数组，用于存储用户选择的具体属性信息
		const arr = []
		//遍历所有商品属性信息，收集到用户所选择的
		this.info.spuSaleAttrList.forEach((s1)=>{
			const result = s1.spuSaleAttrValueList.find(s2 => s2.isChecked == 1)
			arr.push(result.saleAttrName + '：' + result.saleAttrValueName)
		})
		//把所有收集到的信息，整理成一个对象
		const goodsInfo = {skuName,price,goodsNum,arr,skuDefaultImg}
		console.log(goodsInfo)
	}else{
		alert(result)
	}
}
```

### 3. AddCartSuccess 静态+展示信息

1. 直接复制我们写好的组件即可。

2. 修改一下类名，展示字体图标

   ```html
   <h3>    
     <span class="iconfont icon-success"></span>    
     商品已成功加入购物车！
   </h3>
   ```

3. 去`src/router/route.js`中配置规则

   ```js
   import AddCartSuccess from '@/pages/AddCartSuccess'
   /**********/
   {
     path:'/addcart_success',    
     component:AddCartSuccess
   }
   ```

4. 修改`Detail`组件中`handleAddCart`的添加成功后跳转到`AddCartSuccess`

   ```js
   //添加购物车按钮的回调
   async handleAddCart(){
     /***********/
     if(result.code === 200){
       /***********/
       /***********/
       /***********/
       this.$router.push('/addcart_success')
     }else{
       alert(result.message)
     }
   }
   ```

5. 修改`Detail`组件中添加成功后跳转到`addcart_success`的逻辑。

   > 1. Vue中路由参数的值不能为对象！！
   > 2. 如果路由之间传递的参数**过多、过长**，可以用`sessionStorage`进行中转。

   ```js
   methods:{ 
     async addSku2ShopCart(){    
       /***************/
       //判断业务逻辑是否成功
       if(result.code === 200){
         /***************/
         //第一步：将selectedGoodInfo存入sessionStorage
         sessionStorage.setItem('goodsInfo',JSON.stringify(goodsInfo))
         //第二步：跳转到/addcart_success，同时携带要呈现的信息（goodsInfo对象）
         this.$router.push('/addcart_success')
       }else{      
         /***************/
       } 
     }
   }
   ```

6. `AddCartSuccess`组件展示信息。

   ```vue
   <div class="cart-complete-wrap">
     <div class="cart-complete">
       <h3><i class="iconfont icon-success"></i>商品已成功加入购物车！</h3>
       <div class="goods">
         <div class="left-good">
           <div class="left-pic">
             <img :src="goodsInfo.skuDefaultImg">
           </div>
           <div class="right-info">
             <p class="title">{{goodsInfo.skuName}}</p>
             <p class="attr" v-for="(item,index) in goodsInfo.arr" :key="index">
               {{item}}
             </p>
             <p class="attr">数量：{{goodsInfo.goodsNum}}</p>
             <p class="attr">单价：￥{{goodsInfo.price}}</p>
           </div>
         </div>
         <div class="right-gocart">
           <a href="javascript:" class="sui-btn btn-xlarge">查看商品详情</a>
           <a href="javascript:" >去购物车结算 > </a>
         </div>
       </div>
     </div>
   </div>
   ```

### 4.  购物车_静态

1. 复制购物车静态组件到项目中。

2. 为了编写方便，购物车统称为`Cart`，把组件名都改为`Cart`。

3. 配置路由

   ```js
   import Cart  from '@/pages/cart'
   //......
   {
     path:'/cart',
     component:Cart
   }
   ```

4. 实现`Header`组件中【我的购物车】按钮，点击跳转：`/cart`

   ```vue
   <router-link to="/cart">我的购物车</router-link>
   ```

5. 实现`AddCartSuccess`组件中【去购物车】按钮，点击跳转`/cart`

   ```vue
   <router-link to="/cart" >去购物车结算 </router-link>

   <a href="javascript:" class="sui-btn btn-xlarge" @click="backDetail">查看商品详情</a>
   ```


   <script>
     methods: {
       backDetail(){
         this.$router.back()
       }
     },
   </script>
   ```

### 5. 购物车_获取数据

1. 编写接口请求函数，`src/api/index.js`

   ```js
   //请求购物车数据
   export const reqCartList = () => myAxios.get('/api/cart/cartList')
   ```

2. `ShopCart`组件一挂载就请求购物车数据

   ```js
   import {reqCartList}  from '@/api'
   /*************/

   export default {
     name: 'Cart',
     methods: {
       //专门用于获取购物车列表
       async getCarList(){
         //发请求获取购物车列表
         const result = await reqCartList()
         console.log(result)
       }
     },
     mounted() {
       //调用getShopCarList获取购物车列表
       this.getCarList()
     },
   }
   //......
   ```

3. <strong style="color:red">遗憾的是：数据并未得到！</strong>

   - 为什么？—— 服务器不知道你是谁。

### 6. 购物车_理解临时标识（重要）

明确几个点：

- 每个用户都有自己的购物车，不可能大家共用一个。

- 如何区分不同的用户？

  > 办法一：登录系统 （最正式的做法）
  >
  > 办法二：使用临时标识（随机生成的UUID，不能真正下单，只是为了临时支撑购物车）。

- 为什么有的网站，不登录也有购物车？

  > 尽可能引导用户消费。

- 为什么有的网站，必须登录才有购物车？

  > 用户量大，且网站业务逻辑复杂，登录以后有些逻辑好处理。

### 7. 购物车_实现临时标识

1. 使用`uuidjs`生成，安装uuid：`npm i uuid`。

2. 为确保生成的`userTempId`不丢失，需要存到`localStorage`中。

3. `/src/utils/auth.js`中创建一个`getUserTempId`的方法，用于提供`userTempId`。

   整体思路为：

   - 如果`localStorage`中有，就返回。
   - 没有就生成一个，随后存到`localStorage`中，再返回。

   ```js
   /**
    * 该函数专门给外部提供一个用户临时标识
    */
   import { v4 as uuidv4 } from 'uuid';

   export function getUserTempId() {
   	//尝试从localStorage中读取userTempId
   	const userTempId = localStorage.getItem('userTempId')
   	//判断userTempId是否存在
   	if(userTempId){
   		//若存在，return出去，给别人用
   		return userTempId
   	}else{
       //什么时候会来到这里？—— 用户第一次使用系统、或用户清空了浏览器缓存。
   		//生成一个新的临时标识
   		const newUserTempId = uuidv4()
   		//存local中一份
   		localStorage.setItem('userTempId',newUserTempId)
   		//return 出去
   		return newUserTempId
   	}
   }
   ```

4. 编辑`/src/api/mockAxios.js`，在`axios`请求拦截器中，让所有请求头，都携带`userTempId`。

   ```js
   import {getUserTempId} from '@/utils/auth'

   //请求拦截器
   myAxios.interceptors.request.use((config)=>{
   	//进度条走起
   	nprogress.start()
   	//向请求头中添加userTempId
   	config.headers.userTempId = getUserTempId()
   	//返回本次请求的配置信息
   	return config
   })
   ```

### 8.  购物车_商品列表

1. `Cart`组件一挂载就请求购物车数据，随后数据存入`data`

   ```js
   import {reqCartList}  from '@/api'

   export default {
     name: 'Cart',
     data() {
       return {
         cartInfoList:[]
       }
     },
     methods: {
       //专门用于获取购物车列表
       async getCartList(){
         //发请求
         const result = await reqCartList()
         if(result.code === 200){
           this.cartInfoList = result.data[0].cartInfoList
         }else{
           alert(result.message)
         }
       }
     },
     mounted() {
       //调用getCarList获取购物车列表
       this.getCarList()
     },
   }
   ```

2. 遍历数据生成购物车列表

   ```vue
   <!-- 购物车中的每个商品 -->
   <ul class="cart-list" v-for="cartInfo in cartInfoList" :key="cartInfo.id">
     <li class="cart-list-con1">
       <!-- 商品前的勾选框 -->
       <input type="checkbox" name="chk_list" v-model="cartInfo.isChecked">
     </li>
     <li class="cart-list-con2">
       <!-- 商品图片 -->
       <img :src="cartInfo.imgUrl">
       <!-- 商品名称 -->
       <div class="item-msg">{{cartInfo.skuName}}</div>
     </li>
     <li class="cart-list-con4">
       <!-- 商品单价 -->
       <span class="price">￥{{cartInfo.skuPrice}}</span>
     </li>
     <li class="cart-list-con5">
       <a href="javascript:void(0)" class="mins">-</a>
       <!-- 商品数量 -->
       <input autocomplete="off" type="text" :value="cartInfo.skuNum" minnum="1" class="itxt">
       <a href="javascript:void(0)" class="plus">+</a>
     </li>
     <li class="cart-list-con6">
        <!-- 小计 -->
       <span class="sum">￥ {{cartInfo.skuNum * cartInfo.skuPrice}}</span>
     </li>
     <li class="cart-list-con7">
       <a href="#none" class="sindelet">删除</a>
       <br>
     </li>
   </ul>
   ```

### 9. 购物车_单选

1. 明确：购物车中任何的交互（勾选、全选、删除等等），都要联系服务器。

2. 对于我们的服务器，所有购物车相关的api返回数据中的`data`都是`null`。

3. 编写接口请求函数，操作文件：`/src/api/index.js`，具体代码：

   ```js
   // 该函数专门用于：切换购物车中商品的选中状态
   export const reqCheckOneCart = (id,isChecked) => myAxios.get(`/api/cart/checkCart/${id}/${isChecked}`)
   ```

4. `ShopCart`组件具体代码：

   ```vue
   <template>
     <!-- 勾选框 -->
   <li class="cart-list-con1">
     <input 
       type="checkbox" 
       name="chk_list" 
       注意下面不再使用v-model了，因为v-model收集的是布尔值，我们要的是1或0。
       :checked="cartInfo.isChecked"
       @click="handleCheckOne(cartInfo)"
      >
     </li>
     </li>
   </template>

   <script>   
     import {reqCartList,reqCheckOneCart} from '@/api'
     //......
     methods: {        
       //勾选某个商品的回调
       async handleCheckOne(cartInfo){
         //获取商品的编号、当前的勾选状态
         const {skuId,isChecked} = cartInfo
         //定义一个新的勾选状态
         const newChecked = (isChecked === 1) ? 0 : 1
         //发请求去勾选
         const result = await reqCheckOneCart(skuId,newChecked)
         //判断业务逻辑是否成功
         if(result.code === 200){
           //业务逻辑成功了，随后维护本地数据
           cartInfo.isChecked = newChecked
         }else{
           //业务逻辑失败了，提示失败原因
           alert(result.message)
         }
       }
     }
   </script>
   ```

### 10. 购物车_全选

1. 编写计算属性，控制全选框默认是否勾选

   ```vue
   <template>
       <div class="select-all">
           <input 
   					class="chooseAll" 
   					type="checkbox" 
   					:checked="isAll"
   				>
           <span>全选</span>
         </div>
   </template>

   <script>
     //......
     computed: {
       // 用户标识是否全选
       isAll(){
         // 所有商品的isChecked都为1的时，isAll为true，否则false
         return this.cartInfoList.every( cartInfo => cartInfo.isChecked === 1)
       }
     },
     //......
   </script>
   ```

2. 编写接口请求函数，操作文件：`/src/api/index.js`，具体代码：

   ```js
   // 该函数专门用于：全选购物车
   export const reqCheckAllCart = (idList,isChecked) => myAxios.post(`/api/cart/batchCheckCart/${isChecked}`,idList)
   ```

3. `ShopCart`组件具体代码：

   ```vue
   <template>
       <!--全选-->
       <input 
   			class="chooseAll" 
   			type="checkbox" 
   			:checked="isAll" 
   			@click="handleCheckAll"
       >
   </template>

   <script>
     methods: {
       async handleCheckAll(e){
         //获取全选值（布尔值）
         let {checked} = e.target
         //全选值映射为1或0
         checked = checked ? 1 : 0
         //获取购物车中所有商品skuId组成的数组
         const skuIdList = []
         //遍历所有购物车中的商品，收集好skuId
         this.cartInfoList.forEach( cartInfo => skuIdList.push(cartInfo.skuId))
         //发请求
         const result = await reqBatchCheckCart(skuIdList,checked)
         if(result.code === 200){
           //维护本地数据
           this.cartInfoList.forEach( cartInfo => {
             cartInfo.isChecked = checked
           })
         }else{
           alert(result.message)
         }
       }
     }
   </script>
   ```

## day10

### 1. 购物车_总数与总金额

使用计算属性去计算总数、总金额

```vue
<span>{{total}}</span>件商品</div>
<i class="summoney">{{totalPrice}}</i>

<script>
  computed:{
    /************/
    total(){
      let n = 0 //初识化一个值，用于累加总数
      this.cartInfoList.forEach( cartInfo => {
        if(cartInfo.isChecked){
          n += cartInfo.skuNum
        }
      })
      return n
    },
    //总金额
    totalPrice(){
      let n = 0 //初识化一个值，用于累加总金额
      this.cartInfoList.forEach( cartInfo => {
        if(cartInfo.isChecked){
          n += cartInfo.skuNum * cartInfo.cartPrice
        }
      })
      return n
    }
  },
</script>
```

### 2.  购物车_删除单个

1. 编写接口请求函数

   ```js
   // 该函数专门用于：删除购物车中的某个商品
   export const reqDeleteOneCart = (id) => myAxios.delete(`/api/cart/deleteCart/${id}`)
   ```

2. 组件具体编码

   ```vue
   <li class="cart-list-con7">
     <a class="sindelet" @click="handleDeleteOne(cartInfo.skuId)">删除</a>
     <br>
   </li>

   <script>
     methods:{    
       // 删除某个商品的回调
       async handleDeleteOne(id){
         // 如果用户确定删除
         if(confirm('确定删除吗？')){
           // 发请求去删除
           const result = await reqDeleteOneCart(id)
           // 判断删除是否成功？
           if(result.code === 200){
             //若成功，维护本地数据
             let index = this.cartInfoList.findIndex(cartInfo => cartInfo.skuId === id)
             this.cartInfoList.splice(index,1)
           }else{
             //若失败，提示原因
             alert(result.message)
           }
         }
       }
     }
   </script>
   ```

### 3. 购物车_批量删除

1. 编写接口请求函数

   ```js
   // 该函数专门用于：批量删除购物车中的商品
   export const reqBatchDeleteCart = (idList) => myAxios.post('/api/cart/batchDeleteCart',idList)
   ```

2. 组件具体编码

   ```js
   // 删除选中的商品回调
   async handleDeleteCheck(){
     if(confirm('确定删除已选择的吗？')){
       // 准备好一个数组，用于收集商品skuId
       const idList = []
       // 遍历收集商品skuId
       this.cartInfoList.forEach( cartInfo => {
         if(cartInfo.isChecked) {
           idList.push(cartInfo.skuId)
         } 
       })
       // 联系服务器
       let result = await reqBatchDeleteCart(idList)
       // 判断业务逻辑是成功
       if(result.code === 200){
         // 若服务器端删除成功，则维护本地数据
         // 留下所有isChecked为0的，简言之：没勾的都留下，勾了的都不要   
         this.cartInfoList = this.cartInfoList.filter( 
           cartInfo => !idList.includes(cartInfo.skuId)
         )
       }else{
         // 若服务器端删除失败，则提示原因
         alert(result.message)
       }
     }
   }
   ```

### 4. 购物车_数据为空的处理

```vue
<div class="cart-tool" v-show="cartInfoList.length">
<div class="empty" v-show="!cartInfoList.length">
  <h2>购物车空空如也</h2>
  <img src="http://49.232.112.44/img/empty.751bed26.gif" alt="">
</div>
  
<script>
  methods:{
    async getCartList(){
      // 发请求获取购物车数据
      let result = await reqCartList()
      if(result.code === 200){
        // 如果购物车中有数据，在存储
        if(result.data[0]){ // ===============================>  追加了这一句
          this.cartInfoList = result.data[0].cartInfoList
        }
      }else{
        alert(result.message)
      }
    },
  }
</script>
  
<style>
  .empty{
    padding: 20px;
    text-align: center;
    h2{
      color: gray;
    }
    img{
      width: 300px;
    }
  }
</style>
```

### 5. 购物车_限制购买数量 _合法的输入

- 注意点：携带给服务器的数量是**差值**，不是用户输入的值！！

  > 服务器认为：正数加，负数减。
  >
  > 举例1：原来是`8`，用户输入`10`，带给服务器的是：`2`
  >
  > 举例2：原来是`8`，用户输入`3`，带给服务器的是：`-5`
  >
  > 用户输入的值，坚决不能是负数，但携带给服务器的：可以是正数，也可以是负数。

```vue
<template>
		<input 
       autocomplete="off" 
       type="text" 
       minnum="1" 
       class="itxt"
       :value="cartInfo.skuNum"
       @change="handleChangeSkuNum(cartInfo,$event)"
    >
</template>

<script>
  import {reqAddGoods2Cart} from '@/api'
	import {goodsNumReg} from '@/utils/reg'
  
  //修改商品数量的回调
  async handleChangeSkuNum(cartInfo,e){
    //获取当前操作商品的：skuId（编号）、skuNum（数量）
    const {skuId,skuNum} = cartInfo
    //获取用户的输入
    const {value} = e.target
    //校验输入
    if(goodsNumReg.test(value)){
      //若校验成功,计算差值
      const disNum = value - skuNum
      // 发请求
      const result = await reqAddGoods2Cart(skuId,disNum)
      if(result.code === 200){
        // 维护本地数据
        cartInfo.skuNum = value*1
      }else{
        alert(result.message)
        e.target.value = skuNum
      }
    }
  }
</script>
```

### 6. 购物车_限制购买数量 _非法的输入

给刚才的`if`追加一个`else if`和`else`逻辑

```js
async handleChangeSkuNum(cartInfo,e){
  //获取当前操作商品的：skuId（编号）、skuNum（数量）
  const {skuId,skuNum} = cartInfo
  //获取用户的输入
  const {value} = e.target
  //校验输入
  if(goodsNumReg.test(value)){
   /****************/
  }
  //用户输入的太多了
  else if(value > 200){
    //计算差值（假设用户输入的是345，但我们不能用345-skuNum，要用200-skuNum）
    const disNum = 200 - skuNum
    //发请求联系服务器
    const result = await reqAddGood2Cart(skuId,disNum)
    //判断业务逻辑是否成功
    if(result.code === 200){
      //若成功，更新本地数据
      cartInfo.skuNum = 200
    }else{
      //若失败，提示原因
      alert(result.message)
      // 输入框变为原来的值
      e.target.value = skuNum
    }
  }
  //用户输入的很不合法（@、-9、12.8 等等）
  else{
    //“一巴掌”打回之前的值
    e.target.value = skuNum
  }
}
```

### 7.购物车_ 完善逻辑

1. 无论当前商品是否勾选，只要修改了数量，就重新勾上（电商固有的逻辑）。

2. 处理多次输入超过`200`的值，页面残留的问题。


具体操作：优化`handleChangeSkuNum`方法，追加一些代码，具体如下：

```js
async handleChangeSkuNum(cartInfo,e){
	//获取当前操作商品的：skuId（编号）、skuNum（数量）
	const {skuId,skuNum} = cartInfo
	//获取用户的输入
	const {value} = e.target
	//校验输入
	if(goodsNumReg.test(value)){
		console.log('您输入的是合法值，是1-200的')
		//若校验成功,计算差值
		const disNum = value - skuNum
		//发请求
		const result = await reqAddGoods2Cart(skuId,disNum)
		if(result.code === 200){
			//维护本地数据
			cartInfo.skuNum = value*1
			cartInfo.isChecked = 1 //===========>【追加了这句，只要修改数量就勾上】
		}else{
			//提示失败的原因
			alert(result.message)
			//重置页面的DOM，避免残留数据
			e.target.value = skuNum
		}
	}else if(value > 200){
		console.log('您输入的不合法，但可以原谅')
		//1.计算差值
		const disNum = 200 - skuNum
		//2.发请求
		const result = await reqAddGoods2Cart(skuId,disNum)
		//判断业务逻辑是否成功
		if(result.code === 200){
			//修改商品数量为最大值200
			cartInfo.skuNum = e.target.value = 200 //=======>【追加了这句，避免残留】
			cartInfo.isChecked = 1 //=========>【追加了这句，只要修改数量就勾上】
		}else{
			//提示修改失败的原因
			alert(result.message)
			//手动操作DOM避免残留问题
			e.target.value = skuNum
		}
	}else{
		console.log('您输入的不合法，且不可原谅！')
		//重置DOM防止残留数据
		e.target.value = skuNum
	}
}
```

### 8.购物车_点按钮修改数量

实现点击加号、减号，也完成修改数量，最后修改数量的最终代码如下：

```vue
<a class="mins" @click="handleChangeSkuNum('decrement',cartInfo)">-</a>
<input 
	autocomplete="off" 
	type="text" 
	minnum="1" 
	class="itxt"
	:value="cartInfo.skuNum"
	@change="handleChangeSkuNum('input',cartInfo,$event)"
>
<a class="plus" @click="handleChangeSkuNum('increment',cartInfo)">+</a>


<script>
//修改商品数量的回调
async handleChangeSkuNum(type,cartInfo,e){
	switch (type) {
		case 'increment':
			if(cartInfo.skuNum === 200){
				alert('最大购买数量为200')
			}else{
				// 发请求去加一个
				const result = await reqAddGoods2Cart(cartInfo.skuId,1)
				if(result.code === 200){
					//维护本地数据
					cartInfo.skuNum += 1
					cartInfo.isChecked = 1
				}else{
					alert(result.message)
				}
			}
			break;
		case 'decrement':
			if(cartInfo.skuNum === 1){
				alert('最小购买数量为1')
			}else{
				// 发请求去加一个
				const result = await reqAddGoods2Cart(cartInfo.skuId,-1)
				if(result.code === 200){
					//维护本地数据
					cartInfo.skuNum -= 1
					cartInfo.isChecked = 1
				}else{
					alert(result.message)
				}
			}
			break;
		case 'input':
			//获取当前操作商品的：skuId（编号）、skuNum（数量）
			const {skuId,skuNum} = cartInfo
			//获取用户的输入
			const {value} = e.target
			//校验输入
			if(goodsNumReg.test(value)){
				console.log('您输入的是合法值，是1-200的')
				//若校验成功,计算差值
				const disNum = value - skuNum
				//发请求
				const result = await reqAddGoods2Cart(skuId,disNum)
				if(result.code === 200){
					//维护本地数据
					cartInfo.skuNum = value*1
					cartInfo.isChecked = 1
				}else{
					//提示失败的原因
					alert(result.message)
					//重置页面的DOM，避免残留数据
					e.target.value = skuNum
				}
			}else if(value > 200){
				console.log('您输入的不合法，但可以原谅')
				//1.计算差值
				const disNum = 200 - skuNum
				//2.发请求
				const result = await reqAddGoods2Cart(skuId,disNum)
				//判断业务逻辑是否成功
				if(result.code === 200){
					//修改商品数量为最大值200
					cartInfo.skuNum = e.target.value = 200
					cartInfo.isChecked = 1
				}else{
					//提示修改失败的原因
					alert(result.message)
					//手动操作DOM避免残留问题
					e.target.value = skuNum
				}
			}else{
				console.log('您输入的不合法，且不可原谅！')
				//重置DOM防止残留数据
				e.target.value = skuNum
			}
			break;
	}
}
</script>
```

### 9. 函数防抖、函数节流（重要）

#### 1.函数防抖

1. 概念：事件被触发后，等`n`秒后再执行逻辑，若这`n`秒内事件又被触发，则重新计时`n`秒，之前的逻辑不执行。

2. 通俗理解：要做的事，总是改来改去，那么就等你下发指令后n秒，我再做，免得你再改。

3. 生活中的例子：调节空调温度时，按下【+】或【-】，等1秒空调才有反应。

   > 最简洁的记法：就要最后那一下。

4. 最具代表性的应用场景：实时搜索，例子如下：

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="UTF-8" />
       <title>1.函数防抖</title>
       <script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
     </head>
     <body>
       <input type="text" placeholder="请输入关键词" id="input">

       <script type="text/javascript" >
         // 获取到元素
         const input = document.getElementById('input')

         // 程序员靠定时器去实现防抖，不太好（麻烦）
         /* let timeID
   			input.onkeyup = (event)=>{
   				if(timeID) clearTimeout(timeID)
   				// 获取用户输入
   				const {value} = event.target
   				timeID = setTimeout(()=>{
   					// 模拟发送一个请求
   					console.log('发请求',value)
   				},200)
   			} */

         // 程序员靠lodash去实现防抖，好（简单）
         input.onkeyup = _.debounce((event)=>{
           const {value} = event.target
           console.log('发请求',value)
         },500)

       </script>

     </body>
   </html>
   ```

#### 2.函数节流

1. 概念：在`n`秒内，无论触发事件多少次，逻辑只执行一次。

2. 通俗理解：你催的再急，也没用，我的速度是有极限的。

3. 生活中的例子：

   - 就算火车要开了，我`3`秒内也只能吃一口面。
   - 玩游戏时候的技能冷却时间。

   > 通俗理解：别催，催也没有用，我就是这个速度。

4. 关于lodash节流的配置

   <img src="http://http://49.232.112.44//images/debounce.png" style="zoom:50%;" />

   ```html
   <!DOCTYPE html>
   <html>
   	<head>
   		<meta charset="UTF-8" />
   		<title>2.函数节流</title>
   		<script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
   	</head>
   	<body>
   		<button id="btn">立即购买</button>

   		<script type="text/javascript" >
   			const btn = document.getElementById('btn')

   			let timeID //存储定时器的id
   			let canExecute = true //用于标识是否可以执行逻辑

   			/* 靠程序员，用定时器去实现节流，不推荐 */
   			/* btn.onclick = ()=>{
   				if(canExecute){
   					canExecute = false
   					console.log('发起网络请求~~')
   					setTimeout(()=>canExecute = true,2000)
   				}
   			} */

   			btn.onclick = _.throttle(()=>{
   				console.log('发起网络请求~~')
   			},2000,{trailing:false})
   		</script>
   	</body>
   </html>
   ```

## day11

### 1. 处理购物车数量修改的bug

1. 两种解决方案：

   - 第一种：使用节流解决，但由于我们的服务器端没有做校验，所以时间不好控制。

     > 若服务器端做了校验，那其实我们就做个节流，别频繁点击就ok了。

   - 第二种：使用标识锁定逻辑，比较完美。

2. 备注：

   > 1. 服务器如果做了校验，那么理论上前端可以什么校验都不加。
   >
   > 2. 服务器如果做了校验，我们再做一个节流，那么可以缓解一下服务器的压力。
   >
   > 3. 服务器如果没有做校验，我们靠节流，可能依然会出问题，因为时间不好控制。
   >
   > 4. 服务器如果没有做校验，我们靠标识去解决，那就完美了。
   >
   > 工作中：服务器一般不会出现严重的bug，所以我们用节流，去缓解一下服务器压力，就好。

3. 代码如下：

   ```js
   //方案一：使用节流解决
   import {throttle} from 'lodash'
   /*************/
   handleChangeSkuNum:throttle(async function (type,cartInfo,e){
   	/***********/
   },500,{trailing:false})
   ```


   //方案二：使用标识解决
   async handleChangeSkuNum(type,cartInfo,e){
     if(this.isLock) return
     switch (type) {
       case 'increment':
         this.isLock = true
         /*************/
         break;
       case 'decrement':
         this.isLock = true
         /*************/
         break;
       case 'input':
         this.isLock = true
         /*************/
         break;
     }
     this.isLock = false
   }
   ```

### 2. element-ui_基本使用

1. 第一步：安装，命令为 `npm i element-ui`

2. 第二步：去`main.js`中，引入并应用`elementui`插件，代码如下：

   ```js
   import ElementUI from 'element-ui';
   import 'element-ui/lib/theme-chalk/index.css';
   Vue.use(ElementUI);
   ```

3. 第三步：去任意一个组件中，去编写几个element-ui提供的按钮。

   ```vue
   <template>
   	<div>
   		<button>点我</button>
   		<el-button>默认按钮</el-button>
   		<el-button type="primary" size="mini">主要按钮</el-button>
   		<el-button type="success">成功按钮</el-button>
   		<el-button type="info">信息按钮</el-button>
   		<el-button type="warning">警告按钮</el-button>
   		<el-button type="danger">危险按钮</el-button>
   		<i class="el-icon-edit"></i>
   	</div>
   </template>

   <script>
   	export default {
   		name:'App'
   	}
   </script>
   ```

### 3. element-ui_按需引入（重要）

1. 第一步：安装一个包，`npm install babel-plugin-component -D`

2. 第二步：修改`babel.config.js`内容如下：

   ```js
   module.exports = {
     presets: [
       '@vue/cli-plugin-babel/preset'
     ],
     plugins: [
       [
         "component",
         {
           "libraryName": "element-ui",
           "styleLibraryName": "theme-chalk"
         }
       ]
     ]
   }
   ```

3. 第三步：去main.js中引入并注册，你想用的组件  或   使用插件

   ```js
   import {Button} from 'element-ui';

   // 第一种方式：全局注册按钮组件
   // Vue.component(Button.name, Button);

   // 第二种方式：使用Button插件
   Vue.use(Button)
   ```

4. 第四步：随便在任何一个组件里，去使用上一步注册的组件即可

### 4. element-ui_提示类组件（重要）

- 在`main.js`中引入所有提示相关组件，并放在Vue原型上。

  ```js
  import {Loading, MessageBox, Message,Notification} from 'element-ui';

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;
  ```

- 所有用到提示的地方，直接复制官网上的代码即可，例如：

  ```js
  this.$message.info('一些消息');
  this.$message.success('一些成功消息');
  this.$message.warning('一些警告消息');
  this.$message.error('一些错误消息');
  ```

### 5. 注册组件_静态+收集数据

1. 直接复制注册静态组件。（注意：未校验表单）

2. `Register`组件，先收集表单数据，不做数据校验。

   ```vue
   <template>	
       <!-- -->	
       <input v-model="phone" type="text" placeholder="请输入你的手机号">	
       <!-- -->	
       <input v-model="code" type="text" placeholder="请输入验证码">	
       <!-- -->	
       <input v-model="password" type="text" placeholder="请输入你的登录密码">	
       <!-- -->	
       <input v-model="re_password" type="text" placeholder="请输入确认密码">	
       <!-- -->	
       <input v-model="agree" name="m1" type="checkbox">    
   <template>
       
   <script>    
     data() {        
       return {           
         phone:'', //手机号
         code:'', //验证码
         password:'', //密码
         re_password:'', //重复密码
         agree:false  //是否同意协议
       }    
     },    
   </script>
   ```

### 6. 注册组件_获取验证码

1. 编写API请求函数，根据手机号，获取验证。

   ```js
   //此函数专门用于根据手机号获取验证码
   export const reqGetCode = (phone) => myAxios.get(`/api/user/passport/sendCode/${phone}`)
   ```

2. 明确：验证码不会发到手机上，我们收到以后，自动填写到表单里。

   ```vue
   <template>	
     <!-- -->	
     <button class="getcode" @click="handleGetCode">获取验证码</button>
     <!-- -->	
   </template>

   <script>
     import {reqGetCode} from '@/api'
     //......
     methods:{		
       async handleGetCode(){
         // 请求服务器获取验证码
         let result = await reqGetCode(this.phone)
         // 判断业务逻辑是否成功
         if(result.code === 200){
           // 若成功，提示一下
           this.$message.success('验证码获取成功！')
           // 直接把验证码填好
           this.code = result.data
         }else{
           this.$message.warning(result.message)
         }
       },   
     }
   </script>
   ```

### 7. 注册组件_完成注册

1. 编写API，拿着表单数据请求注册，注册成功后跳转登录，且要明确：无论成功还与失败，返回的`data`都为`null`。（注意：未校验表单）

   ```js
   // 此函数专门用于注册
   export const reqRegister = (params) => myAxios.post('/api/user/passport/register',params)
   ```

   ```vue
   <template>	
       <!-- -->	
      	<button @click="handleRegister">完成注册</button>
       <!-- -->	
   </template>

   <script>
     import {reqRegister} from '@/api'
     methods:{
       // 完成注册按钮的回调
       async handleRegister(){
         // 获取用户输入
         const {phone,code,password} = this
         // 请求注册(注意此处传递的参数是一个对象)
         let result = await reqRegister({phone,code,password})
         if(result.code === 200){
           this.$message.success('注册成功！')
         }else{
           this.$message.warning(result.message)
         }
       }
     }
   </script>
   ```

### 8. 登录组件_静态+完成登录

- 目标：在`Login`组件中，获取用户输入，发送登录请求。

- 去`src\api\index.js`中追加登录请求函数。

  ```js
  // 该函数专门用于：请求登录(参数为对象，包含：phone，password属性)
  export const reqLogin = (paramsObj) => myAxios.post('/api/user/passport/login',paramsObj)
  ```

- `Login`组件中：

  ```vue
  <template>
    <div class="login-container">
      <!-- 登录 -->
      <div class="login-wrap">
        <div class="login">
          <div class="loginform">
            <div class="content">
              <form>
                <div class="input-text clearFix">
                  <span></span>
                  <input v-model="phone" type="text" placeholder="手机号">
                </div>
                <div class="input-text clearFix">
                  <span class="pwd"></span>
                  <input v-model="password" type="text" placeholder="请输入密码">
                </div>
                <button class="btn" @click.prevent="handleLogin">登&nbsp;&nbsp;录</button>
              </form>
              <div class="call clearFix">
                <router-link class="register" to="/register">立即注册</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <div class="copyright">
        <ul>
          <li>关于我们</li>
          <li>联系我们</li>
          <li>联系客服</li>
          <li>商家入驻</li>
          <li>营销中心</li>
          <li>手机尚品汇</li>
          <li>销售联盟</li>
          <li>尚品汇社区</li>
        </ul>
        <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
        <div class="beian">京ICP备19006430号
        </div>
      </div>
    </div>
  </template>

  <script>
  	import {reqLogin} from '@/api'

    export default {
      name: 'Login',
  		data() {
  			return {
  				phone:'', //手机号
  				password:'' //密码
  			}
  		},
  		methods:{
  			async handleLogin(){
  				// 获取手机号、密码
  				const {phone,password} = this
  				// 发请求登录
  				let result = await reqLogin({phone,password})
  				// 判断业务逻辑是否成功
  				if(result.code === 200){
              // this.$message.success('登录成功')
              console.log('成功',result)
            }else{
              // this.$message.warning(result.message)
              console.log('失败',result)
            }
          }
  			}
  		}
    }
  </script>
  ```

### 9. 对 token 的理解（重要）

1. 只有登录是成功的，服务器才会为该用户生成一个`token`。

2. `token`是用户的真正标识，根据`token`，可以去服务器那查询到该用户的所有信息。

3. 浏览器端需要保存一份`token`，而且无论存在哪里，但推荐 —— `localStorage`中。

   > 为什么？ —— 为了做自动登录（理解：重开浏览器后，依然是登录的状态）

4. <span style="color:red">我们的服务器在用户登录成功后，会返回给我们：用户昵称、用户真实姓名、`token`，我们只存`token`。</span>

   > 为什么？ —— 根据`token`可以找服务器获取到更多的用户信息。
   >
   > 对于一般的服务器来说，登录成功后不会给任何多余的信息，只给一个`token`。

5. 若不允许多端登录，则服务器要在用户登录后，把之前的`token`销毁，再生成一个新的`token`。

   > 这个得看具体需求，目前我们的尚品汇服务器允许多端登录。

6. `token`不是永久有效的，一旦到了过期时间，服务器就自动销毁该`token`了。

7. 若用户主动触发退出登录，那么服务器就会销毁该用户的`token`。

### 10. token持久化存储（重要）

1. 明确：登录成功后，`token`要存入`localStorage`中。

2. 编写`src/utils/auth.js`追加两个方法，如下：

   ```js
   //用于将token存入localStorage
   export function saveToken(token){
   	localStorage.setItem('token',token)
   }

   //用于从localStorage中读取token
   export function readToken(){
   	return localStorage.getItem('token')
   }
   ```

3. `Login`组件中，登录成功后，将`token`存入`localStorage`中

   ```js
   methods: {
     async handleLogin(){
       // 获取手机号、密码
       const {phone,password} = this
       // 发请求登录
       let result = await reqLogin({phone,password})
       // 判断业务逻辑是否成功
       if(result.code === 200){
         //token存入本地
         saveToken(result.data.token)
         // 若登录成功，则提示
         this.$message.success('登录成功！')
         // 跳转主页
         this.$router.push('/home')
       }else{
         this.$message.warning(result.message)
       }
     }
   },
   ```

4. 修改`src/api/ajax.js`每次请求，都要判断是否有token，若有就携带

   ```js
   import {getUserTempId,readToken} from '@/utils/auth'

   //请求拦截器
   ajax.interceptors.request.use((config)=>{
   	nprogress.start() //进度条开始走
   	// 尝试从localStorage中读取token
   	const token = readToken()
   	// 若有token，就证明用户成功登录过
   	if(token){
   		config.headers.token = token
   	}
   	// 携带临时标识
   	config.headers.userTempId = getUserTempId()
   	return config
   })
   ```

### 11. 获取用户信息存入vuex

1. 明确：根据`token`获取到的用户信息，存在`vuex`中，方便其他组件使用。

2. 编写接口请求函数，根据token获取用户信息。

   ```js
   // 此函数专门用于获取用户信息
   export const reqUserInfo = () => myAxios.get('/api/user/passport/auth/getUserInfo')
   ```

3. 操作文件：`src/store/modules/user.js`，编写vuex三连环，存储用户信息。

   ```js
   import {reqUserInfo} from '@/api'
   import {Message} from 'element-ui'

   const actions = {
   	async getUserInfo({commit}){
   		//发送请求获取用户信息
   		const result = await reqUserInfo()
   		//判断是否获取成功
   		if(result.code === 200){
   			commit('SAVE_USER_INFO',result.data)
   		}else{
   			Message.warning(result.message)
   		}
   	}
   }

   const mutations = {
   	// 保存用户数据
   	SAVE_USER_INFO(state,info){
   		state.userInfo = info
   	}
   }

   const state = {
   	userInfo:{} //初始化用户信息
   }
   const getters = {}

   export default {
   	actions,
   	mutations,
   	state,
   	getters
   }

   ```

4. 在`Login`组件中，登录成功后，`dispatch`一个`getUserInfo`获取用户信息。

   ```js
   async handleLogin(){
     // 获取用户的输入
     const {phone,password} = this
     const result = await reqLogin({phone,password})
     if(result.code === 200){
       // 提示信息
       this.$message.success('登录成功')
       // 存储token
       saveToken(result.data.token)
       // 跳转到主页
       this.$router.push('/home')
       // 获取用户信息
       this.$store.dispatch('getUserInfo')
     }else{
       this.$message.warning(result.message)
     }
   }
   ```

## day12

### 1. 用户信息如何不丢失

问题描述：刷新会导致`vuex`中的用户信息丢失。

如何解决？

- 第一个办法：分别在：`Search`组件、`Cart`组件、`Detail`组件等等，中`dispatch('getUserInfo')`。

  > 可以实现，但不是很好，如果组件很多的话，太麻烦了！

- 第二个办法：`App`组件中`dispatch('getUserInfo')`。

  > 不行，会有严重bug，在初次登录的时候，无法获取用户信息。

- 第三个办法：存入`localStorage`中。

  > 可以实现，但不是很好，因为存的一点意义都没有，刷新页面、重开浏览器后，我们不确定信息还是否有效，还得通过`token`请求用户信息。

- 较好的办法：靠`导航守卫`去维护用户信息。

  > Vue项目中，较为周全的做法是：`token`存入`localStorage`，根据`token`获取的用户信息存入`vuex`，每次刷新页面、重开浏览器时，靠`导航守卫`去维护用户信息。

### 2. 导航守卫（重要）

1. 概念：路由跳转时，在特定的时刻，执行的一些函数。

2. 作用：可以在路由跳转时，追加特殊逻辑（路由鉴权、获取用户信息等）。

3. 技巧：守卫越早使用越好。

4. 分类：

   - <strong style="color:red">全局守卫（很常用）====> 宏福科技园门口的大爷</strong >
   - 路由独享守卫 =========> 尚硅谷楼层的值班老师
   - 组件内守卫 ===========> 班级里的老师

5. 我们的项目为什么使用导航守卫？

   1. 每次路由跳转、刷新页面时，都要靠守卫：获取用户信息。
   2. 对某些敏感路由做出访问限制。

6. 严重注意：导航守卫一定一定要有出口！—— 什么是出口？他就是 ：`next()`

7. 导航守卫小案例：

   ```js
   import Vue from 'vue'
   import VueRouter from 'vue-router'
   import Home from '../pages/Home'
   import Hot from '../pages/Hot'
   import Like from '../pages/Like'
   import Near from '../pages/Near'

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
   		},
   		{
   			path:'/near',
   			component:Near
   		},
   	]
   })

   /* 
   	需求：只有尊贵的vip用户，才能访问： /like   /near
   */
   // 用于标识是否为vip
   let isVIP = false
   // 设计一个鉴权名单
   let authPath = ['/like','/near']

   //beforeEach所指定的函数就是全局守卫
   //全局守卫何时调用？1.整个应用初始化的时候调用（一上来）2.每次路由跳转的时候
   router.beforeEach((to,from,next)=>{
   	//判断您是否为VIP
   	if(isVIP){
   		console.log('您是尊贵的VIP，您想看哪，就看哪')
   		next()
   	}else{
   		console.log('你不是VIP，我得看看，你要去哪？')
   		if(authPath.includes(to.path)){
   			console.log('你就居然去了VIP才去的地方，一巴掌扇到/home')
   			next('/home')
   		}else{
   			console.log('你去的不是啥敏感路由，你随意吧')
   			next()
   		}
   	}
   })

   export default router

   ```

### 3. dispatch的返回值（重要）

1. `this.$store.dispatch('xxx')`的返回值是一个`Promise`实例。

2. 返回的这个`Promise`实例，成功还是失败，要看`xxx`函数的返回值，规则同`then`方法。

3. 可以去`Test`组件中做一个测试

   - 在`src\store\index.js`中

   ```js
   import Vue from 'vue'
   import vuex from 'vuex'
   import user from './user'
   import home from './home'
   import search from './search'

   Vue.use(vuex)

   const actions = {
   	jia({commit,state}){
   		if(state.n === 10){
   			return Promise.reject()
   		}else{
   			commit('JIA',1)
   		}
   	}
   }

   const mutations = {
   	JIA(state,value){
   		state.n += value
   	}
   }

   const state = {
   	n:1
   }

   const getters = {}

   const store = new vuex.Store({
   	actions,
   	mutations,
   	state,
   	getters,
   	modules:{home,user,search}
   })

   export default store
   ```

   - 在`src\pages\Test\index.vue`中

   ```js
   async add(){
     //第一种写法
     /* const x = this.$store.dispatch('jia')
   				x.then(
   					() => {console.log('加成了')},
   					() => {console.log('没加成')}
   				) */

     //第二种写法
     try {
       await this.$store.dispatch('jia')
       console.log('666加的好！加的妙，加呱呱叫！')
     } catch (error) {
       console.log('不6了你没加')
     }

   }
   ```

### 4. 维护用户信息 _思路（重要）

1. 文字描述

   ```
   全局导航守卫，维护用户信息不丢失的逻辑如下：
   立刻从localStorage中读取token，（有token就是登录过，无token就是没登录过）
       1.有token
           进一步判断vuex中是否有用户信息
               1.有用户信息：
                     要token有token，要信息有信息，既然什么都有，直接放行！
                     什么场景？—— 用户已经成功的登录了，并且获取过用户信息。
                      ──────────────────────────
                     │ 有一个特殊点：万一token是过期的，怎么办？
                     │ token过期了，
                     │ 依然可以：请求分类信息、请求搜索、请求购物车数据。
                     │ 但是不能：请求收货地址、请求下订单、请求支付。
                     │ 关于这个场景，我们后期用axios拦截器，去解决。
                      ─────────────────────────
               2.无用户信息：
                     尝试拿着token去获取用户信息
                     什么场景？用户刚登录 或 刷新了页面
                         1.获取成功：信息存入vuex，供后续使用，直接放行！
                         2.获取失败：证明token已经过期了，删除本地的token，放行到登录！
       2.无token
           证明用户没有登录过，那就意为着：根本就不用发请求获取用户信息。
           但要注意，没登录的话，有些敏感路由是不能去的，比如：交易路由、支付路由、我的订单路由。
           截止目前，我们所有的路由，都是随便看的，没有出现过敏感路由。
           所以，暂时，我们直接放行（暂时饶你一命！）—— next()
   ```

2. 图片描述

   ![](http://49.232.112.44/images/token.png)

### 5. 维护用户信息 _编码（重要）

1. 去`src/utils/auth.js`中添加一个`deleteToken`。

   ```js
   //从localStoragre删除用户token
   export function deleteToken(){  
      localStorage.removeItem('token')
   }
   ```

2. 去：`src\store\user.js`里，找到：`getUserInfo`，让`getUserInfo`可以反馈自己的工作成果。

   ```js
   const actions = {
   	// 根据token获取用户信息（token已经在请求头中携带了）
   	async getUserInfo({commit}){
   		/**********/
   		if(result.code === 200){
         //如果用户信息获取成功，则不写return，相当于return了undefined，
         //那么dispatch('getUserInfo')得到的值就是一个成功的Promise实例
   			/**********/
   		}else{
   			/**********/
         //如果用户信息获取失败，则return一个失败的Promise实例 
         //那么dispatch('getUserInfo')得到的值就是一个失败的Promise实例
   			return Promise.reject() 
   		}
   	}
   }
   ```

3. 守卫中的逻辑：

   ```js
   //指定全局导航守卫
   router.beforeEach(async(to,from,next)=>{
   	//读取本地token
   	const token = readToken()
   	//根据token判断用户是否登录过
   	if(token){
   		//登录过
   		console.log('有token，你登录过，再看看vuex中，是否有用户信息')
       //读取vuex中的用户信息
   		const {info} = store.state.user
   		//判断vuex中是否有用户信息
   		if(info.id){
   			//有用户信息
   			console.log('要token有token，要信息有信息，直接放行！')
   			next() //放行
   		}else{
   			//无用户信息
   			console.log('没有用户信息，我要带着token，去帮你请求用户信息')
   			try {
   				//联系服务员，去获取用户信息
   				await store.dispatch('getUserInfo')
   				console.log('获取用户信息成功！')
   				next() //放行
   			} catch (error) {
   				console.log('获取用户信息失败！')
   				//删除本地token
   				deleteToken()
   				//放行到登录
   				next('/login')
   			}
   		}
   	}else{
   		//没登录
   		console.log('您没登录，但是现在也没什么【敏感路由】，暂时饶你一命，想去哪你就去哪吧')
   		next() //放行
   	}
   })
   ```

4. 备注：逻辑写完了如何去测试？

   - 去`localStorage`中删除`token`，不登录，随便点一点，所有路由都能看才正常。
   - 去登录，然后到各种地方去刷新，看看`vuex`里有没有用户信息，一直有才正常。
   - 去`localStorage`中，故意把`token`改错，刷新，打回登录才正常。

### 6. Header组件展示信息

- `Header`组件中读取vuex数据，进行展示

  ```vue
  <template>
    <!-- 登录后才能呈现的元素 -->
    <p v-show="userInfo.id">
      <span>{{userInfo.nickName}}</span>
      <a class="register">退出登录</a>
      </p>
    <!-- 不登录才能呈现的元素 -->
    <p v-show="!userInfo.id">
      <span>请</span>
      <router-link to="/login">登录</router-link>
      <router-link to="/register" class="register">免费注册</router-link>
    </p>
  </template>

  <script>
    computed: {
      ...mapState({
        userInfo:state => state.user.userInfo
      })
    }
  </script>
  ```

### 7. 退出登录

1. 需要做四件事：

   - 发请求，通知服务器销毁`token`。
   - 清空`localStorage`中的`token`。
   - 清空`vuex`中用户的信息。
   - 跳转到`/login`路由。

2. 具体编码：

   - 编写请求函数

     ```js
     // 此函数专门用于请求退出登录
     export const reqLogout = () => myAxios.get('/api/user/passport/logout')
     ```

   - `src\store\user.js`

     ```js
     import {reqUserInfo,reqLogout} from '@/api'
     import {deleteToken} from '@/utils/auth'
     import {Message} from 'element-ui';
     import router from '@/router'

     //用于响应组件中的“动作”  —— 服务员
     const actions = {
     	//**********
     	// 退出登录
     	async logout({commit}){
     		// 请求退出登录
     		const result = await reqLogout()
     		// 判断业务逻辑是否成功
     		if(result.code === 200){
     			// 联系mutations清空用户信息
     			commit('CLEAR_USER_INFO')
     			// 清空本地的token
     			deleteToken()
     			// 跳转到login
     			router.push('/login')
     		}else{
     			// 就目前我们的尚品汇服务器来说，永远不会存在，退出登录失败。
     			Message.warning(result.message)
     		}
     	}
     }

     //用于真正操作数据  —— 厨师
     const mutations = {
     	//******
     	CLEAR_USER_INFO(state){
     		state.userInfo = {}
     	}
     }

     //初始化的数据 —— 原材料
     const state = {
     	userInfo:{}
     }

     //vuex层面的计算属性
     const getters = {}

     export default {
     	actions,
     	mutations,
     	state,
     	getters
     }
     ```

   - `Header`组件：

     ```vue
     <a class="register" @click="handleLogout">退出登录</a>

     <script>
       //......
       //退出登录的回调
       handleLogout(){
         if(confirm('确定退出登录吗？')){
           this.$store.dispatch('logout')
         }
       }
     </script>
     ```

### 8. 交易界面_静态

1. 直接拷贝准备好的`Trade`组件；

2. 删掉不用的结构，删掉的内容如下：

   ```
   货到付款  
   送货清单  
   <div class="line"></div>
   <div class="bill"></div>
   <div class="way"></div>  
   返现
   运费
   ```

### 9. 对交易路由进行鉴权

1. 明确：没登录不可以看交易页面，需要在全局守卫中追加逻辑；

   ```js
   // 以下路由必须登录后才能看
   const authPath = ['/trade']

   router.beforeEach(async(to,from,next)=>{
     //......
     if(token){
       //......
     }else{
   		//没有token
   		console.log('没有读取到你的token，你没登录，我得看看你去的是不是敏感路由')
   		if(authPath.includes(to.path)){
   			console.log('你看了敏感路由，先去登录再说吧')
   			Message.warning('请您先登录！')
   			next('/login')
   		}else{
   			console.log('你看的不是敏感路由，您随意')
   			next()
   		}
   	}
   }
   ```

### 10. 交易路由_获取数据

1. api里追加`reqUserAddressList`、`reqTradeInfo`

   ```js
   // 此函数专门用于请求收货地址
   export const reqUserAddressList = () => myAxios.get('/api/user/userAddress/auth/findUserAddressList')
   // 此函数专门用于获取交易信息
   export const reqTradeInfo = () => myAxios.get('/api/order/auth/trade')
   ```

2. `Trade`组件一挂载就请求：用户地址信息、订单交易页信息；

   ```vue
   <template>
     {{addressList}}
     <br>
     <br>
     {{tradeInfo}}
   </template>

   <script>
   	import {reqUserAddressList,reqTradeInfo} from '@/api'
     
   	export default {
       name: 'Trade',
   		data() {
   			return {
   				addressList:[],
   				tradeInfo:{}
   			}
   		},
   		methods:{
   			async getTradeAbout(){
   				const r1 = await reqUserAddressList()
   				const r2 = await reqTradeInfo()
           if(r1.code === 200 && r2.code === 200) {
             this.addressList = r1.data
             this.tradeInfo = r2.data
           }else{
             this.$message.warning('获取交易信息失败！')
           }
   			}
   		},
   		mounted(){
   			this.getTradeAbout()
   		}
     }
   </script>
   ```

### 11. 拦截器处理身份过期（重要）

- 一个特殊的场景：

  用户登录后一直使用系统，不刷新页面，用了好久好久，达到了`token`的过期时间，这时所有需要身份信息的请求，都不会有正确的响应（服务器`code`为`208`），此时应该触发：退出登录逻辑。

- 处理思路：在`axios`拦截器中，对服务器响应的`code`属性进行判断，若`code`为`208`，则触发退出登录。

  ```js
  // 响应拦截器
  myAxios.interceptors.response.use(
  	//响应成功的回调
  	response => {
  		//进度条停止
  		nprogress.done()
  		// 判断code是否为208，208意味着：token过期了。
  		if(response.data.code === 208){
  			// token已失效，强制触发退出登录。
  			store.dispatch('logout','身份已过期，请您重新登录！') //=====>注意此处要携带具体的提示信息
  			//终止所有后续的逻辑
  			return new Promise(()=>{})
  		}else{
  			//返回真正的数据
  			return response.data
  		}
  	},
  	//响应失败的回调
  	error => {
  		/******************/
  )
  ```


- 简单修改一下：`src\store\user.js`，让提示的信息更具体

  ```js
  // 退出登录
  async logout({commit},value){ // =======>此处多接收一个value
    // 联系服务器退出登录（销毁token）
    const result = await reqLogout()
    if(result.code === 200){
      // 退出登录成功，给个提示
      Message.success(value) // =======>此处提示的信息时value
      /*************/
    }else{
       /*************/
    }
  }
  ```

- 修改`src\components\Header\index.vue`，退出登录的时候，说明具体的提示文字

  ```js
  handleLogout(){
    if(confirm('确定退出吗？')){
      this.$store.dispatch('logout','退出登录成功！')
    }
  }
  ```

## day13

### 1. 交易路由_展示信息

`Trade`组件展示：用户地址、交易清单，完整代码如下

> 可以直接复制如下代码，只是单纯的展示数据。

```vue
<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>
			<!-- 收货地址 -->
      <div class="address clearFix" v-for="address in addressList" :key="address.id">
        <span class="username" :class="{selected:address.isDefault == 1}">
					{{address.consignee}}
				</span>
        <p>
          <span class="s1">{{address.fullAddress}}</span>
          <span class="s2">{{address.phoneNum}}</span>
          <span class="s3" v-show="address.isDefault == 1">默认地址</span>
        </p>
      </div>
      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
      </div>
      <div class="detail">
        <h5>商品清单</h5>
				<!-- 清单里的每一个商品 -->
        <ul 
          class="list clearFix" 
          v-for="detail in tradeInfo.detailArrayList" :key="detail.skuId"
        >
          <li>
            <img :src="detail.imgUrl" alt="">
          </li>
          <li>
            <p>{{detail.skuName}}</p>
          </li>
          <li>
            <h3>￥{{detail.orderPrice}}</h3>
          </li>
          <li>X{{detail.skuNum}}</li>
        </ul>

      </div>
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea placeholder="建议留言前先与商家沟通确认" class="remarks-cont"></textarea>

      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b><i>{{tradeInfo.totalNum}}</i>件商品，总商品金额</b>
          <span>¥{{tradeInfo.originalTotalAmount}}</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">应付金额:　<span>¥{{tradeInfo.totalAmount}}</span></div>
      <div class="receiveInfo">
        寄送至:
        <span>{{showAddressInfo.fullAddress}}</span>
        收货人：<span>{{showAddressInfo.consignee}}</span>
        <span>{{showAddressInfo.phoneNum}}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <router-link class="subBtn" to="/pay">提交订单</router-link>
    </div>
  </div>
</template>

<script>
	import {reqAddressList,reqTradeInfo} from '@/api'

  export default {
    name: 'Trade',
		data() {
			return {
				addressList:[],
				tradeInfo:{}
			}
		},
		computed: {
			showAddressInfo(){
				return this.addressList.find(address => address.isDefault == 1) || {}
			}
		},
		methods: {
			async getTradeAboutInfo(){
				const r1 = await reqAddressList()
				const r2 = await reqTradeInfo()
				if(r1.code === 200 && r2.code === 200){
					this.addressList = r1.data
					this.tradeInfo = r2.data
				}else{
					this.$message.warning('获取交易相关信息失败，请稍后重试！')
				}
			}
		},
		mounted() {
			this.getTradeAboutInfo()
		},
  }
</script>
```

### 2. 交易路由_切换地址

- 实现：切换收货地址、收集买家留言（订单备注）

  ```vue
  <template>
    <div class="trade-container">
      <h3 class="title">填写并核对订单信息</h3>
      <div class="content">
        <h5 class="receive">收件人信息</h5>
  			<!-- 收货地址 -->
        <div class="address clearFix" v-for="address in addressList" :key="address.id">
          <span class="username" :class="{selected:address.isDefault == 1}">
  					{{address.consignee}}
  				</span>
          <p @click="handleChangeAddress(address.id)">
            <span class="s1">{{address.fullAddress}}</span>
            <span class="s2">{{address.phoneNum}}</span>
            <span class="s3" v-show="address.isDefault == 1">默认地址</span>
          </p>
        </div>
        <div class="line"></div>
        <h5 class="pay">支付方式</h5>
        <div class="address clearFix">
          <span class="username selected">在线支付</span>
        </div>
        <div class="detail">
          <h5>商品清单</h5>
  				<!-- 清单里的每一个商品 -->
          <ul class="list clearFix" v-for="detail in tradeInfo.detailArrayList" :key="detail.skuId">
            <li>
              <img :src="detail.imgUrl" alt="">
            </li>
            <li>
              <p>{{detail.skuName}}</p>
            </li>
            <li>
              <h3>￥{{detail.orderPrice}}</h3>
            </li>
            <li>X{{detail.skuNum}}</li>
          </ul>

        </div>
        <div class="bbs">
          <h5>买家留言：</h5>
          <textarea v-model="message" placeholder="建议留言前先与商家沟通确认" class="remarks-cont">
  				</textarea>
        </div>
      </div>
      <div class="money clearFix">
        <ul>
          <li>
            <b><i>{{tradeInfo.totalNum}}</i>件商品，总商品金额</b>
            <span>¥{{tradeInfo.originalTotalAmount}}</span>
          </li>
        </ul>
      </div>
      <div class="trade">
        <div class="price">应付金额:　<span>¥{{tradeInfo.totalAmount}}</span></div>
        <div class="receiveInfo">
          寄送至:
          <span>{{showAddressInfo.fullAddress}}</span>
          收货人：<span>{{showAddressInfo.consignee}}</span>
          <span>{{showAddressInfo.phoneNum}}</span>
        </div>
      </div>
      <div class="sub clearFix">
        <router-link class="subBtn" to="/pay">提交订单</router-link>
      </div>
    </div>
  </template>

  <script>
  	import {reqAddressList,reqTradeInfo} from '@/api'

    export default {
      name: 'Trade',
  		data() {
  			return {
  				addressList:[], //收货地址
  				tradeInfo:{}, //交易信息（商品清单、数量、应付金额、实际金额 等等）
  				message:'' //买家留言
  			}
  		},
  		computed: {
  			showAddressInfo(){
  				return this.addressList.find(address => address.isDefault == 1) || {}
  			}
  		},
  		methods: {
  			// 组件一挂载就调用getTradeAboutInfo，获取交易相关的信息
  			async getTradeAboutInfo(){
  				const r1 = await reqAddressList()
  				const r2 = await reqTradeInfo()
  				if(r1.code === 200 && r2.code === 200){
  					this.addressList = r1.data
  					this.tradeInfo = r2.data
  				}else{
  					this.$message.warning('获取交易相关信息失败，请稍后重试！')
  				}
  			},
  			// 切换收货地址的回调
  			handleChangeAddress(id){
  				this.addressList.forEach((address)=>{
  					if(address.id === id) address.isDefault = '1'
  					else address.isDefault = '0'
  				})
  			}
  		},
  		mounted() {
  			this.getTradeAboutInfo()
  		},
    }
  </script>
  ```

### 3. 交易路由_收集必备参数

1. 明确：想提交订单，需要携带如下参数给服务器（看了接口文档才知道的）

   - tradeNo（交易编号）
   - consignee（收货人姓名）
   - consigneeTel（收获人手机号）
   - deliveryAddress（收货地址）
   - paymentWay （支付方式，我们的系统只有在线支付）
   - orderComment（订单备注）
   - orderDetailList（商品列表）

2. 先收集好这些参数

   ```js
   // 提交订单的回调
   handleSubmitOrder(){
     // 获取交易编号、商品清单
     const {tradeNo,detailArrayList} = this.tradeInfo
     // 获取收件信息
     const {consignee,phoneNum,fullAddress} = this.showAddressInfo
     // 订单备注
     const {message} = this
     // 维护一个参数对象
     const paramsObj = {
       tradeNo,
       consignee,
       consigneeTel:phoneNum,
       deliveryAddress:fullAddress,
       paymentWay:'ONLINE',
       orderComment:message,
       orderDetailList:detailArrayList
     }
     console.log(paramsObj)
   }
   ```


### 4. 提交订单+支付路由静态

- 携带之前维护好的必备参数，直接发送请求，订单提交成功，跳转到支付路由（`/pay`）。

- 第一步：配置好接口请求函数

  ```js
  //用于请求提交订单
  export const reqSubmitOrder = (tradeNo,params) => myAxios.post(`/api/order/auth/submitOrder?tradeNo=${tradeNo}`,params)
  ```

- 第二步：在`src\pages\Trade\index.vue`中，携带参数发送请求

  ```js
  // 提交订单的回调
  async handleSubmitOrder(){
    /*********/
    // 发请求
    const result = await reqSubmitOrder(tradeNo,paramsObj)
    if(result.code === 200){
      console.log(result)
      this.$message.success('提交订单成功，请您及时支付！')
      //请求成功后，看看返回的信息
      console.log(result.data)
    }else{
      this.$message.warning(result.message)
    }
  }
  ```

- 第三步：直接复制我们提前写好的`Pay`组件，精简后的支付组件结构如下：

  ```vue
  <template>
    <div class="pay-main">
      <div class="pay-container">
        <div class="checkout-tit">
          <h4 class="tit-txt">
            <span class="success-icon"></span>
            <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
          </h4>
          <div class="paymark">
            <span class="fl">请您在提交订单
              <em class="orange time">4小时</em>
              之内完成支付，超时订单会自动取消。订单号：
  						<em>{{$route.query.order_id}}</em></span>
            <span class="fr"><em class="lead">应付金额：</em>
              <em class="orange money">￥17,654</em>
    				</span>
          </div>
        </div>
        <div class="checkout-info">
          <h4>重要说明：</h4>
          <ol>
            <li>尚品汇商城支付平台目前支持<span class="zfb">微信</span>支付方式。</li>
            <li>其它支付渠道正在调试中，敬请期待。</li>
          </ol>
        </div>
        <div class="checkout-steps">
          <div class="step-tit">
            <h5>支付平台</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay3.jpg"></li>
            </ul>
          </div>
          <div class="hr"></div>
          <div class="payshipInfo">
            <div class="step-tit">
              <h5>支付网银</h5>
            </div>
            <div class="step-cont">
              <ul class="payType">
                <li><img src="./images/pay10.jpg"></li>
                <li><img src="./images/pay11.jpg"></li>
                <li><img src="./images/pay12.jpg"></li>
                <li><img src="./images/pay13.jpg"></li>
                <li><img src="./images/pay14.jpg"></li>
                <li><img src="./images/pay15.jpg"></li>
                <li><img src="./images/pay16.jpg"></li>
                <li><img src="./images/pay17.jpg"></li>
                <li><img src="./images/pay18.jpg"></li>
                <li><img src="./images/pay19.jpg"></li>
                <li><img src="./images/pay20.jpg"></li>
                <li><img src="./images/pay21.jpg"></li>
                <li><img src="./images/pay22.jpg"></li>
              </ul>
            </div>
          </div>
          <div class="hr"></div>
          <div class="submit">
            <router-link class="btn" to="/paysuccess">立即支付</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  ```

- 第四步：记得配置路由规则

  ```js
  import Pay from '../pages/Pay'
  /**************/
  {
    path:'/pay',
    component:Pay,
  }
  ```

- 第五步`Trade`组件，提交订单成功后，跳转`Pay`组件。

  ```js
  // 提交订单的回调
  async handleSubmitOrder(){
    /*********/
    // 发请求
    const result = await reqSubmitOrder(tradeNo,paramsObj)
    if(result.code === 200){
      console.log(result)
      this.$message.success('提交订单成功，请您及时支付！')
      //提交订单成功，跳转到支付组件
      this.$router.push({
        path:'/pay',
        query:{order_id:result.data}
      })
    }else{
      this.$message.warning(result.message)
    }
  }
  ```

### 5. 支付路由_获取支付信息

思路：支付组件一挂载，就携带订单编号，去请求具体的支付信息（该订单到底花多少钱）。

- 编写api请求订单支付信息

  ```js
  //请求订单支付信息
  export const reqPayInfo = (orderId) => myAxios.get(`/api/payment/weixin/createNative/${orderId}`)
  ```

- `Pay`组件挂载完毕后，立刻请求支付信息，呈现到页面

  ```vue
  <template>
  	<!---->
    订单号：<em>{{$route.query.order_id}}</em>
  	<!---->
    <em class="orange money">￥{{payInfo.totalFee}}</em>
  </template>

  <script>
  	import {reqPayInfo} from '@/api'

    export default {
      name: 'Pay',
  		data() {
  			return {
  				payInfo:{} //存储本次支付信息
  			}
  		},
  		methods:{
  			// 获取支付信息
  			async getPayInfo(){
  				// 获取订单编号
  				const {order_id} = this.$route.query
  				// 发送请求获取支付信息
  				const result = await reqPayInfo(order_id)
  				// 判断业务逻辑是否成功
  				if(result.code === 200){
  					// 若获取支付信息成功，则存储数据
  					this.payInfo = result.data
  				}else{
  					// 若获取支付信息失败，则提示原因
  					this.$message.warning(result.message)
  				}
  			}
  		},
  		mounted(){
  			// 组件一挂载，就获取支付信息
  			this.getPayInfo()
  		}
    }
  </script>
  ```

### 6. 支付路由_弹窗

使用`element-ui`实现付款弹窗

```vue
<a class="btn" @click="handlePay">立即支付</a>

<script>
  //立即支付按钮的回调
  handlePay(){
    // 弹窗中的内容
    const htmlStr = '<img src="https://i1.hdslb.com/bfs/archive/366eeb71bb49124549ac274dd09cb4e5f6947dc0.jpg" style="width:200px"/>'
    // 弹窗的具体配置
    const options = {
      dangerouslyUseHTMLString: true,
      center:true,
      showClose:false,
      showCancelButton:true,
      cancelButtonText:'支付遇到问题',
      confirmButtonText:'已完成支付',
    }
    // 弹起来！
    this.$alert(htmlStr, '微信扫码支付', {
      ...options,
      callback:(type)=>{
        if(type === 'confirm'){
          console.log('您点了确定按钮')
        }else{
          console.log('您点了取消按钮')
        }
      }
    })
  }
</script>
```

### 7. 支付路由_生成二维码（重要）

- 安装qrcode：`npm i qrcode`

- 代码如下：

  ```vue
  <script>
    import {reqPayInfo} from "@/api";
    import QRCode from "qrcode";

    export default {
      methods: {
  			//立即支付按钮的回调
  			async handlePay(){
  				try {
  					// 把支付链接转为二维码
  					const url = await QRCode.toDataURL(this.payInfo.codeUrl)
  					// 弹窗中的内容
  					const htmlStr = `<img src="${url}" style="width:200px"/>`
  					// 弹窗的具体配置
  					const options = {
  						dangerouslyUseHTMLString: true,
  						center:true,
  						showClose:false,
  						showCancelButton:true,
  						cancelButtonText:'支付遇到问题',
  						confirmButtonText:'已完成支付',
  					}
  					// 弹起来！
  					this.$alert(htmlStr, '微信扫码支付', {
  						...options,
  						callback:(type)=>{
  							if(type === 'confirm'){
  								console.log('您点了确定按钮')
  							}else{
  								console.log('您点了取消按钮')
  							}
  						}
  					})
  				} catch (error) {
  					this.$message.warning('支付二维码获取失败，请联系管理员！')
  				}
  			}
      },
    };
  </script>
  ```

### 8. 支付路由_心跳请求（重要）

1. 明确：支付弹窗出现后，紧随其后，发起一个心跳请求，不断问服务器订单的支付状态。

2. 编写接口请求函数

   ```js
   // 用于请求订单的支付状态
   export const reqPayStatus = (orderId) => myAxios.get(`/api/payment/weixin/queryPayStatus/${orderId}`)
   ```

3. 去配置一个新的路由`/paysuccess`，直接复制粘贴我们的静态就可以，随后补充一个路由规则：

   ```js
   import PaySuccess from '@/pages/PaySuccess'
   //********
   {
     path:'/paysuccess',
     component:PaySuccess,
   }
   ```

4. 弹窗后，发起心跳请求

   ```js
   //立即支付按钮的回调
   async handlePay(){
     try {
       // 把支付链接转为二维码
       const url = await QRCode.toDataURL(this.payInfo.codeUrl)
       // 弹窗中的内容
       const htmlStr = `<img src="${url}" style="width:200px"/>`
       // 弹窗的具体配置
       const options = {
         dangerouslyUseHTMLString: true,
         center:true,
         showClose:false,
         showCancelButton:true,
         cancelButtonText:'支付遇到问题',
         confirmButtonText:'已完成支付',
       }
       // 弹起来！
       this.$alert(htmlStr, '微信扫码支付', {
         ...options,
         callback:(type)=>{
           if(type === 'confirm'){
             console.log('您点了确定按钮')
           }else{
             console.log('您点了取消按钮')
           }
         }
       })
       // 发起心跳请求
       this.timer = setInterval(async()=>{
         // 请求订单支付状态
         const result = await reqPayStatus(this.payInfo.orderId)
         if(result.code === 200){
           // 关闭定时器
           clearInterval(this.timer)
           // 关掉弹窗
           this.$msgbox.close()
           // 跳转到成功支付路由
           this.$router.push('/paysuccess')
         }
       },1000)
     } catch (error) {
       this.$message.warning('支付二维码获取失败，请联系管理员！')
     }
   }
   ```

### 9 .支付路由_弹窗按钮逻辑

**整体逻辑梳理：**

> ① 无论点击【已完成支付】还是点击【支付遇到问题】`element-ui`都会自动关闭弹窗。
>
> ② 弹窗有，心跳请求就有； 弹窗没，心跳请求就没。

- 点击【支付遇到问题】按钮逻辑：
  1. 立刻停止心跳
  2. 提示：若您支付遇到问题，请致电客服解决！

- 点击【已支付完成】按钮逻辑：
  1. 立刻停止心跳
  2. 再次联系服务器，看看是否真的支付了
     - 支付了 —— 提示：支付成功！跳转支付成功页面
     - 未支付 —— 提示：您的订单并未支付成功，点击【立即支付】重新支付

弹窗最终完整代码如下：

```js
//立即支付按钮的回调
async handlePay(){
  try {
    // 把支付链接转为二维码
    const url = await QRCode.toDataURL(this.payInfo.codeUrl)
    // 弹窗中的内容
    const htmlStr = `<img src="${url}" style="width:200px"/>`
    // 弹窗的具体配置
    const options = {
      dangerouslyUseHTMLString: true,
      center:true,
      showClose:false,
      showCancelButton:true,
      cancelButtonText:'支付遇到问题',
      confirmButtonText:'已完成支付',
    }
    // 弹起来！
    this.$alert(htmlStr, '微信扫码支付', {
      ...options,
      callback:async(type)=>{
        if(type === 'confirm'){
          // 心跳停止
          clearInterval(this.timer)
          // 再次像服务器发请求，确认订单状态
          const result = await reqPayStatus(this.payInfo.orderId)
          if(result.code === 200){
            // 若真的支付了
            this.$router.push('/paysuccess')
          }else{
            // 若没有支付
            this.$message.error('您的订单并未支付成功，请重新支付！')
          }
        }else{
          // 心跳停止
          clearInterval(this.timer)
          // 给一个小提示
          this.$message.warning('若您支付遇到问题，请致电客服解决！')
        }
      }
    })
    // 发起心跳请求
    this.timer = setInterval(async()=>{
      // 请求订单支付状态
      const result = await reqPayStatus(this.payInfo.orderId)
      if(result.code === 200){
        // 关闭定时器
        clearInterval(this.timer)
        // 关掉弹窗
        this.$msgbox.close()
        // 跳转到成功支付路由
        this.$router.push('/paysuccess')
      }
    },1000)
  } catch (error) {
    this.$message.warning('支付二维码获取失败，请联系管理员！')
  }
}
```

### 10. 路由懒加载（重要）

1. 什么是懒加载：其实就是延迟加载，即当需要用到的时候再去加载。

2. 优点：减少网络开销，节约网络流量。

3. 缺点：如果某个资源过大，加载很耗时，用户体验下降。

4. Vue中路由的懒加载：

   ```js
   //原来的引入方式
   /* 
       import Home from '@/pages/Home'
       import Login from '@/pages/Login'
       import Register from '@/pages/Register'
       import Search from '@/pages/Search'
       import Detail from '@/pages/Detail'
       import AddCartSuccess from '@/pages/AddCartSuccess'
       import Cart from '@/pages/Cart'
       import Trade from '@/pages/Trade'
       import Pay from '@/pages/Pay'
       import PaySuccess from '@/pages/PaySuccess' 
   */

   //懒加载的引入方式
   const Home = ()=> import('@/pages/Home')
   const Login = ()=> import('@/pages/Login')
   const Register = ()=> import('@/pages/Register')
   const Search = ()=> import('@/pages/Search')
   const Detail = ()=> import('@/pages/Detail')
   const AddCartSuccess = ()=> import('@/pages/AddCartSuccess')
   const Cart = ()=> import('@/pages/Cart')
   const Trade = ()=> import('@/pages/Trade')
   const Pay = ()=> import('@/pages/Pay')
   const PaySuccess = ()=> import('@/pages/PaySuccess')
   const Center = ()=> import('@/pages/Center')
   const Test = ()=> import('@/pages/Test')
   ```

### 11. 图片的加载效果（重要）

1. 安装vue-lazyload：`npm i vue-lazyload@1` 。

   >  注意：`vue-lazyload`这包，默认版本居然是3的内测版，所以请安装时，加上版本限制

2. 提前准备好一个过渡图片：`/assets/images/loading.gif`

3. `main.js`中

   ```js
   import VueLazyload from 'vue-lazyload'
   import picture from '@/assets/images/loading.gif'
   //....
   Vue.use(VueLazyload,{
   	loading:picture
   })
   ```

4. 使用图片的地方改为

   ```html
   <img v-lazy="g.defaultImg" />
   ```

### 12. 完善路由鉴权

#### 1.基本鉴权

1. 明确：有些路由只有登录了，才能看；—— 使用<strong style="color:red">全局守卫</strong>去做。

2. 他们分别是：`/trade`、`/pay`、`/paysuccess`、`/center`

3. 在全局导航守卫中追加几个规则，具体编码如下：

   ```js
   // 以下路由必须登录后才能看
   const authPath = ['/trade','/pay','/paysuccess','/center']
   ```


#### 2.细化鉴权

1. 明确：只有在特定路由，才能去特定路由。

2. 使用【路由独享守卫】细化鉴权规则，配置写在路由规则中（`src/router/routes.js`）。

   ```js
   	//只有从【详情】页面才能跳到【添加购物车成功】页面
   	{
   		path:'/addcart_success',
   		component:AddCartSuccess,
   		beforeEnter: (to, from, next) => {
   			if(from.path.slice(0,7) === '/detail') next()
   			else next('/home')
   		}
   	},
       
     //只有从【交易】页面才能跳到【支付】页面
   	{
   		path:'/pay',
   		component:Pay,
   		beforeEnter: (to, from, next) => {
   			if(from.path === '/trade') next()
   			else next('/home')　　　　　　　　　　
   		}
   	},
   ```

3. 使用【组件内守卫】细化鉴权规则，配置写在组件中（`.vue`文件）

   ```js
   export default {
   	name: 'PaySuccess',
     //只有从【支付】页面，才能去【支付成功】页面
   	beforeRouteEnter(to, from, next) {
   		if(from.path === '/pay'){
   			next()
   		}else{
   			next('/home')
   		}
   	}
   }
   ```

















