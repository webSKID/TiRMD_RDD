<template>
    <el-form label-width="85px" :model="form" ref="ruleForm">
        <el-form-item  class="input-wrapper" label="姓名" prop="EAF_NAME ">
            <el-input type="text" v-model="form.EAF_NAME" readonly></el-input>
        </el-form-item>
        <el-form-item class="input-wrapper" label="登录名" prop="EAF_LOGINNAME">
            <el-input type="text" v-model="form.EAF_LOGINNAME" readonly></el-input>
        </el-form-item>
        <el-form-item class="input-wrapper" label="原密码" prop="EAF_OLDPS">
            <el-input type="password" v-model="form.EAF_OLDPS" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item class="input-wrapper" label="新密码" prop="EAF_PASSWORD">
            <el-input  type="password" v-model="form.EAF_PASSWORD" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item class="input-wrapper" label="确认新密码" prop="EAF_NEWPSOK">
            <el-input type="password" v-model="form.EAF_NEWPSOK" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item  class="input-wrapper" label="邮件" prop="EAF_EMAIL">
            <el-input v-model="form.EAF_EMAIL"></el-input>
        </el-form-item>
         <el-form-item class="input-wrapper" label="手机号" prop="EAF_PHONE">
            <el-input v-model.number="form.EAF_PHONE"></el-input>
        </el-form-item>
        <el-form-item class="input-wrapper" label="微信号" prop="BOM_WECHAT">
            <el-input type="text" v-model="form.BOM_WECHAT"></el-input>
        </el-form-item>
        <el-form-item class="input-wrapper" label="岗位" prop="BOM_POST">
            <el-input type="text" v-model="form.BOM_POST"></el-input>
        </el-form-item>
        <el-form-item class="input-wrapper" label="部门" prop="BOM_DEPART">
            <el-input type="text" v-model="form.BOM_DEPART"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="cancelForm()">取消</el-button>
    </el-form>
</template>
<script type="text/ecmascript-6">
import md5 from 'md5'
import {savePersonal} from 'api/api'
export default {
  name: 'reviseInfo',
  props: {
    check: {
      type: String
    },
    layerid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sysId: this.$store.state.user.sysId,
      form: {
        EAF_NAME: '',
        EAF_LOGINNAME: '',
        EAF_OLDPS: '',
        EAF_PASSWORD: '',
        EAF_NEWPSOK: '',
        EAF_EMAIL: '',
        EAF_PHONE: '',
        BOM_WECHAT: '',
        BOM_POST: '',
        BOM_DEPART: '',
        readonly: true
      }
    }
  },
  methods: {
    // 保存按钮
    submitForm (formName) {
      let formData = this.form // 表单数据
      let oldPsd = this.form.EAF_OLDPS// 原密码
      // if (!oldPsd) {
      //   this.$layer.alert('原密码不能为空')
      //   return false
      // }
      if ((this.form.EAF_PASSWORD || this.form.EAF_NEWPSOK) && this.form.EAF_PASSWORD !== this.form.EAF_NEWPSOK) {
        this.$layer.alert('两次输入的新密码不匹配')
        return false
      }
      let moldPsd = md5(oldPsd)
      if (formData.EAF_PASSWORD) {
        formData.EAF_PASSWORD = md5(formData.EAF_PASSWORD)
      } else {
        delete formData.EAF_PASSWORD
      }
      let uobj = JSON.stringify(formData)
      savePersonal(this.sysId, moldPsd, uobj).then(res => {
        if (res) {
          this.$layer.msg('保存成功', 1000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 取消
    cancelForm () {
      this.$layer.closeAll()
    }
  },
  mounted () {
    let formData = JSON.parse(this.check)
    this.form.uoid = formData.uoid
    this.form.EAF_ORG = formData.EAF_ORG
    this.form.EAF_ID = formData.EAF_ID
    this.form.EAF_CREATOR = formData.EAF_CREATOR
    this.form.EAF_CREATETIME = formData.EAF_CREATETIME
    this.form.EAF_MODIFIER = formData.EAF_MODIFIER
    this.form.EAF_MODIFYTIME = formData.EAF_MODIFYTIME
    this.form.EAF_NAME = formData.EAF_NAME ? formData.EAF_NAME : '' // 姓名
    this.form.EAF_LOGINNAME = formData.EAF_LOGINNAME ? formData.EAF_LOGINNAME : '' // 登录名
    this.form.EAF_EMAIL = formData.EAF_EMAIL ? formData.EAF_EMAIL : '' // 邮件
    this.form.EAF_PHONE = formData.EAF_PHONE ? formData.EAF_PHONE : '' // 手机号
    this.form.BOM_WECHAT = formData.BOM_WECHAT ? formData.BOM_WECHAT : '' // 微信号
    this.form.BOM_POST = formData.BOM_POST ? formData.BOM_POST : '' // 岗位
    this.form.BOM_DEPART = formData.BOM_DEPART ? formData.BOM_DEPART : '' // 部门
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
    .el-form{
        text-align: center;
        .el-form-item {
            height: 24px;
            .el-input{
                width: 90%;
                height: 24px;
            }
        }
    }
</style>
// 覆盖表单样式
<style>
 .input-wrapper label{
    font-size: 12px!important;
    padding:0!important;
 }
.input-wrapper input{
    height: 24px!important;
    line-height: 24px!important;
}
.input-wrapper .el-form-item__error{
    padding-top:0;
    left: 10px;
}
.vl-notify .vl-notify-content{
    padding: 10px
}
</style>
