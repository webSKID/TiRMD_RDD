<template>
    <div class='info' v-loading="loading" element-loading-text="拼命加载中">
      <el-row class="main-row" type="flex" justify="space-around">
        <el-col :span="11">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="故障类型：" >
              <el-select v-model="form.troubleType" placeholder="请选择">
                <el-option v-for='item in troubleTypeOptions' :key='item.EAF_ID' :label="item.EAF_NAME" :value="item.EAF_ID" :title="item.EAF_NAME"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发生时间：">
              <el-col>
                <el-date-picker
                  v-model="form.date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"

                  :clearable='false'
                  style="width: 100%;">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="故障描述：">
              <el-input v-model="form.troubleDesc" :title="form.troubleDesc"  maxlength='50'></el-input>
            </el-form-item>
            <el-form-item label="故障位置：">
              <el-input v-model="form.troublePos" :title="form.troublePos"  maxlength='50'></el-input>
            </el-form-item>
            <el-form-item label="设备：" v-if="parentType=='create'">
              <el-col :span="17">
                 <input class='device-input' disabled type="text" :title="deviceInput" placeholder="请选择设备" v-model="deviceInput" />
              </el-col>
              <el-col :span="5" :offset="1">
                <el-button class="device-button" type="primary" icon='el-icon-circle-plus-outline' @click="selectDevice">选择</el-button>
              </el-col>
            </el-form-item>
            <p v-if="parentType=='distribute'">
              <label class="leftLable">设备名称：</label>
              <span class="rightSpan" :title="form.deviceEafName">{{form.deviceEafName}}</span>
            </p>
            <p v-if="parentType=='distribute'">
              <label class="leftLable">设备编码：</label>
              <span class="rightSpan" :title="form.deviceRmdId">{{form.deviceRmdId}}</span>
            </p>
            <el-form-item label="故障来源：">
              <el-input type="textarea" v-model="form.troubleSource" :title="form.troubleSource" :rows="9" maxlength='500' show-word-limit resize="none"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="11">
          <h2>报修人</h2>
          <el-tree ref='tree' :data="treeData" node-key="id" highlight-current :props="defaultProps" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="data.icon"></use>
                </svg>{{ node.label }}
              </span>
          </el-tree>
        </el-col>
      </el-row>
      <el-row class="footer-row">
        <el-button type="primary" @click="onSubmit">创建</el-button>
      </el-row>
    </div>
