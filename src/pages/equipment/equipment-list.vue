<template>
<div class='info'>

    <el-container element-loading-text="拼命加载中">

        <el-header height='30px'>

            <el-breadcrumb>

                <el-breadcrumb-item :to="{ path: '/equipment/equipment-list' }">设备列表</el-breadcrumb-item>

            </el-breadcrumb>

        </el-header>

        <el-main >
            <el-row class="demo-autocomplete">
              <el-autocomplete v-model='deviceVal' placeholder='请输入设备名称' clearable class="inline-input" :trigger-on-focus="false" :fetch-suggestions="deviceSearch"></el-autocomplete>
              <el-autocomplete v-model='codeVal' placeholder='请输入编码' clearable class="inline-input" :trigger-on-focus="false" :fetch-suggestions="codeSearch"></el-autocomplete>
              <el-select v-model='singleVal'  multiple collapse-tags placeholder='请选择客户' clearable>
                  <el-option v-for='single in options' :key='single.value' :label="single.label" :value="single.value"></el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-row>
            <el-table v-loading="loading2" element-loading-text="拼命加载中" :data='tableData' @header-click="clickIcon" stripe border style="width:99.8%;box-sizing:border-box;">
                <el-table-column prop='EAF_NAME' label='设备名称' align='center'></el-table-column>
                <el-table-column prop="EAF_CODE" label="编码" align='center'></el-table-column>
                <el-table-column :prop='client' label='客户' align='center'></el-table-column>
                <el-table-column prop='RMD_TRB_STATE' label='故障状态' align='center' label-class-name='cursor'>
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
                <el-table-column prop='EAF_MODIFYTIME' label='最后联系时间' align='center' show-overflow-tooltip></el-table-column>
                <el-table-column label='操作' align='center' width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="jumpToFile(scope.$index,scope.row)">工况</el-button>
                        <el-button size='mini' @click="jumpToArchives(scope.$index,scope.row)">档案</el-button>
                        <el-button size='mini' @click="jumpToRepairPlan(scope.$index,scope.row)">检修</el-button>
                        <el-button size='mini' type="primary">更多</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="tableList" :page-size="tablePageSize" :current-page="tablePage" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal">
            </el-pagination>
        </el-main>
    </el-container>
</div>
</template>

