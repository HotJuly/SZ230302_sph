# 1.做项目是否遇到过程序宕机的情况

```
1.全局事件总线不解绑,导致事件遗留
	那么回调函数就没办法正常销毁,会继续占用内存
	
2.定时器没有及时关闭,导致定时器遗留
	那么回调函数就没办法正常销毁,会继续占用内存
	
3.闭包没有及时释放,导致变量数据遗留
	那么闭包中保存的数据会无法正常销毁,会继续占用内存
	
4.使用了太多的全局变量,导致数据遗留
	因为window对象不会销毁,而全局变量虽然不一定使用它内部的数据,但是也不会销毁
```

# 2.localStorage,sessionStorage和cookie的区别

```
1.生命周期
	cookie
		具有max-age属性(最大存活时间)
			存入内部的数据,只要没有超过最大存活时间,就会永久保留
		不具有max-age属性
			这类cookie称为会话级cookie,如果用户关闭标签页或者浏览器,数据就会丢失
	localStorage(持久化存储)
		存入内部的数据,只要用户不主动删除,就会永久保留
	sessionStorage(会话级存储)
		存入内部的数据,如果用户关闭当前标签页或者关闭浏览器,就会丢失
		
2.存储位置
	cookie
		具有max-age属性(最大存活时间)
			存储于硬盘中
		不具有max-age属性
			存储于内存中
	localStorage(持久化存储)
		存储于硬盘中
	sessionStorage(会话级存储)
		存储于内存中
		
3.存储大小
	cookie->4KB
	localStorage(持久化存储)->一般是5MB,除了垃圾IE以外,他是3012KB
	sessionStorage(会话级存储)->一般是5MB,除了垃圾IE以外,他是3012KB
	
4.作用范围
	cookie
		cookie的作用范围受到两个属性的控制
			domain属性
				例如:domain=".baidu.com"
				意思就是当前cookie只有该域名以及他的子域名可以读取
			path属性
				例如:path="/a"
				意思就是当前的cookie只有该路由和他的子路由可以读取
			总结:儿子可以访问父亲的,父亲不能范围儿子的
			
	localStorage(持久化存储)
		只要域名相同,哪怕是不同的标签页,才可以共享同一份的localStorage数据
		
	sessionStorage(会话级存储)
		只有相同的域名才能读取到对应的sessionStorage数据
			注意:不能跨标签页通信
		扩展:虽然通过复制标签页,可以获取对方的sessionStorage数据,但实际上是深拷贝版本,数据是两份,不会共享
		
5.与服务器之间的关系
	cookie(被借用的本地存储)
		cookie由服务器创建,浏览器存储
		浏览器会自动接收存储cookie,还会自动发送cookie
		服务器如果想要返回cookie数据给前端,那么就会在响应头中,添加属性set-Cookie用于返回数据
		浏览器如果想要发送cookie数据给服务器,那么就会在请求中,添加属性Cookie用于发送数据
	localStorage(持久化存储)
		他是HTML5新特性,与服务器不熟
	sessionStorage(会话级存储)
		他是HTML5新特性,与服务器不熟
		
6.使用场景
	cookie(被借用的本地存储)
		个人认为,它可以节省服务器的成本
	localStorage(持久化存储)
		如果有一个数据,关闭项目之后,以后还要使用,就选择使用localStorage存储
	sessionStorage(会话级存储)
		如果有一个数据,本次项目关闭之前需要使用,下次不用的数据,就选择使用sessionStorage存储
			因为他的计算数据远比localStorage快
```

