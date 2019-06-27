import BauduMap from '@/pages/state/component/bmap.js'

// 自定义覆盖物
function BusUnclickedOverlay (point, opt) {
  this._opt = opt
  this._point = point
}
BauduMap.init().then(BMap => {
  BusUnclickedOverlay.prototype = new BMap.Overlay() // 继承百度地图提供的覆盖物的类

  BusUnclickedOverlay.prototype.initialize = function (map) {
    this._map = map
    var div = this._div = document.createElement('div')
    div.className = 'angle'
    div.style.position = 'absolute'
    // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
    div.style.height = this._opt.height + 'px' || '70px'
    div.style.width = this._opt.width + 'px' || '150px'
    div.style.lineHeight = this._opt.height + 'px' || '70px'
    div.style.textAlign = 'center'
    div.style.background = this._opt.background || 'rgba(255,255,255,.5)'
    div.style.color = this._opt.color || '#ffffff'
    div.style.borderRadius = '6px'
    div.style.display = this._opt.display || 'none'
    div.appendChild(this._opt.content)

    map.getPanes().labelPane.appendChild(div) // 将自定义窗口插入到地图样式内部，从而达到覆盖默认样式的效果

    return div
  }

  BusUnclickedOverlay.prototype.draw = function () {
    var map = this._map
    var pixel = map.pointToOverlayPixel(this._point)
    this._div.style.left = pixel.x - 90 + 'px' // 控制这个信息窗口针对标注物原点的偏移量，这也是前面div要设置样式position:absolute;
    this._div.style.top = pixel.y - this._opt.height - 40 + 'px'
  }
  // 实现显示方法
  BusUnclickedOverlay.prototype.show = function () {
    if (this._div) {
      this._div.style.display = ''
    }
  }
  // 实现隐藏方法
  BusUnclickedOverlay.prototype.hide = function () {
    if (this._div) {
      this._div.style.display = 'none'
    }
  }
  // 添加自定义方法
  BusUnclickedOverlay.prototype.toggle = function () {
    if (this._div) {
      if (this._div.style.display === '') {
        this.hide()
      } else {
        this.show()
      }
    }
  }
})
export default BusUnclickedOverlay
