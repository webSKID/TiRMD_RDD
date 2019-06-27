<template>
<div class='fault'>
    <div class='fault-top'>
      <el-select class='sel' v-model="selValue" placeholder="请选择" multiple collapse-tags>
        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
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
      <el-select class='sel' v-model="selValue2" placeholder="请选择" multiple>
        <el-option v-for="item2 in options2" :key="item2.value" :value="item2.value" :label="item2.label"></el-option>
      </el-select>
      <el-select class='sel' v-model="selValue3" placeholder="请选择" multiple>
        <el-option v-for="item3 in options3" :key="item3.value" :value="item3.value" :label="item3.label"></el-option>
      </el-select>
      <el-button class='btn' type="primary" icon="el-icon-search" @click="searchTable">查询</el-button>
    </div>

    <el-main>
      <el-scrollbar>
      <el-table :data='tableData' :row-class-name="tableRowClassName" stripe style='width:99.8%' @header-click="clickIcon" border v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop='RMD_TRB_STATE' label='故障状态' align='center' width='80' label-class-name='cursor'>
          <template slot-scope="scope">
            <template v-if='scope.row.TRBLEVEL_URL'>
              <div :title="scope.row.TRBLEVEL_NAME">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="scope.row.TRBLEVEL_URL"></use>
                </svg>
              </div>
            </template>
            <template v-else>
              <div :title="scope.row.TRBLEVEL_NAME">{{scope.row.TRBLEVEL_NAME}}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop='EAF_CODE' label='故障代码' align='center'></el-table-column>
        <el-table-column prop="EAF_NAME" label='故障名称' align='center'></el-table-column>
        <el-table-column prop='RMD_OCCURTIME_STR' label='发生时间' align='center'></el-table-column>
        <el-table-column prop='RMD_RELIEVETIME_STR' label='解除时间' align='center'></el-table-column>
        <el-table-column prop="RMD_TRO_RULE" label='报警规则' align='center'></el-table-column>
        <el-table-column prop='RMD_DISPATCH_STATE' label='派发状态' align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.RMD_DISPATCH_STATE | dispatchFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label='操作' align='center' width='200'>
          <template slot-scope="scope">
            <el-button @click="distributeDialog(scope.row,scope.$index)" size="mini" type="primary">派发</el-button>
            <el-button size='mini' type="primary">变量分析</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-scrollbar>
      <el-pagination style='width:99.8%' :total='tableTotal' :current-page='tablePage' :page-sizes="tableList" :page-size='tablePageSize' @current-change='handleCurrentChange' @size-change="handleSizeChange" layout='total, sizes, prev, pager, next, jumper'></el-pagination>
    </el-main>
  </div>
</template>

