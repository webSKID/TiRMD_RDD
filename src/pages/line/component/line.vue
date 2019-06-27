<template>
<ul class='line-ul'>
    <li v-for='(item,index) in lineData' :nowShow='defaultShow(item.EAF_ID)' :style='{backgroundColor:defaultClick(item.EAF_ID,item.BOM_MAIN_COLOR)}' :key='index'>
        <p href='javascript:;' :id='item.EAF_ID' v-bind:style='{borderColor:item.BOM_MAIN_COLOR}' @mouseenter='enterBg' @mouseleave='leaveBg' @click='clickBg'>{{item.EAF_NAME}}</p>
    </li>
</ul>
</template>

<script>
export default {
  name: 'my-line',
  props: {
    lineData: {
      type: Array,
      default: function () {
        return []
      }
    },
    defSel: {
      type: String
    }// 默认选中线路
  },
  data () {
    return {
      lines: this.lineData,
      defSelLine: this.defSel,
      message: ''
    }
  },
  methods: {
    enterBg (dom) { // 鼠标移入改变背景色
      var btmColor = dom.target.style.borderColor
      dom.target.parentNode.style.backgroundColor = this.colorRgb(btmColor)
    },
    leaveBg (dom) { // 鼠标移出改变背景色
      if (dom.target.parentNode.getAttribute('nowShow') === '0') {
        dom.target.parentNode.style.backgroundColor = ''
      }
    },
    clickBg (dom) { // 点击时改变背景色\
      var newLineId = dom.target.id
      var childs = dom.target.parentNode.parentNode.childNodes
      for (var i = 0; i < childs.length; i++) { // 所有线路背景色置空
        childs[i].setAttribute('nowShow', '0')
        childs[i].style.backgroundColor = ''
      }
      var btmColor = dom.target.style.borderColor// 获得当前点击节点的border颜色
      // 当前点击节点背景色改变
      dom.target.parentNode.style.backgroundColor = this.colorRgb(btmColor)

      dom.target.parentNode.setAttribute('nowShow', '1')
      // 更新父组件线路id
      this.$emit('update:defSel', newLineId)
      // 点击线路时往父组件传值
      this.$emit('message', newLineId)
    },
    colorRgb (clo) { // 颜色值转换为rgba
      var sColor = clo.toLowerCase()
      // 十六进制颜色值的正则表达式
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
      var sColorChange = []
      // 如果是16进制颜色
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = '#'
          for (var i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        // 处理六位的颜色值

        for (let i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }
        sColorChange.push(0.4)
        return 'RGBA(' + sColorChange.join(',') + ')'
      } else {
        // 十六进制颜色值的正则表达式
        sColorChange = sColor.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
        sColorChange.push(0.4)
        var newColor = 'RGBA(' + sColorChange.join(',') + ')'
        return newColor
      }
    },
    defaultClick ($id, $color) { // 默认线路颜色
      if ($id === this.defSelLine) {
        var selColor = this.colorRgb($color)
        return selColor
      } else return ''
    },
    defaultShow ($id) {
      if ($id === this.defSelLine) {
        return 1
      } else return 0
    }
  }
}

</script>

<style lang="scss" scoped>
/*线路组件样式*/
ul.line-ul {
    width: 96%;
    display: flex;
    flex-wrap: wrap;
}

ul.line-ul > li {
    float: left;
    display: flex;
    flex-direction: column;
}

ul.line-ul > li > p {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-bottom-width: 5px;
    border-bottom-style: solid;
    border-color: transparent;
    color: #fff;
}

ul.line-ul > li:hover {
    font-weight: 700;
    cursor: pointer;
}
</style>
