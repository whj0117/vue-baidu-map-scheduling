/*
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-07 11:14:55
 * @LastEditTime: 2022-12-07 12:48:24
 * @LastEditors:  
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BaiduMap from 'vue-baidu-map'
import App from './App.vue'

Vue.use(ElementUI)

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '2GwmlGt5SX6IhRv7Qu61WHsGHERrqYBF'
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
