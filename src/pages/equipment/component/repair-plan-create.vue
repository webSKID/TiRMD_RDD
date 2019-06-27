<template>
  <div class="info" v-loading="loading" element-loading-text="拼命加载中">
    <el-row class="main-row" type="flex" justify="space-around">
      <el-col :span="8">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item label="修程" prop='project'>
            <el-select v-model="form.project" placeholder="请选择" style="width: 100%;">
                <el-option v-for='item in repairProjectOptions' :key='item.EAF_ID' :label="item.EAF_NAME" :value="item.EAF_ID" :title="item.EAF_NAME"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="周期" prop='cycle'>
            <el-input v-model="form.cycle" style="width: 30%;"></el-input>
            <el-select v-model="form.unit" placeholder="请选择" style="width: 68%;">
              <el-option label="日" value="DAY"></el-option>
              <el-option label="周" value="WEEK"></el-option>
              <el-option label="月" value="MOUTH"></el-option>
              <el-option label="年" value="YEAR"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最近检修日期" prop='date'>
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="form.date"
              style="width: 100%;"
              :picker-options="pickerOptions1"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检修人" prop='person'>
            <el-input v-model="form.people" :disabled="true"></el-input><el-button type="primary" @click="getRepairPersonBox">选择</el-button>
          </el-form-item>
          <el-form-item label="工单模版" prop='template'>
            <el-select v-model="form.template" placeholder="请选择" style="width: 100%;">
                <el-option v-for='tp in templateOptions' :key='tp.EAF_ID' :label="tp.EAF_NAME" :value="tp.EAF_ID" :title="tp.EAF_NAME"></el-option>
              </el-select>
              <span class='tip'>提示:一旦更换工单模版，右侧的部件信息将全部丢失</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="15">
        <el-table :data='templateItemData' style='width:99.8%;' :empty-text='emptyText' v-loading="loading2" element-loading-text="拼命加载中">
          <el-table-column label='项' prop='EAF_NAME' align='center'></el-table-column>
          <el-table-column label='检查项' prop='RMD_ITME' align='center'></el-table-column>
          <el-table-column label='描述' prop='RMD_DES' align='center'></el-table-column>
          <el-table-column label='更换部件' prop='RMD_PART' align='center'>
            <template slot-scope="scope">
              <el-select v-model="scope.row.RMD_PART" placeholder="请选择" style="width: 100%;">
                <el-option v-for='selPart in scope.row.PARTARR' :key='selPart.EAF_ID' :label="selPart.EAF_NAME" :value="selPart.EAF_ID" :title="selPart.EAF_NAME"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class='row2'>
      <el-col>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { repairProject, workOrderTemplate, workOrderTemplateItems, saveRepairProject } from 'assets/js/equipment'
