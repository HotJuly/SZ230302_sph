# 1.ES6模块化语法

```
1.默认暴露
	暴露语法:export default 123;
	引入:import data from '文件路径';
	
	无论是哪一种暴露语法,实际暴露的都是一个对象
		{
          default:123
		}
		
2.分别暴露
	暴露语法:
		export const a = 666;
		export const b = 666;
		
	引入:
		-import {a} from '文件路径'
		-import * as data from '文件路径'
		
3.统一暴露
	暴露语法:export {
      a:1,
      b:2
	}
	
4.升级版本语法
	export { default as home} from './modules/home';
	等同于:
		import home from './modules/home';
		export const home = home;
```

# 2.computed和watch的区别

```
1.相同点
	1.他们的基础使用方法几乎相同
		都是对象内部嵌套多个方法
		
	2.他们都可以监视某个数据的变化
		当watch监视的数据发生变化的时候,会自动执行回调函数
		当computed监视的数据发生变化的时候,会自动执行回调函数
		
2.不同点
	1.返回值效果不同
		watch的返回值没有作用
		computed的返回值具有作用,可以用于js代码计算或者template模版展示
		
	2.使用场景
		computed
			我现在需要一个数据,可惜我手头没有,不过我可以根据现有的数据计算得到
				那么我就会使用computed
				
				例如:购物车的总价/总数等功能
					我想要购物车中选中商品的总数量,但是我服务器没返回
					不过我们可以通过现在的购物车数组进行计算得到
			
		watch
			当某个数据发生变化的时候,我想要做一些事情(代码)
				那么我就会使用watch
				
				例如:搜索界面的关键字搜索功能
					当用户搜索的关键字发生变化的时候,我们需要请求最新的数据
					
		小总结:watch更注重于过程,computed更注重于结果
	
	3.缓存
		watch不存在缓存这个事情
		computed在第一次使用的时候肯定会执行一次回调函数,计算出最终的结果进行展示
			如果后续再次使用到同一个computed,如果他监视的数据没有发生变化,对应的回调函数就不会再次执行
				会自动复用上一次计算的结果
```

