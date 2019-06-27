<template>
  <div class="el-wrapper">
    <el-container>
      <el-header>
        <div class="logo">
          <i class="icon-logo"></i>
        </div>
        <div class='metro-text'>
          <div>中国中车</div>
          <div>CRRC</div>
        </div>
        <p class="title-text">四方所设备远程故障诊断系统</p>
        <div class='chrome-box'>
          <img src="../../assets/image/chrome.png" class='chrome-img'>
          <a href="./upload/appPackage/ChromeStandalone_63.0.3239.108_Setup.exe" download="chrome.exe">浏览器下载</a>
        </div>
      </el-header>
      <el-main>
        <div class="main">
           <h3 class="login-title">欢迎回来&nbsp;&nbsp;请登录</h3>
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules"  label-width="100px">
            <el-form-item class="input-group" label="账号" prop="userName">
              <el-input v-model="ruleForm.userName" @focus="focusBg" @blur="blurBg"></el-input>
            </el-form-item>
            <el-form-item class="input-group" label="密码" prop="passWord">
              <el-input type="password" v-model="ruleForm.passWord" @keyup.enter.native="submit('ruleForm')" autocomplete='new-password' @focus="focusBg" @blur="blurBg"></el-input>
            </el-form-item>
            <el-row class="el-login-wrapper">
              <el-checkbox v-model="isRemember">记住密码</el-checkbox><br>
              <el-button type="primary" @click="submit('ruleForm')" @mouseenter.native="overBg" @mouseleave.native="outBg">登录</el-button>
            </el-row>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
