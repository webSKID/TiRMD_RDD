<template>
  <div class="info">
    <el-header height="30px">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/equipment/equipment-list' }">设备列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'repair-plan',params:{equipId:equimentId,equipName:equipmentName,equipCode:equipmentCode} }">检修计划</el-breadcrumb-item>
        <el-breadcrumb-item>查看工单模版</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main>
      <h1>{{templateName}}</h1>
      <el-table :data='tableData' v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column prop='EAF_NAME' label='项' align='center'></el-table-column>
        <el-table-column prop='RMD_ITME' label='检查项' align='center'></el-table-column>
        <el-table-column prop='RMD_DES' label='描述' align='center'></el-table-column>
        <el-table-column prop='ENUM_RMD_CHECK_ME_TEXT' label='检查方式' align='center'></el-table-column>
        <el-table-column prop='RMD_PHOTO' label='必须拍照' align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.RMD_PHOTO | BooleanFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='RMD_REDIO' label='必须视频' align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.RMD_REDIO | BooleanFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='RMD_CHA_PART' label='更换部件' align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.RMD_CHA_PART | BooleanFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='RES_RMD_PART_EAF_NAME' label='部件' align='center'></el-table-column>
        <el-table-column prop='EAF_CODE' label='编码' align='center'></el-table-column>
        <el-table-column prop='RMD_UPPER' label='上限' align='center'></el-table-column>
        <el-table-column prop='RMD_LOWER' label='下限' align='center'></el-table-column>
        <el-table-column prop='ENUM_RMD_UNIT_TEXT' label='单位' align='center'></el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
import { getOrderTemplateItem } from 'assets/js/equipment.js'
export default {
  name: 'order-template',
  data () {
    return {
      equimentId: '',
      equipmentName: '',
      equipmentCode: '',
      templateName: '',
      modelId: '',
      tableData: [],
      loading: true
    }
  },
  created () {
    this.equimentId = this.$route.params.equimentId
    this.equipmentName = this.$route.params.equipmentName
    this.equipmentCode = this.$route.params.equipmentCode
    this.templateName = this.$route.params.equipName
    this.modelId = this.$route.params.modelId
  },
  filters: {
    BooleanFilter (val) {
      if (val === 'Y') {
        return '是'
      } else {
        return '否'
      }
    }
  },
  methods: {
    getOrderTemplateItem (id) { // 工单模板跳转
      this.loading = true
      getOrderTemplateItem(id).then(res => {
        this.tableData = res.data
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  mounted () {
    this.getOrderTemplateItem(this.modelId)
  },
  beforeDestroy () {
    this.$store.commit('removeKeepAliveRoute', 'repair-plan')
  }
}
</script>
<style lang="scss" scoped>
.info{
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
  .el-main{
    h1{
      font-size:20px;
      color:#333;
      height:32px;
      font-weight: 700;
    }
  }
}
</style>
