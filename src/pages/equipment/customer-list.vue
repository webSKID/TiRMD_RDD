<template>
  <div class="web">
    <el-container>
      <el-header>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{path:'/equipment/customer-list'}">客户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-row class="content">
          <!-- 查询条件 -->
          <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
            <el-form-item>
              <el-autocomplete v-model="ruleForm.user" :fetch-suggestions="customerFetch" @keyup.enter.native="seach('ruleForm')" placeholder="请输入客户名称" clearable :trigger-on-focus="false"></el-autocomplete>
            </el-form-item>
            <el-form-item>
              <el-select v-model="ruleForm.region" multiple collapse-tags placeholder="请选择城市" clearable>
                <el-option v-for="item in regionArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="seach('ruleForm')">查询</el-button>
          </el-form>
        </el-row>
        <!-- 表格 -->
        <el-table v-loading="loading" element-loading-text="拼命加载中" ref="singleTable" @row-dblclick="dbClickRow" stripe border style="width:100%;box-sizing:border-box;" :data="tableData">
          <el-table-column prop="EAF_NAME" label="客户名称" align="center"></el-table-column>
          <el-table-column prop="RMD_CITY" label="城市" width="200" align="center"></el-table-column>
          <el-table-column prop="EAF_CREATETIME_STR" label="添加时间" align="center" npmshow-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pagesize" :total="totalLength" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getCustomerList, getRegion, getAutoComplete } from '@/assets/js/equipment'

export default {
  name: 'CustomerList',
  data () {
    return {
      loading: true,

      pagesize: 10, // 每页的数据条数
      currentPage: 1, // 表格当前页
      totalLength: 0,

      tableData: [],

      ruleForm: {
        user: '',
        region: []
      },
      userArr: [],
      regionArr: [],

      searchRules: []
    }
  },
  methods: {
    // 客户下拉框数据
    loadAllUser () {
      let self = this
      getAutoComplete('RMD_DEPOT', 'EAF_NAME').then((res) => {
        if (!res.data.EAF_ERROR) {
          self.deviceRes = res.data
          self.userArr = res.data
        }
      })
    },
    // 城市下拉框数据
    loadAllRegion () {
      let self = this
      getRegion('RMD_EQUIP', 'RMD_CITY').then((res) => {
        if (!res.data.EAF_ERROR) {
          self.regionArr = res.data
        }
      })
    },
    // 客户联想数据
    customerFetch (queryString, cb) {
      var userArr = this.userArr
      var results = queryString ? userArr.filter(this.createFilter(queryString)) : userArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 联想数据过滤
    createFilter (queryString) {
      return results => {
        return (
          results.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    // 表格数据
    getTableData (_page, _row, _rule) {
      let self = this
      self.loading = true // 显示loading
      getCustomerList(_page, _row, _rule).then((res) => {
        if (!res.data.EAF_ERROR) {
          self.tableData = res.data.rows
          self.totalLength = parseInt(res.data.total)
          setTimeout(() => {
            self.loading = false // 隐藏loading
          }, 500)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 改变页数
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getTableData(this.currentPage, this.pagesize, this.searchRules)
    },
    // 改变每页条数
    handleSizeChange (size) {
      this.pagesize = size
      this.currentPage = 1
      this.getTableData(this.currentPage, this.pagesize, this.searchRules)
    },
    // 双击行
    dbClickRow: function (row) {
      this.$router.push({
        name: 'CustomerDetail',
        params: {
          eafId: row.EAF_ID
        }
      })
    },
    // 查询
    seach (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.searchRules = []
          // 客户
          if (this.ruleForm.user) {
            const jsonObj = {}
            jsonObj.queryType = 'text'
            jsonObj.fieldName = 'EAF_NAME'
            jsonObj.data = this.ruleForm.user
            this.searchRules.push(jsonObj)
          }
          // 城市
          if (this.ruleForm.region.length !== 0) {
            const jsonObj = {}
            jsonObj.queryType = 'list'
            jsonObj.fieldName = 'RMD_CITY'
            jsonObj.data = this.ruleForm.region
            this.searchRules.push(jsonObj)
          }
          this.currentPage = 1
          this.getTableData(this.currentPage, this.pagesize, this.searchRules)
        }
      })
    }
  },
  mounted () {
    this.getTableData(this.currentPage, this.pagesize)
    this.loadAllUser()
    this.loadAllRegion()
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.web {
  display: flex;
  background-color: #E9EEF3;
  overflow: auto;
  .el-container {
    .el-header {
      height: 30px !important;
      background-color: #e4e7ed;
      .el-breadcrumb {
        line-height: 30px;
      }
    }
    .el-main {
      text-align: center;
      .content {
        height: 50px !important;
        line-height: 50px;
        .el-form {
          line-height: 50px;
          text-align: left;
          .el-form-item{
            margin:0;
            padding:0;
            line-height: 50px;
            .el-autocomplete{
              line-height: 50px;
            }
            .el-select{
              line-height: 50px;
              margin-left:20px;
            }
          }
          .el-button{
            margin-left:20px;
          }
        }
      }
      .el-pagination{
        background: #fff;
      }
    }
  }
}
</style>
