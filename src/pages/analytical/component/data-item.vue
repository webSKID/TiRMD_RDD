<template>
    <div class='info' ref="box">
      <div class='row'>
        <div id='info-left' class='info-left'>
            <!-- <header>数据项列表</header> -->
            <el-row class='row1'>
                <el-input class='input1' placeholder="请选择检查项名称或编码" v-model="inputLeft"></el-input>
                <el-button type="primary" icon='el-icon-search' @click="searchTable">查询</el-button>
            </el-row>
            <el-table ref="multipleTable"
             :data='tableData'
              style='width:99.8%'
              stripe
              border
              @select='selectSingle'
              @select-all='selectAll'
              v-loading='loading'
              element-loading-text="拼命加载中">
              <el-table-column prop='RMD_KEY' label='编码' align='center' show-overflow-tooltip></el-table-column>
              <el-table-column prop='EAF_NAME' label='名称' align='center' show-overflow-tooltip></el-table-column>
              <el-table-column label='操作' type="selection" width='50' align='center'>
              </el-table-column>
            </el-table>
            <el-pagination :total='tableTotal' :current-page='tablePage' :page-size="tablePageSize" :page-sizes='tableList' @size-change="handleSizeChange" @current-change='handleCurrentChange' layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
        <div id='info-center' class='info-center'>
            <!-- <span><i class="el-icon-d-arrow-right el-icon--right"></i></span> -->
        </div>
        <div id='info-right' class='info-right'>
            <header>已选数据项</header>
            <el-scrollbar>
              <el-table :data='tableData2' style='width:99.8%' stripe border :cell-style='isHandle'>
                <el-table-column prop='RMD_KEY' label='编码' align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop='EAF_NAME' label='名称' align='center' show-overflow-tooltip></el-table-column>
                <el-table-column label='操作' width='120' align='center'>
                  <template slot-scope="scope">
                    <el-button type='primary' styp @click="removeRow(scope.row)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
        </div>
        </div>
      <div class='row2'>
        <div>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="cancle">取消</el-button>
        </div>
      </div>
    </div>
</template>

