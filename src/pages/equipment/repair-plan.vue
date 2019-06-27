<template>
  <div id="info" class="info">
    <el-header height="30px">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/equipment/equipment-list' }">设备列表</el-breadcrumb-item>
        <el-breadcrumb-item>检修计划</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main>
      <div class="search-content">
        <span>{{equipmentName}}</span>
        <span>{{equipmentCode}}</span>
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-input v-model="form.orderPlan" placeholder="请输入修程名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.orederModel" placeholder="请输入工单名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="primary" @click="createDialog">创建检修计划</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width:99.8%"
        border
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="RES_RMD_REPAIR_CLS_EAF_NAME" label="修程" align="center"></el-table-column>

        <el-table-column prop="RMD_CYCLE_V" label="周期" align="center">
          <template slot-scope="scope">
            <span>{{scope.row | cycleFilter}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="RMD_REPAIR_TIME" label="最近检修日期" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column prop="RES_RMD_ORDER_MODEL_EAF_NAME" label="工单模版" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="jumpToOrderTemplate(scope.$index,scope.row)">{{scope.row.RES_RMD_ORDER_MODEL_EAF_NAME}}</a>
          </template>
        </el-table-column>

        <el-table-column prop="RES_RMD_REPAIR_P_EAF_NAME" label="检修人" align="center"></el-table-column>

        <el-table-column prop="RES_EAF_MODIFIER_EAF_NAME" label="最后更新人" align="center"></el-table-column>

        <el-table-column prop="EAF_MODIFYTIME_STR" label="最后更新时间" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" align="center" width='180'>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="width:99.8%"
        :total="tableTotal"
        :current-page="tablePage"
        :page-sizes="tableList"
        :page-size="tablePageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-main>
  </div>
</template>

<script>
import { getRepairPlanDatas, deleteRepairPlanRow } from 'assets/js/equipment.js'
// 创建、填报、查看弹窗
import RepairCreate from 'pages/equipment/component/repair-plan-create'
export default {
  name: 'repair-plan',
  data () {
    return {
      page: 1,
      row: 10,
      equimentId: '', // 设备id
      equipmentName: '',
      equipmentCode: '',
      form: {
        orderPlan: '',
        orederModel: ''
      },
      searchRules: [],
      tableTotal: 0, // 总条数
      tablePage: 1, // 表格当前页
      tablePageSize: 10, // 表格初始化每页显示条数
      tableList: [10, 20, 30], // 表格每页显示条数
      tableData: [],
      loading: false
    }
  },
  filters: {
    cycleFilter (row) { // 周期格式化
      let first = row.RMD_CYCLE_V
      let second = row.RMD_CYCLE_UNIT
      if (first) {
        if (second === 'DAY') {
          return first + '天'
        } else if (second === 'WEEK') {
          return first + '周'
        } else if (second === 'MOUTH') {
          return first + '月'
        } else if (second === 'YEAR') {
          return first + '年'
        } else {
          return first
        }
      } else {
        return ''
      }
    }
  },
  created () {
    this.equimentId = this.$route.params.equipId // 设备id
    this.equipmentName = this.$route.params.equipName
    this.equipmentCode = this.$route.params.equipCode
  },
  methods: {
    search () { // 查询
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.searchRules = []
          this.searchRules.equimentId = this.equimentId
          this.searchRules.orderPlan = this.form.orderPlan
          this.searchRules.orederModel = this.form.orederModel
          this.tablePage = 1
          this.getTableData()
        }
      })
    },
    getTableData () { // 表格初始化
      let self = this
      this.loading = true
      getRepairPlanDatas(this.tablePage, this.tablePageSize, this.searchRules)
        .then(res => {
          self.tableData = res.data.rows
          self.tableTotal = parseInt(res.data.total)
          setTimeout(() => {
            self.loading = false
          }, 500)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 切换每页条数的时候触发
    handleSizeChange (val) {
      // 每页条数
      this.tablePage = 1
      this.tablePageSize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      // 当前页
      this.tablePage = val
      this.getTableData()
    },
    autoSize (_w, _h, _lk) {
      if (_lk) return [(window.innerWidth * _w > _lk ? _lk : window.innerWidth * _w) + 'px', window.innerHeight * _h + 'px']
      return [window.innerWidth * _w + 'px', window.innerHeight * _h + 'px']
    },
    // 创建弹框
    createDialog () {
      let self = this
      this.$layer.iframe({
        content: {
          content: RepairCreate,
          parent: this,
          data: {
            equimentId: this.equimentId,
            layerid: this.$layer.id,
            parentType: 'create'
          }
        },
        area: self.autoSize(1, 0.8, 1900),
        title: '创建检修计划'
      })
    },
    handleEdit (index, row) { // 修改
      let self = this
      this.$layer.iframe({
        content: {
          content: RepairCreate,
          parent: this,
          data: {
            layerid: this.$layer.id,
            equimentId: this.equimentId,
            modifyData: JSON.stringify({
              'RMD_DEVICE': row.RMD_DEVICE, // 所属设备ID
              'RMD_REPAIR_CLS': row.RMD_REPAIR_CLS, // 修程ID
              'RMD_CYCLE_V': row.RMD_CYCLE_V, // 周期数值
              'RMD_CYCLE_UNIT': row.RMD_CYCLE_UNIT, // 周期单位
              'RES_RMD_ORDER_MODEL_EAF_NAME': row.RES_RMD_ORDER_MODEL_EAF_NAME, // 工单模板名字
              'RMD_ORDER_MODEL': row.RMD_ORDER_MODEL, // 工单模板
              'RMD_ORDER_MODEL_V': row.RMD_ORDER_MODEL_V, // 工单模板实例，修改时才有值，新建时传空
              'RES_RMD_REPAIR_P_EAF_NAME': row.RES_RMD_REPAIR_P_EAF_NAME, // 检修人
              'RMD_REPAIR_P': row.RMD_REPAIR_P, // 检修人id
              'RMD_REPAIR_TIME': row.RMD_REPAIR_TIME, // 检修时间
              'EAF_ID': row.EAF_ID// 修改时才有值，新建时传空
            }),
            parentType: 'modify'
          }
        },
        area: self.autoSize(1, 0.8, 1900),
        title: '创建检修计划'
      })
    },
    handleDelete (index, row) { // 删除
      let self = this
      self.$confirm('此操作将永久删除该条维修单, 是否继续？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id1 = row.EAF_ID
        let id2 = row.RMD_ORDER_MODEL_V
        deleteRepairPlanRow(id1, id2).then(res => {
          if (!res.data.EAF_ERROR && Object.keys(res.data).length !== 0) {
            if (res.data.flag) {
              self.search()
              self.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
            } else {
              self.$message({
                showClose: true,
                message: '删除失败',
                type: 'warning'
              })
            }
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    jumpToOrderTemplate (index, row) { // 工单模板跳转
      this.$store.commit('setKeepAliveRoute', 'repair-plan')
      setTimeout(() => {
        let modelId = row.RMD_ORDER_MODEL_V
        let equipName = row.RES_RMD_ORDER_MODEL_EAF_NAME
        this.$router.push({name: 'order-template', params: {equimentId: this.equimentId, equipmentName: this.equipmentName, equipmentCode: this.equipmentCode, modelId: modelId, equipName: equipName}})
      })
    }
  },
  mounted () {
    this.searchRules.equimentId = this.equimentId
    this.getTableData()
  },
  beforeDestroy () {
    this.$store.commit('removeKeepAliveRoute', 'equipment-list')
  }
}
</script>

<style lang="scss" scoped>
.info {
  background: #e9eef3;
  overflow: auto;
  .el-header {
    background-color: #e4e7ed;
    color: #333;
    text-align: center;
    line-height: 30px;
    .el-breadcrumb {
      line-height: 30px;
    }
  }
  .el-main {
    text-align: center;
    .search-content {
      display: flex;
      align-items: center;
      line-height: 50px;
      span {
        display: inline-block;
        margin: 0 10px;
      }
      .el-form {
        display: flex;
        .el-form-item {
          margin: 0;
          padding: 0;
          margin-right: 10px;
        }
      }
    }
    .el-pagination {
      background: #fff;
      text-align: center;
    }
  }
  a{
    text-decoration: underline;
    color:blue;
    cursor: pointer;
    display:block;
    &:hover{
      color:red;
    }
  }
}
</style>
