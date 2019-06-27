<template>
    <div class='info'>
        <el-container>
            <el-header height='30px'>
                <el-breadcrumb>
                    <el-breadcrumb-item>数据项分析</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main v-loading='loading' element-loading-text="拼命加载中">
                <el-row>
                    <input class='use-defined-input' disabled type="text" placeholder="请选择设备" v-autowidth="{maxWidth: '960px', minWidth: '200px', comfortZone: 0}"  v-model="deviceInput" />
                    <el-button type="primary" icon='el-icon-circle-plus-outline' @click="searchDevice">选择</el-button>
                    <el-date-picker
                        class='date'
                        v-model="dateValue"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期时间"
                        end-placeholder="结束日期时间"
                        align="left">
                    </el-date-picker>
                    <el-button class='search' type="primary" icon='el-icon-search' @click="searchTable" :disabled="disableSearch">查询</el-button>
                </el-row>
                <el-row class='row2'>
                    <AutoTags :dataItem='dataItemInput' @changeData='handleItemData'></AutoTags>
                    <el-button type="primary" icon='el-icon-circle-plus-outline' @click="searchDataItem" :disabled='disable'>选择</el-button>
                </el-row>
                <template  v-if="searchFlag">
                  <div>
                    <DataIndication></DataIndication>
                    <Highcharts :message="chartData"></Highcharts>
                  </div>
                </template>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import manba from 'manba'