</template>
<script>
import SelectDevice from 'pages/analytical/component/select-device'
import {troubleType, getReporter, sendRepairOrder} from '@/assets/js/repair'
import manba from 'manba'
export default{
  props: {
    layerid: {
      type: String,
      default: ''
    },
    parentType: {
      type: String
    },
    parentRow: {
      type: String
    }
  },
  data () {
    return {
      propRow: {}, // prop行数据
      troubleTypeOptions: [], // 故障类型数据
      form: {},
      treeData: [], // tree树形数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: false
    }
  },
  methods: {
    // 初始化数据
    initData () {
      this.form = {
        troubleType: '', // 故障类型
        troubleDesc: '', // 故障描述
        troublePos: '', // 故障位置
        date: manba().format('YYYY-MM-DD h:mm:ss'), // 发生时间
        deviceDisEafId: '', // 设备id
        deviceEafName: '', // 设备name
        deviceRmdId: '', // 设备编码
        troubleSource: '', // 故障来源
        repairMan: '', // 报修人
        repairDepot: '', // 所属车辆段
        troubleId: '' // 故障id
      }
      if (this.parentType === 'distribute') {
        this.propRow = JSON.parse(this.parentRow)
        this.form.deviceDisEafId = this.propRow.EQUIPT_EAF_ID
        this.form.date = this.propRow.RMD_OCCURTIME_STR
        this.form.deviceEafName = this.propRow.EQUIPT_NAME
        this.form.deviceRmdId = this.propRow.RMD_ID
        this.form.troubleSource = `故障名称:${this.propRow.EAF_NAME ? this.propRow.EAF_NAME : ''}\n发生时间:${this.propRow.RMD_OCCURTIME_STR ? this.propRow.RMD_OCCURTIME_STR : ''}\n故障描述:${this.propRow.RMD_TROUBLE_DESC ? this.propRow.RMD_TROUBLE_DESC : ''}\n`
        this.form.troubleId = this.propRow.EAF_ID
      }
      // this.form.source = ''
      // this.form.source += '故障名称:' + (this.propRow.EAF_NAME ? this.propRow.EAF_NAME : '') + '\n'+ '发生时间:' + (this.propRow.RMD_OCCURTIME_STR ? this.propRow.RMD_OCCURTIME_STR : '') + '\n'+ '故障描述:' + (this.propRow.RMD_TROUBLE_DESC ? this.propRow.RMD_TROUBLE_DESC : '') + '\n'
    },
    // 加载设备类型
    loadTroubleType () {
      let self = this
      troubleType().then(res => {
        if (!res.data.EAF_ERROR) {
          self.troubleTypeOptions = res.data.rows
        }
      })
    },
    // 自定义layer弹框大小
    autoSize (_w, _h, _lk) {
      if (_lk) return [(window.innerWidth * _w > _lk ? _lk : window.innerWidth * _w) + 'px', window.innerHeight * _h + 'px']
      return [window.innerWidth * _w + 'px', window.innerHeight * _h + 'px']
    },
    // 选择设备
    selectDevice () { // 选择设备
      this.$layer.iframe({
        content: {
          content: SelectDevice,
          parent: this,
          data: {
            layerid: this.$layer.id,
            parentType: 'repair'
          }
        },
        area: ['700px', '600px'],
        title: '设备列表'
      })
    },
    // 获取树形数据
    getTreeData () {
      let self = this
      self.loading = true
      self.treeData = []
      getReporter(self.parentType, self.form.deviceDisEafId, self.deviceEafId).then((res) => {
        if (Object.keys(res.data).length !== 0) {
          // 前端特殊处理初始最外两层
          let arry1 = {
            label: '设备关联用户',
            children: res.data.arrayData
          }
          let arry2 = {
            label: '其它用户',
            children: res.data.arrayData1
          }
          self.treeData.push(arry1)
          self.treeData.push(arry2)
        }
        setTimeout(() => {
          self.loading = false
        }, 500)
      }).catch((error) => {
        console.log(error)
      })
    },
    // 树形节点点击
    handleNodeClick (data, node) {
      let self = this
      if (node.childNodes.length > 0) {
        self.form.repairMan = ''
        self.form.repairDepot = ''
      } else {
        self.form.repairMan = data.id
        self.form.repairDepot = data.Pid
      }
    },
    onSubmit () {
      if (!this.form.repairMan) {
        this.$confirm('没有选择报修人,无法创建', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      } else {
        let self = this
        self.loading = true
        let arrTrouble = []
        let objTrouble = {}
        objTrouble = {
          'RMD_STATUS': 'doing', // 保修状态
          'RMD_TROUBLE_TYPE': this.form.troubleType, // 故障类型EAF_ID
          'RMD_TROUBLE_DESC': this.form.troubleDesc, // 故障描述
          'RMD_TROUBLE_PLACE': this.form.troublePos, // 故障位置
          'RMD_OCCURTIME': this.form.date, // 发生时间
          'RMD_BELONG_EQUIP': self.parentType === 'distribute' ? self.form.deviceDisEafId : self.deviceEafId, // 设备EAF_ID
          'RMD_TROUBLE_SOURCE': this.form.troubleSource, // 故障来源
          'RMD_REPORTER': this.form.repairMan, // 报修人
          'RMD_REP_DEPOT_ID': this.form.repairDepot // 报修人所属车辆段
        }
        arrTrouble.push(objTrouble)
        let troubleId = this.parentType === 'distribute' ? this.form.troubleId : ''
        sendRepairOrder(arrTrouble, troubleId, '').then((res) => {
          self.loading = false
          if (res.data.flag) {
            self.$message({
              type: 'success',
              message: self.parentType === 'distribute' ? '派发成功!' : '创建成功'
            })
            self.$layer.close(self.layerid)
            self.$parent.searchTable()
          } else {
            self.$message.error(self.parentType === 'distribute' ? '派发失败!' : '创建失败')
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  },
  computed: {
    deviceInput () { // 车辆段反显数据
      return this.$store.getters.repairDeviceInput
    },
    deviceEafId () { // 设备EAF_ID
      return this.$store.getters.repairDeviceEafId
    }
  },
  mounted () {
    this.$store.commit('repairDeviceAllRemove')
    this.initData()
    this.loadTroubleType()
    if (this.parentType === 'distribute') {
      this.getTreeData()
    }
  },
  beforeDestroy () {
    this.$store.commit('repairDeviceAllRemove')
  }
}
</script>

<style lang="scss" scoped>
@import "assets/css/variable.scss";
.info {
  width:100%;
  height:100%;
  text-align: center;
  color: #909399;
  display: flex;
  flex-direction: column;
  .main-row{
    flex: 1;
    margin: 10px 0;
    & >.el-col{
      display: flex;
      flex-direction: column;
      &:first-child{
        border: 1px solid #ccc;
      }
      .el-form{
        flex: 1;
        margin: 10px;
        .el-form-item {
          margin-bottom: 10px;
          .el-select {
            display: flex;
          }
        }
        p{
          height: 32px;
          display: flex;
          flex-wrap: nowrap;
          .leftLable{
            width: 100px;
            padding-right: 12px;
            text-align: right;
          }
          .rightSpan{
            flex: 1;
            display: flex;
          }
        }
        .device-input{
          width: 100%;
          height:32px;
          line-height: 32px;
          background-color: #f5f7fa;
          background-image: none;
          border-radius: 4px;
          border: 1px solid #E4E7ED;
          box-sizing: border-box;
          display: inline-block;
          outline: 0;
          padding: 0 15px;
          color:#606266;
          cursor: not-allowed;
        }
      }
      h2{
        height:32px;
        line-height: 32px;
        margin:0 0 10px 0;
        font-size:$small;
        border:$border;
        font-weight: $fontWeight-7;
        padding-left:10px;
      }
      .el-tree{
        flex: 1;
        border: 1px solid #ccc;
        overflow: auto;
      }
    }
  }
  .footer-row{
    height: 50px;
  }
}
/* 日期框清空按钮隐藏 */
.el-date-editor .el-range__close-icon{
  display:none !important;
}
</style>
