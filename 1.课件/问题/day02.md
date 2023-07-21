# 1.面试题:使用编程式导航重复跳转某个路由,出现报错如何解决?

```javascript
/*
        重复跳转会出现报错
          官方原因:重复跳转到同一个路由地址,跳转冗余
          实际原因:返回Promise对象变为了失败状态,所以导致控制台出现报错
      */
      // const result = this.$router.push('/search');
      // this.$router.replace('/search');

      // console.log(result)

      //解决报错第一种方法
      // .catch方法其实是一个语法糖(新的语法,简化用户操作,实际上还是用的旧的东西)
      //  .catch方法,其实是.then方法的语法糖
      // .catch方法专门用于捕获promise对象出现的报错,需要传入一个回调函数
      // result.catch((error)=>{
      //   console.log('跳转出错了')
      // })

      //解决报错第二种方法
      // .then方法一共接收两个回调函数,第一个是成功回调函数,第二个是失败回调函数
      // 当被监视的promise状态变为成功,就会自动执行第一个回调函数
      // 当被监视的promise状态变为失败,就会自动执行第二个回调函数
      // result.then(
      //   ()=>{
      //     console.log('跳转成功')
      //   },
      //   ()=>{
      //     console.log('跳转失败')
      //   }
      // )

      // 以下写法其实就是.catch方法的原理
      // result.then(
      //   null,
      //   ()=>{
      //     console.log('跳转失败')
      //   }
      // )

      // 解决报错第三种方法
      // const result = this.$router.push(
      //   '/search',
      //   () => {
      //     console.log('成功跳转')
      //   },
      //   () => {
      //     console.log('捕获到失败的跳转')
      //   }
      // );

      // 可以只传入捕获失败的回调函数
      // const result = this.$router.push(
      //   '/search',
      //   null,
      //   () => {
      //     console.log('捕获到失败的跳转')
      //   }
      // );

      // 即便不传入失败的回调函数,底层也会自动解决该报错
      const result = this.$router.push(
        '/search',
        () => {
          console.log('跳转成功')
        }
      );
```

# 2.hash模式和history模式的区别

```
hash模式
	最直接的表现就是路径中带有#
	原理:其实是使用的是浏览器的锚点功能
		所以浏览器知道锚点是给浏览器使用的,刷新当前地址,不会将hash路由发给后端
		例如:
			当前地址是http://localhost:8080/#/test
			实际发给服务器的地址http://localhost:8080/
	
history模式
	最直接的表现就是路径中没有#
	原理:使用了HTML5的新特性,history对象来实现对浏览器历史记录栈的控制
		重要BUG:只要用户在某个路由地址下刷新当前页面,浏览器就会将前端路由发给服务器,导致项目无法展示
		例如:
			当前地址是http://localhost:8080/test
			实际发给服务器的地址http://localhost:8080/test
```

# 3.跨域相关知识

```
问题1:请问什么是跨域?
回答:违反了浏览器的同源策略

问题2:什么是同源?
回答:两个URL的协议名,域名和端口号都相同,说明这两个URL是同源的

问题3:请问一个URL的由哪几部分组成?
回答:
	http://www.baidu.com:80/home?username=xiaoming
	http是协议名
	www.baidu.com是域名
	80是端口号
	/home?username=xiaoming是查询字符串
		由接口地址以及请求参数组合而成
		
问题4:为什么要有同源策略?
回答:浏览器保护用户数据的一种手段

问题5:请问跨域是否一定会报错?
回答:
	不一定
	服务器之间没有跨域报错
	script/link/img/video/audio等标签,请求跨域资源不会报错
	小总结:跨域是一种行为,它不一定会带来严重的后果
	
问题6:什么情况下,会出现跨域报错?
回答:只有发送ajax请求的时候才会报跨域错误

问题7:为什么要使用axios/ajax?
回答:可以使用他们去发送请求

问题8:为什么要发请求?
回答:因为我们的项目是前后端分离项目,前端只负责项目的运行代码,后端负责数据的存储和传递
	所以我们需要请求后端的数据
	
问题9:如何解决跨域报错?
回答:
	1.jsonp
	2.CORS
	3.proxy
		
```