import SelectDevice from 'pages/analytical/component/select-device'
import DataItem from 'pages/analytical/component/data-item'
import agent from '@/assets/js/agent'
import DataIndication from 'pages/analytical/component/data-indication'
import Highcharts from 'pages/analytical/component/highcharts'
import AutoTags from '@/components/input/auto-tags'
export default {
  components: {
    Highcharts,
    DataIndication,
    AutoTags
  },
  data () {
    return {
      name: '',
      searchFlag: false,
      input1: '',
      chartData: [],
      dateValue: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      disable: true, // 选择数据项是否可编辑
      disableSearch: true, // 查询按钮是否可编辑
      loading: false
    }
  },
  computed: {
    deviceInput () { // 选择车辆段反显数据
      return this.$store.getters.selectDeviceInput
    },
    dataItemInput () { // 选择数据项反显数据
      return this.$store.getters.getDataItems
    },
    rmdId () { // 设备RMD_ID
      return this.$store.getters.selectDeviceRmdId
    },
    proVariable () { // 数据项编码
      return this.$store.getters.getDataItemsCode
    },
    customChart () { // 指示条范围值
      return this.$store.getters.getGapTimeStartEnd
    }
  },
  watch: {
    customChart (val) { // 点击数据指示条导致的数据变动在这里监听到
      let self = this
      self.loading = true
      let params = new URLSearchParams()
      params.append('startTime', val[0] ? val[0] : '')
      params.append('endTime', val[1] ? val[1] : '')
      params.append('lastTime', '300')
      params.append('proVariable', this.proVariable)
      params.append('RMD_ID', this.rmdId)
      // 调用封装方法
      agent.askMasterToServer('BFProParam', 'getVariableAggregation', 'data', params).then((res) => {
        self.$store.commit('setChartData', res.data.queries)
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  methods: {
    dateFormat () { // 日期初始化默认值
      let startTime = manba().add(-1, manba.DAY).format('YYYY-MM-DD h:mm:ss')
      let endTime = manba().format('YYYY-MM-DD h:mm:ss')
      this.dateValue = [startTime, endTime]
    },
    autoSize (_w, _h, _lk) {
      if (_lk) return [(window.innerWidth * _w > _lk ? _lk : window.innerWidth * _w) + 'px', window.innerHeight * _h + 'px']
      return [window.innerWidth * _w + 'px', window.innerHeight * _h + 'px']
    },
    searchDevice () { // 设备
      let self = this
      this.$layer.iframe({
        content: {
          content: SelectDevice,
          parent: this,
          data: {
            layerid: this.$layer.id
          }
        },
        area: self.autoSize(0.5, 0.9, 800),
        title: '设备列表'
      })
    },
    searchDataItem () { // 数据项
      let self = this
      this.$layer.iframe({
        content: {
          content: DataItem,
          parent: this,
          data: {
            layerid: this.$layer.id
          }
        },
        area: parseInt(document.body.clientWidth) === 1920 ? self.autoSize(0.8, 0.8) : self.autoSize(0.8, 1),
        title: '选择数据项'
      })
    },
    changeInput (val) { // 选择设备子页面回显过来的数据
      this.input1 = val
    },
    searchTable () {
      let self = this
      let len = manba(this.dateValue[1]).distance(this.dateValue[0], manba.DAY)
      let text = '根据您当前查询的数据量,大概需要等待30秒,确定查询?'
      if (len > 7) {
        this.$layer.confirm(text, {
          btn: ['确定', '取消']
        }, () => {
          self.loading = true
          self.searchInterFace()
          self.$layer.closeAll()
        }, () => {
          self.$layer.closeAll()
        })
      } else {
        self.loading = true
        self.searchInterFace()
      }
    },
    searchInterFace () {
      let self = this
      let params = new URLSearchParams()
      params.append('startTime', this.dateValue ? this.dateValue[0] : '')
      params.append('endTime', this.dateValue ? this.dateValue[1] : '')
      params.append('lastTime', '300')
      params.append('proVariable', this.proVariable)
      params.append('RMD_ID', this.rmdId)
      // 调用封装方法
      agent.askMasterToServer('BFProParam', 'getVariableAggregation', 'data', params).then((res) => {
        self.searchFlag = true
        self.chartData = res.data.queries
        self.$store.commit('setGapTime', res.data.gapTimeArr)
        self.$store.commit('setChartData', res.data.queries)

        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch((error) => {
        console.log(error)
      })
    },
    handleItemData (datas) { // 数据项显示数据删除之后重新存储到vuex里
      this.$store.commit('saveDataItems', datas)
    }
  },
  mounted () {
    this.loading = false
    this.$store.commit('selectDeviceRemove')
    this.$store.commit('removeDeviceRmdId')
    this.$store.commit('removeDataItems')
    this.$store.commit('removeGapTime')
    this.$store.commit('removeChartData')
    this.$store.commit('removeGapTimeStartEnd')
    this.dateFormat()
  },
  updated () {
    let len = this.deviceInput.length
    if (len > 0) {
      this.disable = false
    } else {
      this.disable = true
    }
    let itemLen = this.dataItemInput.length
    if (itemLen > 0) {
      this.disableSearch = false
    } else {
      this.disableSearch = true
    }
  },
  beforeDestroy () {
    this.$store.commit('selectDeviceRemove')
    this.$store.commit('removeDeviceRmdId')
    this.$store.commit('removeDataItems')
    this.$store.commit('removeGapTime')
    this.$store.commit('removeChartData')
    this.$store.commit('removeGapTimeStartEnd')
  }
}
</script>
<style>

</style>
<style lang="scss" scoped>
.info {
    height:100%;
    background: #E9EEF3;
    .el-container{
      height:100%;
        .el-header {
            background-color: #e4e7ed;
            color: #333;
            text-align: center;
            line-height: 30px;
            .el-breadcrumb {
                line-height: 30px;
            }
        }
        .el-main{
            height:calc(100% - 30px);
            .el-row{
                height:48px;
                line-height: 48px;
                .input1{
                  width: 200px;
                }
                .date{
                  margin-left:20px;
                }
                .search{
                  margin-left:20px;
                }
                .use-defined-input{
                  height:32px;
                  line-height: 32px;
                  background-color: #f5f7fa;
                  background-image: none;
                  border-radius: 4px;
                  border: 1px solid #E4E7ED;
                  box-sizing: border-box;
                  display: inline-block;
                  outline: 0;
                  padding: 0 15px;
                  color:#606266;
                  cursor: not-allowed;
              }
              .data-item{
                  max-width:calc(100% - 350px) !important;
              }
            }
            .row2 {
              display: flex;
              align-items: baseline;
              margin-bottom:10px;
              .el-button{
                margin-left:4px;
              }
            }
            #nodata{
              width: 100%;
              height: 500px;
              background: #fff;
            }
        }
    }
}
</style>
