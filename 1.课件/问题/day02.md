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