<script>
import FaultLegend from 'pages/equipment/component/fault-legend'
import RepairBuild from 'pages/repair/component/repair-build'
import { initFaultWarn, getFaultLevel } from 'assets/js/equipment.js'
import manba from 'manba'
export default {
  props: {
    eafId: {
      type: String
    }
  },
  components: {
    FaultLegend
  },
  data () {
    return {
      selValue: [],
      selValue2: ['unrelieved'],
      selValue3: ['success', 'fail'],
      level: [],
      options: [],
      options2: [{label: '已解除', value: 'relieved'}, {label: '未解除', value: 'unrelieved'}],
      options3: [{label: '已派发', value: 'success'}, {label: '未派发', value: 'fail'}],
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
      tableTotal: 0, // 总条数
      tablePage: 1, // 表格当前页
      tablePageSize: 10, // 表格初始化每页显示条数
      tableList: [10, 20, 30], // 表格每页显示条数
      tableData: [],
      loading: true
    }
  },
  methods: {
    // 派发维修单弹框
    distributeDialog (row, index) {
      this.$layer.iframe({
        content: {
          content: RepairBuild,
          parent: this,
          data: {
            layerid: this.$layer.id,
            parentType: 'distribute',
            parentRow: JSON.stringify(row)
          }
        },
        area: ['800px', '600px'],
        title: '派发维修单'
      })
    },
    setClass (trblevel) {
      var str = ''
      this.level.forEach((res) => {
        if (trblevel === res.EAF_ID) {
          str = res.RMD_URL
        }
      })
      return str
    },
    initSelect () {
      let self = this
      getFaultLevel().then((res) => {
        self.optionFormatter(res.data.rows)
      }).catch((err) => {
        console.log(err)
      })
    },
    initTableData () { // 初始化表格数据
      let self = this
      initFaultWarn(self.eafId, self.tablePage, self.tablePageSize, '', self.selValue2).then((res) => {
        self.level = res.data.level
        self.tableData = res.data.trbs
        self.tableTotal = parseInt(res.data.total)
        setTimeout(() => {
          self.loading = false
        }, 500)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 切换每页条数的时候触发
    handleSizeChange (val) { // 每页条数
      this.tablePage = 1
      this.tablePageSize = val
      this.getTableData()
    },
    handleCurrentChange (val) { // 当前页
      this.tablePage = val
      this.getTableData()
    },
    searchTable () {
      this.tablePage = 1
      this.getTableData()
    },
    getTableData () {
      let self = this
      self.loading = true
      initFaultWarn(self.eafId, self.tablePage, self.tablePageSize, self.selValue, self.selValue2, self.selValue3, self.dateValue ? self.dateValue[0] : '', self.dateValue ? self.dateValue[1] : '').then((res) => {
        self.tableData = res.data.trbs
        self.tableTotal = parseInt(res.data.total)

        setTimeout(() => {
          self.loading = false
        }, 500)
      }).catch((err) => {
        console.log(err)
      })
    },
    clickIcon (col, event) { // 表头图标列点击
      if (col.property === 'RMD_TRB_STATE') {
        this.$layer.iframe({
          content: {
            content: FaultLegend,
            parent: this, // 当前的vue对象
            data: {
              value: JSON.stringify(this.level)
            }
          },
          area: ['200px', '400px'],
          title: '故障图例'
        })
      }
    },
    optionFormatter (data) {
      let self = this
      let ary = []
      data.forEach((res) => {
        if (res.EAF_NAME !== '正常') {
          ary.push({
            label: res.EAF_NAME,
            value: res.EAF_ID
          })
          self.selValue.push(res.EAF_ID)
        }
      })
      this.options = ary
    },
    dateFormat () { // 时间格式化
      let startTime = manba().add(-1, manba.DAY).format('YYYY-MM-DD h:mm:ss')
      let endTime = manba().format('YYYY-MM-DD h:mm:ss')
      this.dateValue = [startTime, endTime]
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.RMD_TROUBLE_STATE === 'relieved') {
        return 'relieved-row'
      } else {
        return 'unrelieved-row'
      }
    }
  },
  filters: {
    dispatchFilter (value) { // 派发状态过滤
      if (value === 'fail') {
        return '未派发'
      } else if (value === 'success') {
        return '已派发'
      } else {
        return ''
      }
    }
  },
  mounted () {
    // 默认时间
    this.dateFormat()
    this.initSelect()
    this.initTableData()
  }
}
</script>
<style>
  .el-table .relieved-row {
    color: rgba(129, 124, 115, 0.6);
  }
</style>
<style lang="scss" scoped>

.fault{
  .fault-top{
    width:100%;
    display:flex;
    align-items: center;
    flex-wrap: wrap;
    .sel{
      width:200px;
      margin-right:10px;
      margin-bottom:10px;
      height:32px;
      line-height: 32px;
    }
    .date{
      margin-right:10px;
      margin-bottom:10px;
      width:400px;
    }
    .btn{
      margin-bottom:10px;
    }
  }
  .el-main{
    padding-top:0;
    padding-left:0;
    /deep/ .cursor{
      cursor: pointer;
      &:hover{
        background: rgba(166,210,210,1);
        color:#fff;
      }
    }
    .el-pagination{
      background: #fff;
      text-align: center;
    }
  }
}

</style>
