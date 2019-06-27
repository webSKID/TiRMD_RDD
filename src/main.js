// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import './theme/element/index.css'
import layer from 'vue-layer'
// vue-easytable的样式
import 'vue-easytable/libs/themes-base/index.css'
import {VTable, VPagination} from 'vue-easytable'
// 字体图标
import '@/assets/icon/iconfont.js'
import VueInputAutowidth from 'vue-input-autowidth'
// highcharts
import Highcharts from 'highcharts'
// hightopo
import '@/api/ht.js'
Vue.prototype.$ht = window.ht
Vue.prototype.$htconfig = window.htconfig

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(VueInputAutowidth)
// vue-easytable注册到全局
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

// layer弹出窗
window.$layer = Vue.prototype.$layer = layer(Vue)

// Vue.use(Highcharts)
Vue.prototype.Highcharts = Highcharts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  // 获取store里面的token
  let token = Boolean(store.state.user.token)
  if (to.fullPath !== '/login') {
    if (token) {
      if (to.matched.length === 0) {
        next({path: from.fullPath})
      } else {
        next()
      }
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    store.commit('removeUser')
    next()
  }
})
