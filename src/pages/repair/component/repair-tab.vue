<template>
  <div class='repair-tab'>
    <el-row>
      <el-col :span="4">
        <el-autocomplete class="inline-input" v-model="deviceNameVal" :fetch-suggestions="deviceSearch" placeholder="请输入设备名称" clearable :trigger-on-focus="false"></el-autocomplete>
      </el-col>
      <el-col :span="4">
        <el-autocomplete class="inline-input" v-model="deviceCodeVal" :fetch-suggestions="codeSearch" placeholder="请输入设备编码" clearable :trigger-on-focus="false"></el-autocomplete>
      </el-col>
      <el-col :span="4">
      <el-input class="inline-input" v-model="repairContentVal" placeholder="请输入维修单内容" clearable></el-input>
      </el-col>
      <el-date-picker
          v-if="tabType=='close'"
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
        <el-button type="primary" icon="el-icon-search" @click="searchTable">查询</el-button>
        <el-button v-if="tabType=='doing'" type="primary" icon="el-icon-circle-plus-outline" @click="createDialog">创建维修单</el-button>
    </el-row>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" :cell-style="{verticalAlign:'top'}" stripe border style="width:100%;box-sizing:border-box;">
      <el-table-column label="设备" align="center">
        <template slot-scope="scope">
          <ul class="val-ul">
            <li><span :title='scope.row.DEVICEOBJ.EAF_NAME'>{{scope.row.DEVICEOBJ.EAF_NAME}}</span></li>
            <li><span :title='scope.row.DEVICEOBJ.EAF_CODE'>{{scope.row.DEVICEOBJ.EAF_CODE}}</span></li>
            <li style="margin-top:5px;color:#d6bebe"><span :title='scope.row.DEVICEOBJ.BELONG_DEPOT_NAME'>{{scope.row.DEVICEOBJ.BELONG_DEPOT_NAME}}</span></li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="EAF_CODE" label="维修单内容" align="center" width="200">
        <template slot-scope="scope">
          <ul class="key-ul">
            <li><span>故障类型：</span><span :title='scope.row.REPAIRORDEROBJ.RMD_TROUBLE_TYPE'>{{scope.row.REPAIRORDEROBJ.RMD_TROUBLE_TYPE}}</span></li>
            <li><span>故障位置：</span><span :title='scope.row.REPAIRORDEROBJ.RMD_TROUBLE_PLACE'>{{scope.row.REPAIRORDEROBJ.RMD_TROUBLE_PLACE}}</span></li>
            <li><span>故障描述：</span><span :title='scope.row.REPAIRORDEROBJ.RMD_TROUBLE_DESC'>{{scope.row.REPAIRORDEROBJ.RMD_TROUBLE_DESC}}</span></li>
            <li><span>发生时间：</span><span :title='scope.row.REPAIRORDEROBJ.RMD_OCCURTIME_NAME'>{{scope.row.REPAIRORDEROBJ.RMD_OCCURTIME_NAME}}</span></li>
            <li><span>故障来源：</span><span class="rightSpan" :title='scope.row.REPAIRORDEROBJ.RMD_TROUBLE_SOURCE'>{{scope.row.REPAIRORDEROBJ.RMD_TROUBLE_SOURCE}}</span></li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="EAF_MODIFYTIME" label="填报内容" align="center">
          <template slot-scope="scope">
            <ul class="key-ul">
              <li><span>真实故障：</span><span :title="scope.row.RMD_TRUE_TROUBLE">{{scope.row.RMD_TRUE_TROUBLE=='true'? "是" : "否"}}</span></li>
              <li><span>维修内容：</span><span :title="scope.row.RMD_DETAIL">{{scope.row.RMD_DETAIL}}</span></li>
            </ul>
          </template>
      </el-table-column>
      <el-table-column label="流程进度" align="center">
        <template slot-scope="scope">
          <el-timeline style="text-align:left">
            <el-timeline-item
              v-for="(activity, index) in scope.row.PLANNED"
              :index="scope.$index"
              :key="index"
              :color="activity.color">
              <p class="defaultReporter" :class="{activeReporter:activity.orderReportTime}">{{activity.orderReporter}}</p>
              <p class="report-time">{{activity.orderReportTime}}</p>
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" v-show="scope.row.BUTTONSTATUS.build=='true'" @click="fillDialog(scope.row,scope.$index)">填报</el-button>
          <el-button size="mini" v-show="scope.row.BUTTONSTATUS.update=='true'" @click="updateDialog(scope.row,scope.$index)">修改</el-button>
          <el-button size="mini" v-show="scope.row.BUTTONSTATUS.close=='true'" @click="closeRow(scope.row,scope.$index)">关闭</el-button>
          <el-button size="mini" v-show="scope.row.BUTTONSTATUS.delete=='true'" @click="deleteRow(scope.row,scope.$index)">删除</el-button>
          <el-button size="mini" v-show="scope.row.BUTTONSTATUS.watch=='true'" @click="checkDialog(scope.row,scope.$index)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="tableList" :page-size="tablePageSize" :current-page="tablePage" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal"></el-pagination>
  </div>
