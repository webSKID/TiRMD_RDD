<template>
    <div class='info'>
      <iframe name = "child" id = "child" v-bind:src="localhostPath" frameborder="0" scrolling="no"></iframe>
      <input type="hidden" id="eaf_apppath" name="eaf_apppath" value=""/>
    </div>
</template>
<script>
export default {
  props: {
    layerid: {
      type: String,
      default: ''
    },
    parentRow: {
      type: String
    }
  },
  data () {
    return {
      propRow: {}, // 父组件表格行数据
      localhostPath: ''
    }
  },
  methods: {
    initData () {
      let self = this
      self.loading = true
      this.propRow = JSON.parse(this.parentRow)
      let hostname = window.document.location.hostname
      let port = window.document.location.port
      // let port = '9193'
      self.localhostPath = 'http://' + hostname + ':' + port + '/RDD/repair/checkPage.jsp?troubleState=' + self.propRow.RMD_TRUE_TROUBLE + '&date=' + self.propRow.RMD_OCCURTIME_NAME + '&troubleType=' + self.propRow.TROUBLE_TYPE_NAME + '&troubleDesc=' + self.propRow.RMD_TROUBLE_DESC + '&troublePosition=' + self.propRow.RMD_TROUBLE_PLACE + '&deviceName=' + self.propRow.EAF_NAME + '&deviceCode=' + self.propRow.EAF_CODE + '&troubleSource=' + self.propRow.RMD_TROUBLE_SOURCE + '&changePartName=' + self.propRow.PARTARR_NAME + '&repairDetail=' + self.propRow.RMD_DETAIL + '&eafId=' + self.propRow.EAF_ID
    },
    cancle () {
      this.$layer.close(this.layerid)
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
<style scoped lang="scss">
.info {
  width:100%;
  height:100%;
  text-align: center;
  display: flex;
  flex-direction: column;
}
</style>