import {getLogin} from 'api/api'
import md5 from 'md5'
import { mapMutations } from 'vuex'
import { getItem, setItem } from '@/util/auth.js'
export default {
  name: 'login',
  data () {
    return {
      ruleForm: {
        userName: '',
        passWord: ''
      },
      rules: {
        userName: [
          { required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          { trigger: 'blur' }
        ],
        passWord: [
          { required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { trigger: 'blur' }
        ]
      },
      userInfo: {},
      md5Pass: '',
      isRemember: false
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    getUser: function () {
      // 用户名密码填充
      const userName = getItem('RDD-USER')
      const passWord = getItem('RDD-PASS')
      this.md5Pass = passWord
      this.ruleForm.userName = userName || ''
      this.ruleForm.passWord = passWord ? '*eAf_ThiT%' : ''
      if (this.ruleForm.userName && this.ruleForm.passWord) {
        this.isRemember = true
      }
    },
    focusBg () {
      let src = require('../../assets/image/input-b.png')
      event.target.style.background = 'url(' + src + ') no-repeat center center / 100% 100%'
    },
    blurBg () {
      let src = require('../../assets/image/input-a.png')
      event.target.style.background = 'url(' + src + ') no-repeat center center / 100% 100%'
    },
    overBg () {
      let src = require('../../assets/image/login-b.png')
      event.target.style.background = 'url(' + src + ') no-repeat center center / 100% 100%'
    },
    outBg () {
      let src = require('../../assets/image/login-a.png')
      event.target.style.background = 'url(' + src + ') no-repeat center center / 100% 100%'
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let password
          if (this.ruleForm.passWord === '*eAf_ThiT%') {
            password = this.md5Pass
          } else {
            password = md5(this.ruleForm.passWord)
          }
          getLogin(this.ruleForm.userName, password).then((res) => {
            if (res) {
              const loading = this.$loading({
                lock: true,
                text: '登录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              // 用户登录名密码保存
              this.userInfo = res.data
              this.setUser(this.userInfo)
              // 是否启用记住密码
              if (this.isRemember) {
                setItem('RDD-PASS', password)
              } else {
                setItem('RDD-PASS', '')
              }
              setItem('RDD-USER', this.userInfo.loginname)
              setItem('RDD-token', this.userInfo.EAF_ID)

              setTimeout(() => {
                this.$router.push({
                  path: '/home'
                })
                loading.close()
              }, 1000)
            }
          })
        } else {
          return false
        }
      })
    },
    ...mapMutations({
      setUser: 'setUser'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="”stylesheet/scss">
  @import "assets/css/variable.scss";
  @import "assets/css/mixin.scss";
  .el-wrapper {
    height: 100%;
    font-family: $fontFamily;
    .el-container {
      height: 100%;
      @include div-bg("../../../static/image/shanghai_bg.jpg");
      background-size: cover;
      .el-header{
        display: flex;
        color: rgba(242, 242, 242, 0.698039215686274);
        align-items: center;
        .logo {
          display: flex;
          align-items: center;
          width: 44px;
          height: 100%;
          margin-right: 10px;
          i{
            display: inline-block;
            width: 44px;
            height: 44px;
            @include div-bg("../../assets/image/zc-logo.png");
            background-size: cover;
          }
        }
        .metro-text{
          color:#fff;
          div:nth-child(1){
            font-size:12px;
            font-weight: 600;
          }
          div:nth-child(2){
            font-size: 17px;
            font-weight: 600;
            font-family:$fontFamily2;
          }
        }
        .title-text{
          font-size: 15px;
          font-weight: 800;
          padding-left:10px;
        }
        .chrome-box{
          display: flex;
          align-items: center;
          position: absolute;
          right:13px;
          img{
            margin-right:10px;
          }
          a{
            color: rgba(242, 242, 242, 0.698039215686274);
            text-decoration: none;
          }
        }
      }
      .el-main{
        display: flex;
        align-items: center;
        justify-content: center;
        .main{
          width: 500px;
          height: 300px;
          margin-top: -120px;
          .login-title{
            font-size: 24px;
            text-align: center;
            color: #99ffff;
            font-family: '微软雅黑 Regular', '微软雅黑';
            text-shadow: 0 0 20px #0082c9, 0 0 20px #0080c5, 0 0 20px #1fa5ed;
            letter-spacing: 3px;
            margin-bottom: 20px;
          }
          form {
            margin-left: 90px;
            .input-group{
              flex-wrap: wrap;
              label{
                color: white;
                font-size: 16px;
                color: #99ffff;
                text-shadow: 0 0 20px #0082c9, 0 0 20px #0080c5, 0 0 20px #1fa5ed;
                font-weight: 400;
                width: 100%!important;
                text-align: left;
                margin-left: 10px;
              }
              div.el-form-item__content{
                margin-left: 10px!important;
                .el-input{
                  .el-input__inner{
                    border:none;
                    width: 295px;
                    height: 70px;
                    padding-left: 10px;
                    outline: none;
                    text-indent: 1em;
                    border: none;
                    font-family: Microsoft Yahei;
                    font-size: 14px;
                    color: #99ffff!important;
                    // @include div-bg("../../assets/image/input-a.png");
                    background-image: url("../../assets/image/input-a.png");
                    background-repeat: no-repeat;
                    background-color: transparent;
                  }
                }
                .el-form-item__error{
                  margin-left: 10px;
                }
              }
            }
            .el-login-wrapper{
              .el-checkbox{
                display: flex;
                align-items: center;
                margin-left: 20px;
                margin-top: 5px;
                color: #99ffff;
                font-size: 12px;
               .el-checkbox__input{
                  margin-top: 3px;
                  .el-checkbox__inner{
                    background: transparent;
                    border: none;
                  }
                  .el-checkbox__inner::before{
                    content: "";
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    @include div-bg("../../assets/image/check-a.png");
                    position: absolute;
                    left: -3px;
                    top:-3px;
                  }
                }
              }
              .el-button--primary{
                padding: 5px 0;
                color: #99ffff;
                text-shadow: 0 0 20px #0082c9, 0 0 20px #0080c5, 0 0 20px #1fa5ed;
                font-size: 20px;
                opacity: 0.8;
                width: 270px;
                height: 70px;
                border: none;
                outline: none;
                @include div-bg("../../assets/image/login-a.png");
                background-size: 100% 100%;
                cursor: pointer;
                margin-left: 15px;
              }
            }
          }
        }
      }
    }
  }
</style>
