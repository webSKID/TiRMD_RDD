
import axios from 'axios'
import eaf from '@/assets/js/eaf'
import router from '../../router'

// 给axios添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // 接口返回报错且错误代码以'ERR_001'开头
  if (response.data.EAF_ERROR) {
    if (response.data.EAF_ERROR.startsWith('ERR_001')) {
      // 重定向到登录页
      router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}// 登录成功后跳入浏览的当前页面
      })
    } else {
      window.$layer.alert(response.data.EAF_ERROR)
    }
  } else {
    return response
  }
}, function (error) {
  router.replace({
    path: '/login',
    query: {redirect: router.currentRoute.fullPath}// 登录成功后跳入浏览的当前页面
  })
  return Promise.reject(error)
})

function AgentClass () {

}
AgentClass.prototype = {

  /**
	* @desc:封装请求完整"细表"数据
	* @param:taskFramePN 业务序列名
	* @param:command     函数名
	* @param:params      参数数组
	* @return:response
	* @author: LeBron-si 20190326
	*/
  askToServer: function (taskFramePN, command, params) {
    const url = eaf.getObjsToFrameUrl(taskFramePN, command)
    return axios.post(url, params).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  },

  /**
	* @desc:封装请求"细表"中以variableName为键的值数据
	* @param:taskFramePN 业务序列名
	* @param:command     函数名
	* @param:variableName细表键名
	* @param:params      参数数组
	* @return:response
	* @author: LeBron-si 20190326
	*/
  askMasterToServer: function (taskFramePN, command, variableName, params) {
    const url = eaf.getFrameUrl(taskFramePN, command, variableName)
    return axios.post(url, params).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  },

  /**
	* @desc:封装自传平台url请求平台方法
	* @param:url         请求url
	* @param:params      参数数组
	* @return:response
	* @author: LeBron-si 20190326
	*/
  askToServerByUrl: function (url, params) {
    return axios.post(url, params).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
}
let agent = new AgentClass()

export default agent
