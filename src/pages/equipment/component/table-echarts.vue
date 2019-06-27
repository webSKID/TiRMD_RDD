<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <div :id="chartId" :style="{width:(domW-30)+'px',height:(domH-60)+'px'}"></div>
        <div>X:{{chartX}}</div>
        <div>Y:{{chartY}}</div>
    </div>
</template>
<script>
let echarts = require('echarts')
export default{
  props: {
    chartId: {
      type: String
    },
    domW: {
      type: Number
    },
    domH: {
      type: Number
    },
    x: {
      type: String
    },
    y: {
      type: String
    },
    layerid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chartX: [],
      chartY: [],
      loading: true
    }
  },
  methods: {
    darwLine () {
      let myChart = echarts.init(document.getElementById(this.chartId))

      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.chartY,
          type: 'line'
        }]
      })
      this.loading = false
    }
  },
  mounted () {
    let self = this
    self.chartX = JSON.parse(self.x)
    self.chartY = JSON.parse(self.y)
    setTimeout(function () {
      self.darwLine()
    }, 400)
  }
}
</script>>
