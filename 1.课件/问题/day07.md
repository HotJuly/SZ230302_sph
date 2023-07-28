# 1.关于项目的相对路径以及绝对路径问题

```
相对路径
	会根据当前的路径进行拼接,获得一个新的路径
		比较灵活,可能会随着使用的位置不同,得到不同的结果
		
绝对路径
	会参考当前项目的根路径进行拼接,获取一个新的路径
		比较稳定,无论在哪个位置使用,得到的都是同一个结果
		
		
hash模式下,就没有该BUG
	原因:因为在浏览器眼里,所谓的hash路由地址,其实就是个锚点,所以无论用户处于任何一个hash路由下,
		浏览器都以为你一直都在http://localhost:8080/根路径下
		所以此时
			"/css/reset.css"该路径的请求地址为
				http://localhost:8080/css/reset.css
				
			"./css/reset.css"该路径的请求地址为
				http://localhost:8080/css/reset.css
				
history模式下,就会出现bug
	原因:因为浏览器分辨不清楚,当前这类history路由地址,是前端路由还是后端路由
		所以如果用户在http://localhost:8080/detail/2下刷新页面
			那么浏览器就会认为,用户正处于http://localhost:8080/detail/该地址下
		所以此时
			"/css/reset.css"该路径的请求地址为
				http://localhost:8080/css/reset.css
				
			"./css/reset.css"该路径的请求地址为
				http://localhost:8080/detail/css/reset.css
				
				
总结:所以为了防止项目出现不一样的麻烦,建议项目中所有加载资源的地址都写为绝对路径
```

