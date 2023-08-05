export default {
  data() {
    return {
      pageX: 0,
      pageY: 0,
    };
  },
  methods: {
    handler(event) {
      // console.log(e)
      const { clientX, clientY } = event;
      this.pageX = clientX;
      this.pageY = clientY;
    },
  },
  mounted() {
    document.addEventListener("mousemove", this.handler);
  },
  // mixins:[testMixin]
  /*
        需求:当用户鼠标移动的时候,在页面上展示当前鼠标的坐标
        拆解:
          1.当用户鼠标移动的时候
            绑定相关事件监听
              事件名:mousemove
              事件源:document
    
          2.如何获取到当前鼠标的坐标信息?
            通过event可以获取到当前最新的坐标信息
    
          3.得到坐标信息之后,如何显示在页面上
            将对应的坐标数据更新到data中,Vue就会自动更新页面显示
      */
};
