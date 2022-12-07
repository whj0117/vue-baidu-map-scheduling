<!--
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-07 11:14:55
 * @LastEditTime: 2022-12-07 16:53:22
 * @LastEditors:  
-->
<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './view/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}

#app{
  width: 100vw;
  height: 100vh;
}
</style>
