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

