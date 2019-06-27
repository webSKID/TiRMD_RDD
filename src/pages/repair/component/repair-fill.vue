<template>
    <div class='info'>
      <iframe name = "child" id = "child" v-bind:src="localhostPath" frameborder="0" scrolling="no"></iframe>
      <input type="hidden" id="eaf_apppath" name="eaf_apppath" value=""/>
      <input id="refresh" type="hidden" @click="refresh()">
    </div>
</template>
<script>
export default {
  props: {
    layerid: {
      type: String,
      default: ''
    },
    dialogType: {
      type: String
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
      // 故障来源和维修内容特殊处理
      let troubleSource = this.isEmpty4(self.propRow.RMD_TROUBLE_SOURCE)
      let repairDetail = this.isEmpty4(self.propRow.RMD_DETAIL)

      let hostname = window.document.location.hostname
      let port = window.document.location.port
      // let port = '9193'
      self.localhostPath = 'http://' + hostname + ':' + port + '/RDD/repair/fillPage.jsp?troubleState=' + self.propRow.RMD_TRUE_TROUBLE + '&date=' + self.propRow.RMD_OCCURTIME_NAME + '&troubleType=' + self.propRow.RMD_TROUBLE_TYPE + '&troubleDesc=' + self.propRow.RMD_TROUBLE_DESC + '&troublePosition=' + self.propRow.RMD_TROUBLE_PLACE + '&deviceName=' + self.propRow.EAF_NAME + '&deviceCode=' + self.propRow.EAF_CODE + '&troubleSource=' + troubleSource + '&changePartId=' + self.propRow.PARTARR_ID + '&repairDetail=' + repairDetail + '&dialogType=' + self.dialogType + '&deviceId=' + self.propRow.RMD_BELONG_EQUIP + '&eafId=' + self.propRow.EAF_ID + '&layerid=' + self.layerid
    },
    isEmpty4: function (val) {
      if (val) {
        val = this.getFormatCode(val)
      }
      return val
    },
    /*
    * 根据Value格式化为带有换行、空格格式的HTML代码
    * @param strValue {String} 需要转换的值
    * @return  {String}转换后的HTML代码
    */
    getFormatCode: function (strValue) {
      return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s+/g, '')
    },
    refresh () {
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      this.$parent.searchTable()
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
