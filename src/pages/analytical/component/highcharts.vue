<template>
    <div class="charts-container">
        <!-- 图表容器 -->
        <div class="icon-container">
          <span :title="rulesTitle" @click="yaxisChange" id="rules" class="hide">
            <svg class="icon" aria-hidden="true" title="多标尺">
              <use :xlink:href="iconRules"></use>
            </svg>
          </span>
          <span :title="lineTitle" @click="detachEcharts" id="lines" class="hide">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="iconLine"></use>
            </svg>
          </span>
        </div>
        <!-- 主图表容器 -->
        <div class="main" id="main"></div>
        <!-- 分发图容器 -->
        <div class="detach-chart" id="detach-chart"> </div>
    </div>
</template>
<script>
import noData from '@/assets/js/nodate-prompt'
// import { mapState } from 'vuex'
export default{
  name: 'highcharts',
  props: {
    message: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      rulesTitle: '多标尺',
      lineTitle: '分离图表',
      iconRules: '#icon-double-biaochi-copy',
      iconLine: '#icon-double-line',
      echartObj: {}, // 图表要存放的数据
      switchType: 'only', // 单/多标尺标识
      echartsData: [] // 给echarts图的数据
    }
  },
  computed: {
    // resultData () {
    //   return this.$store.state.analytical.dataAnalysis.chartData
    // },
    // ...mapState({
    //   resultData: state => state.analytical.dataAnalysis.chartData
    // }),
    attrNames () {
      return this.$store.getters.getDataItemsName
    }
  },
  watch: {
    // resultData (value) {
    //   if (value && value.length !== 0) {
    //     this.initChartData(value)
    //   } else {
    //     noData.hideTootip('main')// 先隐藏无数据提示
    //     noData.initTootip('main')// 显示无数据提示
    //   }
    // },
    message: {
      handler (newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          if (oldValue[i] !== newValue[i]) {
            console.log(newValue)
            if (newValue && newValue.length !== 0) {
              this.initChartData(newValue)
            } else {
              noData.hideTootip('main')// 先隐藏无数据提示
              noData.initTootip('main')// 显示无数据提示
            }
            return null
          }
        }
      },
      deep: true
    }
  },
  methods: {
    initChartData (res) {
      // 点击查询时销毁上一次的图表实例,不然会对象实例会累计
      if (this.Highcharts.charts.length > 0) {
        for (let n = 0; n < this.Highcharts.charts.length; n++) {
          if (this.Highcharts.charts[n]) {
            this.Highcharts.charts[n].destroy()
          }
        }
      }
      this.echartsData = []// 清空上次查询结果存储的值
      let result = res

      document.getElementById('main').classList.remove('hide')
      document.getElementById('detach-chart').classList.add('hide')
      document.getElementById('rules').classList.add('hide') // 隐藏单/多标尺
      document.getElementById('lines').classList.add('hide') // 隐藏合并分离图表
      this.iconLine = '#icon-double-line'
      this.lineTitle = '分离图表'

      // 判断如果只有一个变量，则隐藏图标
      if (result.length > 1) {
        document.getElementById('rules').classList.remove('hide') // 显示单/多标尺
        document.getElementById('lines').classList.remove('hide') // 显示合并分离图表
      }
      // 遍历数据 将数据放入需要展示的控件数据中
      for (let j = 0; j < result.length; j++) {
        let bomValueArr = []
        let perrow = result[j].values// 图表数据
        if (perrow.length > 0) {
          for (let k = 0; k < perrow.length; k++) {
            let collectTime = perrow[k][0]
            let timeInt = parseInt(collectTime, 10)
            let collectDate = new Date(timeInt)
            let millSec = collectDate.getMilliseconds()
            let year = collectDate.getFullYear()
            let month = collectDate.getMonth() + 1
            let day = collectDate.getDate()
            let hou = collectDate.getHours()
            let min = collectDate.getMinutes()
            let sec = collectDate.getSeconds()
            let time = this.standTime(year) + '-' + this.standTime(month) + '-' + this.standTime(day) + '\n' +
                            this.standTime(hou) + ':' + this.standTime(min) + ':' + this.standTime(sec) + '.' + millSec
            let perChartValue = {
              name: time,
              value: perrow[k]
            }
            bomValueArr.push(perChartValue)
          }
        } else {
          let perChartValue = {
            name: 0,
            value: 0
          }
          bomValueArr.push(perChartValue)
        }
        this.echartsData.push(bomValueArr)
      }
      if (this.echartsData.length !== 0) {
        // 调用echarts绘制函数,传入参数
        let obj = {
          total: result.length, // 数据总数
          main: result.length, // 是否是总图表
          yName: this.attrNames, // 纵坐标名字数组
          echartsData: this.echartsData // 数据
        }
        this.echartObj = obj
        // 绘制Hcharts图
        this.drawLineEcharts('main', obj)
      } else {
        // 没有数据
        noData.hideTootip('main')// 先隐藏无数据提示
        noData.initTootip('main')// 显示无数据提示
      }
    },
    // 绘制highcharts图
    drawLineEcharts (id, res) {
      // 数据总数
      let total = res.total
      let nameAttr = res.yName
      // 配置项
      let colors = ['#0198cd', '#ff9801', '#ff3334', '#fdd310', '#e3a000', '#d77900', '#ff6c00', '#d13600', '#f77366', '#c7ff4e', '#fff94e']
      for (var j = 0; j < total; j++) {
        colors.push(this.generateColor())
      }
      let seriesArray = []
      let yAxisArray = []
      let chartObj
      let yAxisIndex = res.echartsData.length - 1
      // y坐标数据
      for (let j in res.echartsData) {
        let yData = []
        for (let i in res.echartsData[j]) {
          yData.push(res.echartsData[j][i].value)
        }

        if (this.switchType === 'only') {
          if (res.legendFlag) {
            seriesArray.push({
              // name: nameAttr[j] + res.legendTitle,
              name: nameAttr[j],
              data: yData
            })
          } else {
            seriesArray.push({
              // name: nameAttr[j] + this.bomUnit[j],
              name: nameAttr[j],
              data: yData
            })
          }
	        yAxisIndex--

          if (id === 'main' && res.main === 2) { // 单图表
            chartObj = {
              zoomType: 'x', // 缩放类型，值可以是 “x”、“y”、“xy”，分别表示水平缩放、竖直缩放、平面缩放
              backgroundColor: 'rgba(0,0,0,0)',
              resetZoomButton: {
                position: {
                  align: 'left',
                  verticalAlign: 'bottom',
                  x: -10,
                  y: 40
                }
              }
            }
            yAxisArray = [{
              gridLineColor: '#7b9095',
              gridLineDashStyle: 'longdash',
              labels: {
                style: {
                  color: '#204c55'
                }
              },
              title: {
                style: {
                  color: '#7b9095'
                },
                text: '  '
              }

            }]
          } else if (id === 'main' && res.main > 2) {
            chartObj = {
              zoomType: 'x', // 缩放类型，值可以是 “x”、“y”、“xy”，分别表示水平缩放、竖直缩放、平面缩放
              backgroundColor: 'rgba(0,0,0,0)',
              resetZoomButton: {
                position: {
                  align: 'left',
                  verticalAlign: 'bottom',
                  x: -10,
                  y: 40
                }
              }
            }
            yAxisArray = [{
              gridLineColor: '#7b9095',
              gridLineDashStyle: 'longdash',
              labels: {
                style: {
                  color: '#204c55'
                }
              },
              title: {
                style: {
                  color: '#7b9095'
                },
                text: '  '
              }
            }]
          } else { // 多图表
            chartObj = {
              zoomType: 'x', // 缩放类型，值可以是 “x”、“y”、“xy”，分别表示水平缩放、竖直缩放、平面缩放
              backgroundColor: 'rgba(0,0,0,0)',
              resetZoomButton: {
                position: {
                  align: 'left',
                  verticalAlign: 'bottom',
                  x: -10,
                  y: 40
                }
              }
            }
            yAxisArray = [{
              gridLineColor: '#7b9095',
              gridLineDashStyle: 'longdash',
              labels: {
                style: {
                  color: '#204c55'
                }
              },
              title: {
                style: {
                  color: '#7b9095'
                },
                text: '  '
              }
            }]
          }
        } else {
          if (res.legendFlag) {
            seriesArray.push({
              // name: nameAttr[j] + res.legendTitle,
              name: nameAttr[j],
              yAxis: yAxisIndex,
              data: yData
            })
          } else {
            seriesArray.push({
              // name: nameAttr[j] + this.bomUnit[j],
              name: nameAttr[j],
              yAxis: yAxisIndex,
              data: yData
            })
          }

          let yAxis = {
            gridLineColor: '#7b9095',
            gridLineDashStyle: 'longdash',
            labels: {
              style: {
                color: '#204c55'
              }
            },
            tickColor: '#7b9095',
            tickWidth: 1,
            lineWidth: 2,
            lineColor: colors[yAxisIndex],
            title: {
              style: {
                color: '#7b9095'
              },
              text: '  '
            }
	        }
        	yAxisArray.push(yAxis)
        	yAxisIndex--
        }
      }
      this.Highcharts.setOptions({
        global: {useUTC: false}, // 关闭默认世界时区
        // 将reset Zoom修改为汉字重置比例
        lang: {
          resetZoom: '重置比例',
          resetZoomTitle: '重置比例'
        }
      })
      this.Highcharts.chart(id, {
        colors: colors,
        chart: chartObj || {
          zoomType: 'x', // 缩放类型，值可以是 “x”、“y”、“xy”，分别表示水平缩放、竖直缩放、平面缩放
          backgroundColor: 'rgba(0,0,0,0)',
          resetZoomButton: {
            position: {
              align: 'left',
              verticalAlign: 'bottom',
              x: -10,
              y: 40
            }
          }
        },
        title: {// 标题
          text: '', // 标题的文字
          style: {// 文字样式，可以设置文字颜色、字体、字号
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '20px'
          }
        },
        subtitle: {
          text: document.ontouchstart === undefined ? '鼠标拖动可以进行缩放' : '手势操作进行缩放',
          style: {
            color: '#48BEC1',
            textTransform: 'uppercase'
          }
        },
        xAxis: {
          type: 'datetime',
          crosshair: {
            color: '#FAFC1F'
          },
          dateTimeLabelFormats: {
            day: '%Y-%m-%d'
          },
          // min: new Date(this.getNowFormatDate(new Date(this.date[0]))).getTime(),
          // max: new Date(this.getNowFormatDate(new Date(this.date[1]))).getTime(),
          labels: {
            style: {
              color: '#204c55'
            }
          },
          lineColor: '#7b9095',
          tickColor: '#7b9095'
        },
        yAxis: yAxisArray,
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%Y-%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          },
          backgroundColor: 'rgba(255, 255, 255, 1)', // 背景颜色
          borderColor: '#f0f3f8', // 边框颜色
          borderWidth: 5, // 边框宽度
          style: {
            color: '#1f4e56'
          },
          shared: true
        },
        legend: {
          itemStyle: {
            color: '#000'
          },
          itemHoverStyle: {
            color: '#ccc'
          },
          itemHiddenStyle: {
            color: '#606063'
          }
        },
        credits: {
          enabled: false // 禁用版权信息
        },
        series: seriesArray
      })
    },
    // 循环生成分发图
    detachEcharts () {
      this.iconLine = this.iconLine === '#icon-double-line' ? '#icon-line-chart_depart' : '#icon-double-line'
      this.lineTitle = this.lineTitle === '分离图表' ? '合并图表' : '分离图表'
      // 判断图表的显示和隐藏
      if (document.getElementById('main').classList.contains('hide') === true) {
        document.getElementById('main').classList.remove('hide')
        document.getElementById('rules').classList.remove('hide') // 显示单/多标尺
        document.getElementById('detach-chart').classList.add('hide')
        return null
      } else {
        document.getElementById('rules').classList.add('hide') // 分离的图标隐藏单/多标尺
        document.getElementById('main').classList.add('hide')
        document.getElementById('detach-chart').classList.remove('hide')
      }
      // 先清空上次的数据
      document.getElementById('detach-chart').innerHTML = ''
      let obj = this.echartObj
      for (let i = 0; i < obj.total; i++) {
        // appendChild()需要传入的是一个div的对象，而不是div的字符串
        let div = document.createElement('div')
        div.setAttribute('id', 'chart' + i)
        div.setAttribute('class', 'chart')
        document.getElementById('detach-chart').appendChild(div)

        let arry = []
        arry.push(obj.yName[i])
        let dataAry = []
        dataAry.push(obj.echartsData[i])
        let serData = {
          total: 1,
          yName: arry, // 纵坐标名字数组
          // legendTitle: this.bomUnit[i], // 图例单位
          legendFlag: true,
          echartsData: dataAry // 数据
        }
        this.switchType = 'only'
        // 循环生成图表
        this.drawLineEcharts('chart' + i, serData)
      }
    },
    // 单/多标尺切换
    yaxisChange () {
      this.iconRules = this.iconRules === '#icon-double-biaochi-copy' ? '#icon-single-biaochi-copy' : '#icon-double-biaochi-copy'
      this.rulesTitle = this.rulesTitle === '多标尺' ? '单标尺' : '多标尺'
      this.switchType = this.switchType === 'only' ? 'much' : 'only'
	    this.drawLineEcharts('main', this.echartObj)
    },
    // 时间显示规范
    standTime (param) {
      if (param < 10) {
        param = '0' + param
      }
      return param
    },
    // 格式化时间
    getNowFormatDate (day) {
      let Year = 0
      let Month = 0
      let Day = 0
      let Hour = 0
      let Minute = 0
      let Second = 0
      let CurrentDate = ''
      // 初始化时间
      Year = day.getFullYear() // ie火狐下都可以
      Month = day.getMonth() + 1
      Day = day.getDate()
      Hour = day.getHours()
      Minute = day.getMinutes()
      Second = day.getSeconds()
      CurrentDate += Year + '-'
      if (Month >= 10) {
        CurrentDate += Month + '-'
      } else {
        CurrentDate += '0' + Month + '-'
      }
      if (Day >= 10) {
        CurrentDate += Day
      } else {
        CurrentDate += '0' + Day
      }
      CurrentDate += ' '
      if (Hour >= 10) {
        CurrentDate += Hour + ':'
      } else {
        CurrentDate += '0' + Hour + ':'
      }
      if (Minute >= 10) {
        CurrentDate += Minute + ':'
      } else {
        CurrentDate += '0' + Minute + ':'
      }
      if (Second >= 10) {
        CurrentDate += Second
      } else {
        CurrentDate += '0' + Second
      }
      return CurrentDate
    },
    generateColor () {
      let r = Math.floor(Math.random() * 256)
      let g = Math.floor(Math.random() * 256)
      let b = Math.floor(Math.random() * 256)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    }
  },
  mounted () {
    if (this.message && this.message.length !== 0) {
      this.initChartData(this.message)
    } else {
      noData.hideTootip('main')// 先隐藏无数据提示
      noData.initTootip('main')// 显示无数据提示
    }
  }
}
</script>
<style lang="scss" scoped>
   .charts-container{
     background-color:#fff;
      .icon-container{
        text-align: right;
        margin-bottom: 10px;
        span{
          margin-right: 10px;
          cursor: pointer;
          :hover{
            opacity: 0.8;
          }
        }
      }
      .main{
        width: 99.8%;
        height: 500px;
        // border:1px solid #ccc;
      }
      .detach-chart{
        width: 100%;
        // height: 500px;
        // overflow: auto;
      }
    }
    .hide{
      display:none;
    }

</style>
<style>
    .detach-chart>.chart{
      width: 98%;
      height: 200px;
    }
</style>