</template>

<script>
import {getAutoComplete} from '@/assets/js/equipment'
import {getRepairList, sendRepairOrder, deleteRepairOrder} from '@/assets/js/repair'
import manba from 'manba'
// 创建、填报、查看弹窗
import RepairCreate from 'pages/repair/component/repair-build'
import RepairFill from 'pages/repair/component/repair-fill'
import RepairCheck from 'pages/repair/component/repair-check'
export default {
  props: {
    tabType: {
      type: String
    }
  },
  components: {},
  data () {
    return {
      deviceNameVal: '', // 设备名称
      deviceCodeVal: '', // 设备编码
      repairContentVal: '', // 维修单内容
      deviceNameRes: [], // 设备名称联想
      deviceCodeRes: [], // 设备编码联想

      tablePageSize: 3, // 表格初始化每页条数
      tablePage: 1, // 表格当前页
      tableTotal: 0, // 总条数
      tableList: [3, 10, 30], // 表格每页条数list
      tableData: [], // 表格数据

      dateValue: [], // 日期
      pickerOptions: { // 日期快捷选项
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
      gobalRule: {}, // 保存查询条件
      // fillData: {},
      // dialogFill: false,
      init: true, // 初始化标识
      initDate: [],
      loading: false
    }
  },
  methods: {
    // 日期初始化默认值
    dateFormat () {
      let startTime = manba().add(-1, manba.DAY).format('YYYY-MM-DD h:mm:ss')
      let endTime = manba().format('YYYY-MM-DD h:mm:ss')
      this.dateValue = [startTime, endTime]
      this.initDate = [startTime, endTime]
    },
    // 设备名称联想
    loadName () {
      let self = this
      getAutoComplete('RMD_EQUIP', 'EAF_NAME').then(res => {
        if (!res.data.EAF_ERROR) {
          self.deviceNameRes = res.data
        }
      })
    },
    // 设备编码联想
    loadCode () {
      let self = this
      getAutoComplete('RMD_EQUIP', 'EAF_CODE').then(res => {
        if (!res.data.EAF_ERROR) {
          self.deviceCodeRes = res.data
        }
      })
    },
    // 设备名称建议列表
    deviceSearch (queryString, cb) {
      var deviceNameRes = this.deviceNameRes
      var results = queryString ? deviceNameRes.filter(this.createFilter(queryString)) : deviceNameRes
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 设备编码建议列表
    codeSearch (queryString, cb) {
      var deviceCodeRes = this.deviceCodeRes
      var results = queryString ? deviceCodeRes.filter(this.createFilter(queryString)) : deviceCodeRes
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 联想过滤函数
    createFilter (queryString) {
      return results => {
        return (
          results.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    // 切换每页条数的时候触发
    handleSizeChange (val) {
      this.tablePageSize = val
      this.tablePage = 1
      if (this.init) {
        this.getTableData()
      } else {
        this.getTableData(this.gobalRule.name, this.gobalRule.code, this.gobalRule.content, this.gobalRule.date)
      }
      // console.log(`每页 ${val} 条`)
    },
    // 切换页数
    handleCurrentChange (val) {
      this.tablePage = val
      if (this.init) {
        this.getTableData()
      } else {
        this.getTableData(this.gobalRule.name, this.gobalRule.code, this.gobalRule.content, this.gobalRule.date)
      }
    },
    autoSize (_w, _h, _lk) {
      if (_lk) return [(window.innerWidth * _w > _lk ? _lk : window.innerWidth * _w) + 'px', window.innerHeight * _h + 'px']
      return [window.innerWidth * _w + 'px', window.innerHeight * _h + 'px']
    },
    // 创建弹框
    createDialog () {
      this.$layer.iframe({
        content: {
          content: RepairCreate,
          parent: this,
          data: {
            layerid: this.$layer.id,
            parentType: 'create'
          }
        },
        area: ['900px', '600px'],
        title: '创建维修单'
      })
    },
    // 填报弹框
    fillDialog (row) {
      this.$layer.iframe({
        content: {
          content: RepairFill,
          parent: this,
          data: {
            layerid: this.$layer.id,
            dialogType: 'fill',
            parentRow: JSON.stringify(row)
          }
        },
        area: ['800px', '600px'],
        title: '填报维修单'
      })
    },
    // 修改弹框
    updateDialog (row) {
      this.$layer.iframe({
        content: {
          content: RepairFill,
          parent: this,
          data: {
            layerid: this.$layer.id,
            dialogType: 'update',
            parentRow: JSON.stringify(row)
          }
        },
        area: ['800px', '600px'],
        title: '修改维修单'
      })
    },
    // 查看弹框
    checkDialog (row) {
      this.$layer.iframe({
        content: {
          content: RepairCheck,
          parent: this,
          data: {
            layerid: this.$layer.id,
            parentRow: JSON.stringify(row)
          }
        },
        area: ['800px', '600px'],
        title: '查看维修单'
      })
    },
    // 关闭
    closeRow (row) {
      let self = this
      self.$confirm('您已认真核对了维修内容，确定关闭维修单？', '关闭提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let arrTrouble = []
        let objTrouble = {}
        objTrouble = {
          'RMD_STATUS': 'close', // 维修单状态
          'EAF_ID': row.EAF_ID // 维修单eaf_ID
        }
        arrTrouble.push(objTrouble)
        sendRepairOrder(arrTrouble, '', '').then((res) => {
          if (res.data.flag) {
            this.$message({
              type: 'success',
              message: '关闭成功!'
            })
            self.searchTable()
          } else {
            this.$confirm('关闭失败', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消关闭'
        // })
      })
    },
    // 删除
    deleteRow (row) {
      let self = this
      self.$confirm('此操作将永久删除该条维修单, 是否继续？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRepairOrder(row.EAF_ID).then((res) => {
          if (res.data.flag) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            self.searchTable()
          } else {
            this.$confirm('删除失败', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    // 表格数据
    getTableData (deviceNameVal = '', deviceCodeVal = '', repairContentVal = '', dateValue = this.initDate) {
      let self = this
      self.loading = true
      getRepairList(deviceNameVal, deviceCodeVal, repairContentVal, dateValue, this.tabType, this.tablePage, this.tablePageSize).then((res) => {
        if (!res.data.EAF_ERROR) {
          for (const item of res.data.rows) {
            for (const item2 of item.PLANNED) {
              if (item2.orderReportTime) {
                item2.color = '#0bbd87'
              } else {
                item2.color = '#ccc'
              }
            }
          }
          self.tableData = res.data.rows
          self.tableTotal = parseInt(res.data.total)
          setTimeout(() => {
            self.loading = false
          }, 500)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 查询
    searchTable () {
      this.tablePage = 1
      this.gobalRule = {
        name: this.deviceNameVal,
        code: this.deviceCodeVal,
        content: this.repairContentVal,
        date: this.dateValue
      }
      this.getTableData(this.gobalRule.name, this.gobalRule.code, this.gobalRule.content, this.gobalRule.date)
      this.init = false
    }
  },
  mounted () {
    // 查询条件联想初始化
    this.loadName()
    this.loadCode()
    // 日期初始化
    this.dateFormat()
    // 表格初始化
    this.getTableData()
  }
}
</script>>
<style lang="scss" scoped>
.repair-tab{//此处也可在父组件的el-main内定义
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  overflow: hidden;
  .el-row {
    text-align: left;
    line-height: 50px;
    .el-autocomplete:nth-child(2) {
      margin-left: 20px;
    }
    .el-select {
      margin-left: 20px;
    }
    .el-button {
      margin-left: 20px;
    }
  }
  .el-table{
    .val-ul li{//设备列
      display: flex;
      span{
        flex: 1;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        text-align: left;
      }
    }
    .key-ul li{//其它列
      display: flex;
      & span:last-child{
        flex: 1;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        text-align: left;
      }
    }
    .el-timeline-item {//流程进度线
      padding-bottom: 10px;
      &:last-child{
        padding-bottom: 0;
      }
      .defaultReporter{
        color:#ccc;
        font-size: 13px;
      }
      .activeReporter{
        color: #000;
        font-size: 14px
      }
      .report-time{
        color: blue;
      }
    }
  }
}
</style>