<script>
import agent from '@/assets/js/agent'
export default {
  props: {
    layerid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      init: true, // 初始化标识
      first: true, // 第一次弹窗
      type: 'byOther',
      inputLeft: '',
      tablePageSize: 10, // 表格初始化每页显示条数
      tablePage: 1, // 表格当前页
      tableRows: 10, // 当前页的行数
      tableTotal: 0, // 总条数
      tableList: [10, 20, 30], // 表格每页显示条数
      tableData: [], // 左侧表格
      tableData2: [], // 右侧表格
      multipleSelection: [],
      multipleSelectionSave: [],
      loading: true,
      rightBoxHeight: 100,
      more: false
    }
  },
  computed: {
    rmdId () {
      return this.$store.getters.selectDeviceRmdId
    }
  },
  methods: {
    initData () {
      this.interFace()
    },
    interFace (_type, _search) {
      let self = this
      self.loading = true
      let params = new URLSearchParams()
      params.append('search', _search || '')
      params.append('type', _type || '')
      params.append('RMD_ID', this.rmdId)
      params.append('arg', JSON.stringify({
        page: this.tablePage,
        rows: this.tableRows
      }))
      // 调用封装方法
      agent.askToServer('BFProParam', 'getProParamByEquId', params).then((res) => {
        res.data.rows.forEach(item => {
          item.checked = false
        })
        self.tableData = res.data.rows
        self.tableTotal = parseInt(res.data.total)

        setTimeout(() => { self.loading = false }, 300)
      }).then((res) => {
        if (self.first) {
          self.multipleSelectionSave = this.$store.getters.getDataItems
          self.multipleSelection = self.multipleSelectionSave.slice()
          if (self.multipleSelection.length > 0) {
            self.tableData.forEach(item => {
              self.multipleSelection.forEach(row => {
                if (item.EAF_ID === row.EAF_ID) {
                  item.checked = true
                  self.$refs.multipleTable.toggleRowSelection(item, true)
                }
              })
            })
            self.tableData2 = self.multipleSelection
          }
          self.first = false
        } else {
          self.tableData.forEach(item => {
            self.multipleSelection.forEach(row => {
              if (item.EAF_ID === row.EAF_ID) {
                item.checked = true
                self.$refs.multipleTable.toggleRowSelection(item, true)
              }
            })
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 切换每页条数的时候触发
    handleSizeChange (val) {
      this.tableRows = val
      if (!this.init) {
        this.interFace(this.type, this.inputLeft)
      } else {
        this.interFace()
      }
    },
    handleCurrentChange (val) {
      this.tablePage = val
      if (!this.init) {
        this.interFace(this.type, this.inputLeft)
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
      this.interFace(this.type, this.inputLeft)
    },
    selectSingle (rows, row) { // 单个
      let self = this
      row.checked = !row.checked

      if (row.checked) {
        if (self.multipleSelection.length === 10) {
          self.$refs.multipleTable.toggleRowSelection(row)
          row.checked = !row.checked
          this.$layer.alert('数据项最多选择10项!')
          return false
        } else {
          self.multipleSelection.push(row)
        }
      } else {
        self.multipleSelection.forEach((item, index) => {
          if (item.EAF_ID === row.EAF_ID) {
            self.multipleSelection.splice(index, 1)
          }
        })
      }
    },
    selectAll (rows) { // 全选
      let self = this
      let count = rows.length
      // 全选/反选
      // 如果当前页全选时已经有选中项，则总长度减一
      self.tableData.forEach(item => {
        self.multipleSelection.forEach(cont => {
          if (item.EAF_ID === cont.EAF_ID) {
            count--
          }
        })
      })
      // 已选中项加全选项大于10，则提示最多选中10项
      if (self.multipleSelection.length + count > 10) {
        this.more = true
        this.$layer.alert('数据项最多选择10项!')
        return false
      }
      // 长度等于0为取消全选
      if (rows.length !== 0) {
        self.tableData.forEach(item => {
          if (!item.checked) {
            item.checked = true
            self.multipleSelection.push(item)
          }
        })
      } else {
        self.tableData.forEach(item => {
          item.checked = false
          self.multipleSelection.forEach((row, index) => {
            if (row.EAF_ID === item.EAF_ID) {
              self.multipleSelection.splice(index, 1)
            }
          })
        })
      }
    },
    removeRow (row) { // 右侧表格移除
      let self = this
      this.tableData.forEach(item => {
        if (item.EAF_ID === row.EAF_ID) {
          self.$refs.multipleTable.toggleRowSelection(item, false)
        }
      })
      row.checked = false
      let index = this.multipleSelection.indexOf(row)
      this.multipleSelection.splice(index, 1)
    },
    isHandle ({row, column, rowIndex, columnIndex}) {
      if (column.label === '操作') {
        return 'padding:4px 0'
      }
    },
    onSubmit () {
      this.$layer.close(this.layerid)
      this.multipleSelectionSave = this.multipleSelection.slice()
      this.$store.commit('saveDataItems', this.multipleSelectionSave)
    },
    cancle () {
      this.$layer.close(this.layerid)
    }
  },
  watch: {
    multipleSelection (val) {
      this.tableData2 = val
    },
    more: function (value) {
      if (value) {
        // 清除当前页面的选中
        this.$refs.multipleTable.clearSelection()
        // 之前已经选中的选回来
        this.tableData.forEach(item => {
          this.multipleSelection.forEach(cont => {
            if (item.EAF_ID !== cont.EAF_ID) {
              this.$refs.multipleTable.toggleRowSelection(item)
            }
          })
        })
        this.more = false
      }
    }
  },
  mounted () {
    let self = this
    this.initData()
    this.$nextTick(() => {
      self.rightBoxHeight = self.$refs.box.clientHeight - 321
    })
  }
}
</script>

<style lang='scss' scoped>
@import "assets/css/variable.scss";
.info{
    width:100%;
    height: 100%;
    font-family: $fontFamily;
    color:$color;
    .row{
      width:100%;
      display: flex;
      justify-content: center;
      .info-left,.info-right{
        width: 48%;
        text-align: center;
        header{
          height:32px;
          line-height: 32px;
          margin:10px 0;
          font-size:$small;
          border:$border;
          font-weight: $fontWeight-7;
          padding-left:10px;
        }
        .row1{
            display: flex;
            padding:10px 0;
            .el-button{
            margin-left:20px;
            }
        }
      }
      .info-right{
        .el-table--small td, .el-table--small td:last-child {
            padding: 4px 0;
        }
      }
      .info-center{
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            color:#fff;
            width:40px;
            height:28px;
            border-radius: 4px;
            background-color: rgba(121, 193, 196,1);
          }
      }
    }
    .row2 {
      text-align: center;
      margin:10px 0;
    }
}
</style>