<script>
import FaultLegend from 'pages/equipment/component/fault-legend'
import { getEquimenKeys, getEquimentList, getAutoComplete, getClient, getFaultLevel } from '@/assets/js/equipment'
import commonCons from 'assets/js/commonConstant'
export default {
  name: 'equipment-list',
  data () {
    return {
      devId: commonCons.getConstant('user'), // 设备类id
      deviceVal: '', // 设备名称
      codeVal: '', // 编码
      singleVal: [], // 客户
      client: '', // 资源字表客户字段
      trbState: '', // 资源字段故障状态字段
      deviceRes: [],
      codeRes: [],
      tablePageSize: 10, // 表格初始化每页显示条数
      tablePage: 1, // 表格当前页
      tableRows: 10, // 当前页的行数
      tableTotal: 0, // 总条数
      tableList: [10, 20, 30], // 表格每页显示条数
      tableData: [], // 表格数据
      options: [],
      tableHeight: window.innerHeight - 250,
      // loading: true,
      loading2: false,
      trbLevelAry: [], // 故障状态映射的图标
      gobalRule: [], // 保存查询条件
      init: true // 初始化标识
    }
  },
  methods: {
    // 资源属性名字段转中文
    rowKeyFormatter (row) {
      let resname = 'RES_' + row.EAF_CNAME + '_' + row.EAF_RELATESHOW
      if (resname.length + 2 > 30) {
        resname = 'RES_' + row.EAF_SN + '_1'
      }
      if (row.EAF_RCNAME && row.EAF_RCNAME.indexOf('R_') === 0) resname = 'R_' + resname
      return resname
    },
    // 获取资源表数据
    getRowKeyTable () {
      let self = this
      getEquimenKeys().then((res) => {
        if (!res.data.EAF_ERROR) {
          let rowData = res.data.rows
          for (let i in rowData) {
            if (rowData[i].EAF_CNAME === 'RMD_BELONG_DEPOT') {
              self.client = self.rowKeyFormatter(rowData[i])
            }
            if (rowData[i].EAF_CNAME === 'RMD_TRB_STATE') {
              self.trbState = self.rowKeyFormatter(rowData[i])
            }
          }
          // 表格数据初始化
          self.getTableData(this.gobalRule)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    clickIcon (col, event) { // 表头图标列点击
      if (col.property === 'RMD_TRB_STATE') {
        this.$layer.iframe({
          content: {
            content: FaultLegend,
            parent: this, // 当前的vue对象
            data: {
              value: JSON.stringify(this.trbLevelAry),
              nomal: true
            }
          },
          area: ['200px', '400px'],
          title: '故障图例'
        })
      }
    },
    // 跳转到设备工况页面
    jumpToFile (index, row) {
      // 缓存设备列表组件
      this.$store.commit('setKeepAliveRoute', 'equipment-list')
      setTimeout(() => {
        this.$router.push({name: 'equipment-file', params: {userId: row.EAF_ID}})
      }, 1)
    },
    // 跳转到设备档案页面
    jumpToArchives (index, row) {
      let equipId = row.EAF_ID
      if (!row.RMD_RE_CLS) {
        this.$layer.alert('当前设备未指定档案模板，请前往后台配置！')
        return null
      }
      let hostname = window.document.location.hostname
      let port = window.document.location.port
      let localhostPath = 'http://' + hostname + ':' + port + '/'
      window.open(localhostPath + 'RDD/equipmentArchives/equipment-itemTab.jsp?equipId=' + equipId + '&clsId=' + row.RMD_RE_CLS + '&rmdId=' + row.RMD_RE_ID)
    },
    // 跳转到检修计划
    jumpToRepairPlan (index, row) {
      // 缓存检修计划组件
      this.$store.commit('setKeepAliveRoute', 'equipment-list')
      setTimeout(() => {
        let equipId = row.EAF_ID
        let equipName = row.EAF_NAME
        let equipCode = row.EAF_CODE
        this.$router.push({name: 'repair-plan', params: {equipId: equipId, equipName: equipName, equipCode: equipCode}})
      })
    },
    // 设备名称
    deviceSearch (queryString, cb) {
      var deviceRes = this.deviceRes
      var results = queryString ? deviceRes.filter(this.createFilter(queryString)) : deviceRes
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (results) => {
        return (results.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 编码
    codeSearch (queryString, cb) {
      var codeRes = this.codeRes
      var results = queryString ? codeRes.filter(this.createFilter(queryString)) : codeRes
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    loadAll () {
      let self = this
      getAutoComplete('RMD_EQUIP', 'EAF_NAME').then((res) => {
        if (!res.data.EAF_ERROR) {
          self.deviceRes = res.data
        }
      })
    },
    loadCode () {
      let self = this
      getAutoComplete('RMD_EQUIP', 'EAF_CODE').then((res) => {
        if (!res.data.EAF_ERROR) {
          self.codeRes = res.data
        }
      })
    },
    loadClient () {
      let self = this
      getClient('RMD_DEPOT').then((res) => {
        if (!res.data.EAF_ERROR) {
          self.options = res.data
        }
      })
    },
    handleSelect (item) {
      console.log(item)
    },
    // 切换每页条数的时候触发
    handleSizeChange (val) {
      this.tableRows = val
      this.tablePage = 1
      if (this.init) {
        this.getTableData()
      } else {
        this.getTableData(this.gobalRule)
      }
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.tablePage = val
      if (this.init) {
        this.getTableData()
      } else {
        this.getTableData(this.gobalRule)
      }
      console.log(`当前页: ${val}`)
    },
    getTableData (_rule) {
      var self = this
      this.loading2 = true
      getEquimentList(this.tablePage, this.tableRows, _rule).then((res) => {
        if (!res.data.EAF_ERROR) {
          self.tableData = res.data.rows
          self.tableTotal = parseInt(res.data.total)
          // self.loading = false
          setTimeout(() => {
            this.loading2 = false
          }, 500)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 查询
    search () {
      this.tablePage = 1
      let eafUl = []
      // 设备名称
      if (this.deviceVal || this.deviceVal !== '') {
        let jsonObj = {}
        jsonObj.queryType = 'text'
        jsonObj.fieldName = 'EAF_NAME'
        jsonObj.data = this.deviceVal
        eafUl.push(jsonObj)
      }
      // 编码
      if (this.codeVal || this.codeVal !== '') {
        let jsonObj = {}
        jsonObj.queryType = 'text'
        jsonObj.fieldName = 'EAF_CODE'
        jsonObj.data = this.codeVal
        eafUl.push(jsonObj)
      }
      // 客户
      if (this.singleVal.length !== 0) {
        let jsonObj = {}
        jsonObj.queryType = 'list'
        jsonObj.fieldName = 'RMD_BELONG_DEPOT'
        jsonObj.data = this.singleVal
        eafUl.push(jsonObj)
      }
      this.gobalRule = eafUl
      this.getTableData(eafUl)
      this.init = false
    },
    initTrbLevel () { // 故障等级
      let self = this
      getFaultLevel().then((res) => {
        self.trbLevelAry = res.data.rows
      }).catch((err) => {
        console.log(err)
      })
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
        }
      })
      self.trbLevelAry = ary
    },
    setClass (trblevel) {
      var str = ''
      this.trbLevelAry.forEach((res) => {
        if (trblevel === res.EAF_ID) {
          str = res.RMD_URL
        }
      })
      return str
    }
  },

  mounted () {
    // 获取故障等级图例
    this.initTrbLevel()
    // 表格初始化列头,表格数据在里面调用
    this.getRowKeyTable()
    // 查询条件联想
    this.loadAll()
    this.loadCode()
    this.loadClient()
  },
  beforeDestroy () {
    this.$store.commit('removeKeepAliveRoute')
  }
}
</script>

<style lang="scss" scoped>
.info {
    background: #E9EEF3;
    overflow: auto;
}
.el-header {
    background-color: #e4e7ed;
    color: #333;
    text-align: center;
    line-height: 30px;
    .el-breadcrumb {
        line-height: 30px;
    }
}

.el-pagination{
    background: #fff;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    overflow: hidden;
    .el-row{
      text-align: left;
      .el-autocomplete:nth-child(2){
        margin-left:20px;
      }
      .el-select{
        margin-left:20px;
      }
      .el-button{
        margin-left:20px;
      }
    }
    /deep/ .cursor{
      cursor: pointer;
      &:hover{
        background: rgba(166,210,210,1);
        color:#fff;
      }
    }
}

.demo-autocomplete {
    line-height: 50px;
}
</style>
