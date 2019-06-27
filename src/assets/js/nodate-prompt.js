// import $ from 'jquery'
var DataTootip = function (options) {

}
DataTootip.prototype = {
  create: function (id, text) {
    // let $div = $('<div><span></span></div>')
    // $div.find('span').text(text)
    // $div.attr({ class: 'datatip' })
    // $div.css({
    //   position: 'absolute',
    //   width: '100%',
    //   height: '100%',
    //   // background:"rgba(8,76,79,.8)",
    //   top: '0',
    //   left: '0',
    //   fontSize: '14px',
    //   color: 'rgb(102, 102, 102,.5)',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   fontWeight: '700',
    //   zIndex: 0
    // })
    // $('#' + id).css({ position: 'relative' })

    // $('#' + id).append($div)

    let div = document.createElement('div')
    div.innerHTML = `<span>${text}</span>`
    div.setAttribute('class', 'datatip')
    div.style.cssText = 'position:absolute;width:100%;height:100%;top:0;left:0;font-size:14px;color:rgba(102, 102, 102,.5);display:flex;align-items:center;justify-content:center;font-weight:700;z-index:0'

    document.getElementById(id).style.position = 'relative'
    document.getElementById(id).appendChild(div)
  },
  hideTootip: function (id) {
    // $('#' + id).find('.datatip').remove()
    var node = document.getElementById(id)
    var childs = node.childNodes
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].className && childs[i].className.indexOf('datatip') > -1) {
        node.removeChild(childs[i])
      }
    }
  },
  initTootip: function (id, text) {
    var option = text || '暂无符合查询条件的数据'
    this.create(id, option)
  }
}

var dataTootip = new DataTootip()

export default dataTootip
