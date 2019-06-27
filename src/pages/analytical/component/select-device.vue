<template>
    <div class='info'>
      <el-row class='row1'>
          <el-input class='input1' placeholder="请选择设备" v-model="input1"></el-input>
          <el-button type="primary" icon='el-icon-search' @click="searchTable">查询</el-button>
      </el-row>
      <el-row class='row2'>
        <el-table
          ref="singleTable"
          :data='tableData'
          stripe
          style='width:100%'
          highlight-current-row
          @row-click = "showRow"
          border
          v-loading="loading"
          element-loading-text="拼命加载中">
          <el-table-column prop='EAF_CODE' label='设备编码' align='center'></el-table-column>
          <el-table-column prop="EAF_NAME" label='设备名称' align='center'></el-table-column>
          <el-table-column :prop='client' label='客户' align='center'></el-table-column>
        </el-table>
        <el-pagination :total='tableTotal' :current-page='tablePage' :page-sizes="tableList" :page-size='tablePageSize' @current-change='handleCurrentChange' @size-change="handleSizeChange" layout='total, sizes, prev, pager, next, jumper'></el-pagination>
      </el-row>
      <el-row class='row3'>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-row>
    </div>
</template>
<script>
import { getEquimenKeys } from '@/assets/js/equipment'
import { getDevice } from '@/assets/js/analysis'
export default{
  props: {
    layerid: {
      type: String,
      default: ''
    },
    parentType: {
      type: String
    }
  },
  data () {
    return {
      loading: true,
      input1: '',
      radio: '',
      raidoId: '', // 设备RMD_ID
      radioAry: [], // 回显父级页面内容
      client: '', // 资源字表客户字段
      tablePageSize: 5, // 表格初始化每页显示条数
      tablePage: 1, // 表格当前页
      tableRows: 5, // 当前页的行数
      tableTotal: 0, // 总条数
      tableList: [5, 10, 20, 30], // 表格每页显示条数
      tableData: [],
      init: true, //  初始化标识
      type: 'search'
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
          }
          // 表格数据初始化
          self.initData()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    initData () {
      this.interFace()
    },
    interFace (_type, _search) {
      let self = this
      self.loading = true
      getDevice(this.tablePage, this.tableRows, _type || '', _search || '').then((res) => {
        if (!res.data.EAF_ERROR) {
          res.data.rows.forEach(item => {
            item.checked = false
          })
          self.tableData = res.data.rows
          self.tableTotal = parseInt(res.data.total)
        }
        setTimeout(() => {
          self.loading = false
        }, 300)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 切换每页条数的时候触发
    handleSizeChange (val) {
      this.tableRows = val
      this.tablePage = 1
      if (!this.init) {
        this.searchInterFace(this.type, this.input1)
      } else {
        this.searchInterFace()
      }
    },
    handleCurrentChange (val) {
      this.tablePage = val
      if (!this.init) {
        this.interFace(this.type, this.input1)
      } else {
        this.interFace()
      }
    },
    searchTable () { // 查询按钮
      this.tablePage = 1
      this.init = false
      this.searchInterFace()
    },
    searchInterFace () {
      self.loading = true
      this.interFace(this.type, this.input1)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    showRow (row) {
      if (this.parentType === 'repair') {
        // 创建维修单选择设备列表
        // this.repairdeviceInput = []
        // this.repairdeviceInput.push(row.EAF_CODE)
        this.repairdeviceInput = row.EAF_NAME
        this.repairdeviceEafId = row.EAF_ID
      } else {
        // 赋值给radio
        this.radio = this.tableData.indexOf(row)
        this.radioId = row.RMD_ID
        this.radioAry = []
        this.radioAry.push(row.EAF_CODE)
        this.radioAry.push(row.EAF_NAME)
        this.radioAry.push(row[this.client])
      }
    },
    onSubmit () {
      this.$layer.close(this.layerid)
      if (this.parentType === 'repair') {
        // 创建维修单选择设备列表
        this.$store.commit('repairDeviceInput', this.repairdeviceInput)
        this.$store.commit('repairDeviceEafId', this.repairdeviceEafId)
        this.$parent.getTreeData()
      } else {
        this.$store.commit('selectDevice', this.radioAry)
        this.$store.commit('setDeviceRmdId', this.radioId)
        this.$store.commit('removeDataItems')
      }
    },
    cancle () {
      this.$layer.close(this.layerid)
    }
  },
  mounted () {
    // 表格初始化列头,表格数据在里面调用
    this.getRowKeyTable()
  }
}
</script>

<style lang="scss" scoped>
.info {
  width:100%;
  height:100%;
  text-align: center;
  .row1{
    display: flex;
    padding:10px;
    .el-button{
      margin-left:20px;
    }
  }
  .row2{
    padding:10px;
    .el-pagination{
        text-align: center;
      }
  }
  .row3{
    margin: 20px;
  }
}
</style>
