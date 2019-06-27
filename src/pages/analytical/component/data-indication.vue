<template>
    <div class='info'>
    <template v-if='hidden'>
        <div class='charts' id="data-indication"></div>
     </template>
    </div>
</template>

<script>
import manba from 'manba'
import echarts from 'echarts'
export default {
  computed: {
    getGapTime () {
      return this.$store.getters.getGapTime
    },
    getDataItems () {
      return this.$store.getters.getDataItems
    }
  },
  watch: {
    getGapTime (val) {
      if (val && val.length !== 0) {
        this.hidden = true
        setTimeout(() => {
          this.initChart(val)
        }, 100)
      } else {
        this.hidden = false
      }
    }
  },
  data () {
    return {
      hidden: false
    }
  },
  methods: {
    getDate (params) {
      let time = manba(params).format('YYYY-MM-DD h:mm:ss')
      // let time = new Date(parseInt(tm)).toLocaleString()
      return time
    },
    renderItem (params, api) {
      let categoryIndex = api.value(0)
      let start = api.coord([api.value(1), categoryIndex])
      let end = api.coord([api.value(2), categoryIndex])
      let height = api.size([0, 1])[1] * 0.7
      return {
        type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
        shape: echarts.graphic.clipRectByRect({
          // 矩形的位置和大小。
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height
        }, {
          // 当前坐标系的包围盒。
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        }),
        style: api.style(),
        styleEmphasis: api.styleEmphasis()
      }
    },
    getData (items) {
      let cdata = items
      let data = []
      let color = '#32A3A7' // 填充颜色
      let emphasisColor = '#1AF4B8' // 鼠标滑入颜色
      for (let i = 0; i < cdata.length; i++) {
        data.push({
          value: [
            0,
            cdata[i].startTime,
            cdata[i].endTime,
            cdata[i].endTime - cdata[i].startTime
          ],
          itemStyle: {
            normal: {
              color: color
            },
            emphasis: {
              color: emphasisColor
            }
          }
        })
      }
      return data
    },
    initChart (items) {
      let self = this
      let option = {
        grid: {
          height: 30,
          top: 10,
          left: 35,
          bottom: 0,
          right: 35
        },
        tooltip: {
          show: true,
          borderWidth: 5,
          borderColor: '#f0f3f8', // 边框颜色
          backgroundColor: 'rgba(255, 255, 255, 1)', // 背景颜色
          textStyle: {
            color: '#1f4e56'
          },
          formatter: function (value, index) {
            return '起：' + self.getDate(value.value[1]) + '<br/>' + '止：' + self.getDate(value.value[2])
          }
        },
        xAxis: [
	        {
	            type: 'time',
	            axisLabel: {
	                show: true,
	                textStyle: {color: '#7B9095'},
	                formatter: function (value, index) {
	                    var val = self.getDate(value)
	                    return val.split(' ')[1] + '\n' + val.split(' ')[0]
	                }
	            },
	            axisLine: {lineStyle: {color: '#7B9095'}}, // x轴的颜色
	            axisTick: {lineStyle: {color: '#7B9095'}, alignWithLabel: true},
	            splitNumber: 17,
	            splitLine: {show: false}
	        }
        ],
        yAxis: {
          data: 'd',
          axisLabel: {show: false},
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {
            show: true,
            lineStyle: {color: '#265d7f'}
          }
        },
        series: [{
          type: 'custom',
          renderItem: self.renderItem,
          encode: {
            x: [1, 2],
            y: 0
          },
          data: self.getData(items)
        }]
      }
      let myChart = echarts.init(document.getElementById('data-indication'))
      myChart.clear()
      myChart.setOption(option)
      window.onresize = myChart.resize
      myChart.off('click')
      myChart.on('click', function (params) {
        if (!self.getDataItems || self.getDataItems.length === 0) {
          self.$layer.alert('请选择数据项!')
          return
        }
        let startTime = manba(params.value[1]).format('YYYY-MM-DD h:mm:ss')
        let endTime = manba(params.value[2]).format('YYYY-MM-DD h:mm:ss')
        self.$store.commit('setGapTimeStartEnd', [startTime, endTime])
      })
    }
  },
  mounted () {
    // this.initChart()
  }
}
</script>

<style lang="scss" scoped>
.info{
    width:100%;
    height:100%;
    background-color:#fff;
    .charts{
        width:100%;
        height:70px;
        margin:10px 0
    }
}
</style>
