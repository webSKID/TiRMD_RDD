<template>
  <div class="info">
    <el-container>
      <el-header>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/repair/repair-list' }">维修单管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="进行中" name="first">
            <TableList v-if="activeName=='first'" tab-type='doing'></TableList>
          </el-tab-pane>
          <el-tab-pane label="已关闭" name="second">
            <TableList v-if="activeName=='second'" tab-type='close'></TableList>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// 维修单tab页面
import TableList from 'pages/repair/component/repair-tab'
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {
    TableList
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.info {
  color: #333;
  background: #e9eef3;
  overflow: auto;
  .el-header {
    background-color: #e4e7ed;
    height: 30px !important;
    .el-breadcrumb {
      line-height: 30px;
    }
  }
  .el-main{
    padding-left: 0;
  }
}
</style>