import RepairPerson from 'pages/equipment/component/repair-person'
export default {
  props: {
    layerid: {
      type: String,
      default: ''
    },
    equimentId: {
      type: String
    },
    modifyData: {
      type: String
    },
    parentType: {
      type: String
    }
  },
  components: {
    RepairPerson
  },
  data () {
    let self = this
    let checkPerson = (rule, value, callback) => { // 校检检修人
      if (!self.form.people) {
        return callback(new Error('请选择检修人'))
      } else {
        return callback()
      }
    }
    let checkDate = (rule, value, callback) => { // 校检日期
      if (!self.form.date) {
        return callback(new Error('请选择检修日期'))
      } else {
        return callback()
      }
    }
    let checkCycle = (rule, value, callback) => { // 校检周期
      if (!self.form.cycle) {
        return callback(new Error('请选择周期'))
      } else if (!self.form.unit) {
        return callback(new Error('请选择周期单位'))
      } else {
        let reg = /^[1-9][0-9]?$/
        let flag = reg.test(self.form.cycle)
        if (flag) {
          return callback()
        } else {
          return callback(new Error('请输入1-99的整数'))
        }
      }
    }
    return {
      emptyText: '请选择工单模版',
      saveData: {
        arrCheckPlan: [],
        arrItemPart: []
      },
      form: {
        project: '', // 修程
        cycle: '', // 周期
        unit: '', // 单位
        date: '', // 检修日期
        people: '', // 检修人
        peopleId: '', // 检修人id
        templateName: '', // 工单模板名字
        template: '', // 工单模板id
        templateInstance: '', // 工单模板实例
        eafId: '' // 检修数据EAF_ID修改时才有值，新建时传空
      },
      rules: {
        project: [
          { required: true, message: '请选择修程', trigger: 'change' }
        ],
        cycle: [
          { required: true, validator: checkCycle, trigger: 'change' }
        ],
        date: [
          { required: true, validator: checkDate, trigger: 'change' }
        ],
        person: [
          { required: true, validator: checkPerson, trigger: 'change' }
        ],
        template: [
          { required: true, message: '请选择工单模版', trigger: 'change' }
        ]
      },
      repairProjectOptions: [], // 修程下拉框
      templateOptions: [], // 检修模板下拉框
      templateItemData: [], // 工单模板检查项数据
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      loading: false,
      loading2: false
    }
  },
  methods: {
    autoSize (_w, _h, _lk) {
      if (_lk) return [(window.innerWidth * _w > _lk ? _lk : window.innerWidth * _w) + 'px', window.innerHeight * _h + 'px']
      return [window.innerWidth * _w + 'px', window.innerHeight * _h + 'px']
    },
    repairProjectInit () {
      let self = this
      repairProject().then(res => {
        if (res.data) {
          self.repairProjectOptions = res.data.rows
        }
      }).catch(error => {
        console.log(error)
      })
    },
    workOrderTemplateInit () { // 工单模板初始化
      let self = this
      workOrderTemplate().then(res => {
        if (res.data) {
          let ary = res.data.rows
          if (this.parentType === 'modify') {
            ary.forEach(item => {
              if (item.EAF_ID === self.form.template) {
                item.RMD_ORDER_MODEL_V = self.form.templateInstance // 新增一个模板实例字段,这个字段只有上次保存,然后通过修改打开才具备,每次下拉框切换的时候如果有模板实例字段就用这个字段,没有就用EAF_ID
                self.getTemplateItems(item.RMD_ORDER_MODEL_V)
              }
            })
            self.templateOptions = ary
          } else {
            self.templateOptions = ary
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getTemplateItems (val) {
      let self = this
      this.loading2 = true
      workOrderTemplateItems(this.equimentId, val).then(res => {
        if (!res.data.EAF_ERROR && Object.keys(res.data).length !== 0) {
          self.templateItemData = res.data.rows
          if (res.data.rows.length === 0) {
            self.emptyText = '该工单不需要更换部件'
          }
        }
        setTimeout(() => {
          self.loading2 = false
        }, 500)
      }).catch(error => {
        console.log(error)
      })
    },
    getRepairPersonBox () { // 检修人弹出框
      let self = this
      this.$layer.iframe({
        content: {
          content: RepairPerson,
          parent: this,
          data: {
            equimentId: this.equimentId,
            layerid: this.$layer.id
          }
        },
        shade: false,
        area: self.autoSize(1, 0.8, 350),
        title: '检修人'
      })
    },
    onSubmit () { // 保存按钮
      var self = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveData.arrCheckPlan = []
          this.saveData.arrItemPart = []
          this.saveData.arrCheckPlan.push({
            'RMD_DEVICE': this.equimentId, // 所属设备ID
            'RMD_REPAIR_CLS': this.form.project, // 修程ID
            'RMD_CYCLE_V': this.form.cycle, // 周期数值
            'RMD_CYCLE_UNIT': this.form.unit, // 周期单位
            'RMD_ORDER_MODEL': this.form.template, // 工单模板
            'RMD_ORDER_MODEL_V': this.form.templateInstance, // 工单模板实例，修改时才有值，新建时传空
            'RMD_REPAIR_P': this.form.peopleId, // 检修人
            'RMD_REPAIR_TIME': this.form.date, // 检修时间
            'EAF_ID': this.form.eafId// 新建时该字段不传
          })
          for (let item of this.templateItemData) { // 检查项校检,更换部件不能为空
            if (item.RMD_PART) {
              self.saveData.arrItemPart.push({
                'RMD_PART': item.RMD_PART,
                'EAF_ID': item.EAF_ID
              })
            } else {
              self.$message({
                showClose: true,
                message: '请先选择完需要更换的部件再保存',
                type: 'warning'
              })
              setTimeout(() => {
                self.loading = false
              }, 500)
              return
            }
          }
          self.saveDataInter(this.saveData)
          setTimeout(() => {
            self.loading = false
          }, 500)
        } else {
          return false
        }
      })
    },
    saveDataInter (data) { // 保存所有数据
      saveRepairProject(data).then(res => {
        if (!res.data.EAF_ERROR && Object.keys(res.data).length !== 0) {
          if (res.data.flag) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
            this.$layer.close(this.layerid)
            // 刷新父级页面表格
            this.$parent.search()
          } else {
            this.$message({
              showClose: true,
              message: '保存失败',
              type: 'warning'
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    cancle () {
      this.$layer.close(this.layerid)
    }
  },
  computed: {
    formTemplate () { // 工单模板
      return this.form.template
    },
    getRepairPerson () { // 检修人
      return this.$store.getters.getRepairPerson
    }
  },
  watch: {
    formTemplate (newVal, oldVal) {
      let self = this
      self.templateOptions.forEach(item => {
        if (item.EAF_ID === newVal) {
          if (item.RMD_ORDER_MODEL_V) {
            self.getTemplateItems(item.RMD_ORDER_MODEL_V)
          } else {
            self.getTemplateItems(newVal)
          }
        }
      })
    },
    getRepairPerson (newVal, oldVal) {
      this.form.people = newVal.label
      this.form.peopleId = newVal.id
    }
  },
  mounted () {
    if (this.parentType === 'modify') {
      let formData = JSON.parse(this.modifyData)
      this.form = {
        project: formData.RMD_REPAIR_CLS, // 修程
        cycle: formData.RMD_CYCLE_V, // 周期
        unit: formData.RMD_CYCLE_UNIT, // 单位
        date: formData.RMD_REPAIR_TIME, // 检修日期
        people: formData.RES_RMD_REPAIR_P_EAF_NAME, // 检修人
        peopleId: formData.RMD_REPAIR_P, // 检修人id
        templateName: formData.RES_RMD_ORDER_MODEL_EAF_NAME, // 工单模板名字
        template: formData.RMD_ORDER_MODEL, // 工单模板
        templateInstance: formData.RMD_ORDER_MODEL_V, // 工单模板实例
        eafId: formData.EAF_ID
      }
    }
    this.repairProjectInit()
    this.workOrderTemplateInit()
  }
}
</script>

<style lang='scss' scoped>
@import "assets/css/variable.scss";
.info {
  height:100%;
  display: flex;
  flex-direction: column;
  .main-row {
    flex:1;
    padding-top:10px;
    .el-col {
      border: 1px solid lightgrey;
      padding: 10px;
      &:nth-child(2) {
        overflow: auto;
      }
    }
    .el-form {
      .el-form-item {
        .el-input {
          width: inherit;
        }
        .tip{
          font-size: $extraSmall
        }
      }
    }
  }
  .row2{
    margin-top:10px;
    text-align: center;
  }
}
</style>
