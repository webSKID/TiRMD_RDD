<template>
    <div class='info' v-loading="loading" element-loading-text="拼命加载中">
      <el-row class="main-row" type="flex" justify="space-around">
        <el-col :span="11">
          <h2>维修单内容</h2>
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="故障类型：" >
              <el-select v-model="form.troubleType" placeholder="请选择">
                <el-option :title="item.EAF_NAME" v-for='item in typeOptions' :key='item.EAF_ID' :label="item.EAF_NAME" :value="item.EAF_ID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="故障描述：">
              <el-input :title="form.desc" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="故障位置：">
              <el-input :title="form.position" v-model="form.position"></el-input>
            </el-form-item>
            <el-form-item label="发生时间：">
              <el-col>
                <el-date-picker
                  v-model="form.date"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  style="width: 100%;">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <p>
              <label class="leftLable">设备名称：</label>
              <span class="rightSpan" :title="form.deviceEafName">{{form.deviceEafName}}</span>
            </p>
            <p>
              <label class="leftLable">设备编码：</label>
              <span class="rightSpan" :title="form.deviceRmdId">{{form.deviceRmdId}}</span>
            </p>
            <el-form-item label="故障来源：">
              <el-input :title="form.source" type="textarea" :rows="3" v-model="form.source"></el-input>
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
        <el-button type="primary" @click="onSubmit">派发</el-button>
      </el-row>
    </div>
</template>
<script>
import agent from '@/assets/js/agent'
import manba from 'manba'
import commonCons from 'assets/js/commonConstant'

export default{
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
      propRow: {}, // prop行数据
      treeData: [], // tree树形数据
      typeOptions: [], // 设备类型数据
      form: {
        troubleType: '',
        desc: '',
        position: '',
        date: '',
        deviceEafId: '',
        deviceEafName: '',
        deviceRmdId: '',
        source: '',
        repairMan: '',
        repairDepot: '',
        troubleId: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: true
    }
  },
  methods: {
    // 初始化数据
    initData () {
      this.propRow = JSON.parse(this.parentRow)
      this.form.date = manba().format('YYYY-MM-DD h:mm:ss')
      this.form.deviceEafId = this.propRow.EQUIPT_EAF_ID
      this.form.deviceEafName = this.propRow.EQUIPT_NAME
      this.form.deviceRmdId = this.propRow.RMD_ID
      this.form.troubleId = this.propRow.EAF_ID
      this.form.source = `故障名称:${this.propRow.EAF_NAME ? this.propRow.EAF_NAME : ''}\n发生时间:${this.propRow.RMD_OCCURTIME_STR ? this.propRow.RMD_OCCURTIME_STR : ''}\n故障描述:${this.propRow.RMD_TROUBLE_DESC ? this.propRow.RMD_TROUBLE_DESC : ''}\n`
      // this.form.source = ''
      // this.form.source += '故障名称:' + (this.propRow.EAF_NAME ? this.propRow.EAF_NAME : '') + '\n'+ '发生时间:' + (this.propRow.RMD_OCCURTIME_STR ? this.propRow.RMD_OCCURTIME_STR : '') + '\n'+ '故障描述:' + (this.propRow.RMD_TROUBLE_DESC ? this.propRow.RMD_TROUBLE_DESC : '') + '\n'
    },
    // 加载设备类型
    loadTroubleType () {
      let self = this
      let params = new URLSearchParams()
      params.append('filterRules', '{}')
      params.append('clsid', commonCons.getConstant('majorId'))
      // 调用封装方法
      agent.askToServer('RuleEngine', 'GetObjectsByClsByRule', params).then((res) => {
        self.typeOptions = res.data.rows
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取树形数据
    getTreeData () {
      let self = this
      self.loading = true
      let params = new URLSearchParams()
      params.append('deviceEafId', self.form.deviceEafId)
      // 调用封装方法
      agent.askMasterToServer('BFRepairOrder', 'getReporterData', 'data', params).then((res) => {
        if (Object.keys(res.data).length === 0) {
          self.treeData = []
        } else {
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
        }, 300)
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
    // 派发操作
    distributeRepair () {
      let self = this
      let arrTrouble = []
      let objTrouble = {}
      objTrouble = {
        'RMD_STATUS': 'doing', // 保修状态
        'RMD_TROUBLE_TYPE': this.form.troubleType, // 故障类型EAF_ID
        'RMD_TROUBLE_DESC': this.form.desc, // 故障描述
        'RMD_TROUBLE_PLACE': this.form.position, // 故障位置
        'RMD_OCCURTIME': this.form.date, // 发生时间
        'RMD_BELONG_EQUIP': this.form.deviceEafId, // 设备EAF_ID
        'RMD_TROUBLE_SOURCE': this.form.source, // 故障来源
        'RMD_REPORTER': this.form.repairMan, // 报修人
        'RMD_REP_DEPOT_ID': this.form.repairDepot // 报修人所属客户
      }
      arrTrouble.push(objTrouble)
      let params = new URLSearchParams()
      params.append('troubleId', this.form.troubleId)
      params.append('arrFile', '')
      params.append('arrRepairOrder', JSON.stringify(arrTrouble))
      // 调用封装方法
      agent.askMasterToServer('BFRepairOrder', 'sendRepairOrder', 'data', params).then((res) => {
        console.log(res.data.flag)
        if (res.data.flag) {
          self.$alert('派发成功', '提示', {
            confirmButtonText: '确定'
          })
          self.$layer.close(self.layerid)
          self.$parent.searchTable()
        } else {
          self.$alert('派发失败', '提示', {
            confirmButtonText: '确定'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    onSubmit () {
      if (!this.form.repairMan) {
        this.$alert('没有选择报修人,无法派发', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.distributeRepair()
      }
    }
  },
  mounted () {
    this.initData()
    this.loadTroubleType()
    this.getTreeData()
  }
}
</script>

<style lang="scss" scoped>
.info {
  width:100%;
  height:100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  .main-row{
    flex: 1;
    margin-bottom: 10px;
    & >.el-col{
      display: flex;
      flex-direction: column;
      border: 1px solid #ccc;
      h2{
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
      }
      .el-form{
        flex: 1;
        margin: 10px;
        .el-form-item {
          margin-bottom: 10px;
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
      }
      .el-tree{
        flex: 1;
        margin: 10px;
      }
    }
  }
  .footer-row{
    height: 50px;
  }
}
</style>
