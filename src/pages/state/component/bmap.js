
/* eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}] */
export default {
  init: function () {
    console.log('初始化百度地图脚本...')
    const AK = 'isd5DevdbUoqhEtuXa4HVd0HmyQO4XXS'
    const apiVersion = '2.0'
    const BMapURL = 'http://api.map.baidu.com/getscript?v=' + apiVersion + '&ak=' + AK
    const BMapLibURL = 'http://api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js'
    return new Promise((resolve, reject) => {
      if (typeof BMap !== 'undefined') {
        resolve(window.BMap)
        return true
      }
      // 插入script脚本
      const scriptNode = document.createElement('script')
      scriptNode.setAttribute('type', 'text/javascript')
      scriptNode.setAttribute('src', BMapURL)
      document.body.appendChild(scriptNode)

      const scriptNodeF = document.createElement('script')
      scriptNodeF.setAttribute('type', 'text/javascript')
      scriptNodeF.setAttribute('src', BMapLibURL)
      document.body.appendChild(scriptNodeF)
      // 等待页面加载完毕回调
      let timeout = 0
      let interval = setInterval(() => {
        // 超时10秒加载失败
        if (timeout >= 20) {
          reject()
          clearInterval(interval)
          console.error('地图脚本初始化失败...')
        }
        // 加载成功
        if (typeof BMap !== 'undefined') {
          resolve(window.BMap)
          clearInterval(interval)
          console.log('地图脚本初始化成功...')
        }
        timeout += 1
      }, 500)
    })
  }
}
