<template>
<div id="main">
    <el-table :data='tableData'>
        <el-table-column type='index' align='center'></el-table-column>
        <el-table-column prop='EAF_ICON' label='图标' align='center'>
          <template slot-scope="scope">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="scope.row.EAF_ICON"></use>
            </svg>
          </template>
        </el-table-column>
        <el-table-column prop='EAF_DSC' label='说明' align='center'></el-table-column>
    </el-table>
</div>
</template>

<script>
export default{
  props: {
    value: {
      type: String
    },
    layerid: {
      type: String,
      default: ''
    },
    nomal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    JSON.parse(this.value).forEach(res => {
      if (!this.nomal) {
        if (res.EAF_NAME !== '正常') {
          this.tableData.push({
            EAF_ICON: res.RMD_URL,
            EAF_DSC: res.EAF_NAME
          })
        }
      } else {
        this.tableData.push({
          EAF_ICON: res.RMD_URL,
          EAF_DSC: res.EAF_NAME
        })
      }
    })
  }
}
</script>
