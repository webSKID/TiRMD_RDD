<template>
  <el-header>
    <div class='header-left'>
      <div class="logo">
        <i class="icon-logo"></i>
      </div>
      <div v-if='!collapse' class='metro-text'>
        <div>中国中车</div>
        <div>CRRC</div>
      </div>
    </div>
    <span class='iconfont icon-caidan' @click="collapseParent"></span>
    <p class="title-text">四方所设备远程故障诊断系统</p>
    <div class="current-admin">
      <div @click="reviseInfo()" class='information'>
        <svg class="icon" style="width: 1.01171875em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1036 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2075"><path d="M231.633593 295.165243c0-153.595317 124.940454-278.535771 278.537807-278.535771 153.595317 0 278.535771 124.940454 278.535771 278.535771 0 153.60448-124.940454 278.53068-278.535771 278.53068C356.574047 573.695923 231.633593 448.769723 231.633593 295.165243L231.633593 295.165243zM0 1014.090329c5.996914-67.351756 38.330358-306.001432 286.846943-433.813074 61.63687 48.382571 139.069346 77.514946 223.325474 77.514946 84.715315 0 162.56727-29.428658 224.36908-78.30605 249.591753 127.274058 279.721917 364.250911 285.801301 434.597051C1018.86037 1015.51676 1.473266 1014.201308 0 1014.090329L0 1014.090329zM0 1014.090329" p-id="2076"></path></svg>
        <span class="admin-name">{{sysName}}</span>
      </div>
      <div class="logout" @click="logout()"><svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2879"><path d="M789.4 251c-27.3-24.4-69.3-22-93.7 5.3-24.4 27.3-22 69.3 5.3 93.7 56.6 50.6 91.9 123.4 92 205.1C792.7 707 669.9 829.8 518 830c-151.8-0.2-274.6-123-274.9-274.9 0-82.1 35.7-155.2 92.7-205.8 27.4-24.3 30-66.2 5.7-93.7-24.3-27.4-66.2-30-93.7-5.7-84.1 74.4-137.5 183.9-137.5 305.2 0 225.2 182.5 407.6 407.6 407.6 225.1 0 407.6-182.5 407.6-407.6 0.2-120.7-52.6-229.7-136.1-304.1zM519.2 622.4c36.7 0 66.4-29.7 66.4-66.3V129c0-36.7-29.7-66.4-66.4-66.4s-66.4 29.7-66.4 66.4v427c0.1 36.7 29.8 66.4 66.4 66.4z" p-id="2880"></path></svg></div>
    </div>
  </el-header>
</template>

<script type="text/ecmascript-6">
import personalInfo from 'components/top-column/person-information'
import {logOut, getPersonalInfo} from 'api/api'
import { removeItem } from '@/util/auth.js'
export default {
  name: 'top-column',
  component: {
    personalInfo
  },
  data () {
    return {
      collapse: this.$store.state.isCollapse,
      sysName: this.$store.state.user.sysName,
      sysId: this.$store.state.user.sysId
    }
  },
  methods: {
    logout: function () {
      logOut().then((res) => {
        // 退出时标识未登录
        removeItem('RDD-token')

        this.$router.push({
          path: '/'
        })
      })
    },
    collapseParent () { // 点击控制导航收缩
      this.collapse = !this.collapse
      this.$store.commit('changeCollapse', this.collapse)
    },
    reviseInfo () {
      getPersonalInfo(this.sysId).then(res => {
        if (!res.EAF_ERROR) {
          let formData = res.data
          this.$layer.iframe({
            content: {
              content: personalInfo, // 传递的组件对象
              parent: this, // 当前的vue对象
              data: {check: JSON.stringify(formData)}
            },
            area: ['350px', '550px'],
            title: '修改个人信息'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "assets/css/variable.scss";
  @import "assets/css/mixin.scss";
  .el-header{
    display: flex;
    align-items: center;
    background-color: #034a54;
    color: rgba(242, 242, 242, 0.698039215686274);
    .header-left{
        height: 100%;
        display: flex;
        align-items: center;
        background: black;
      .logo {
        display: flex;
        align-items: center;
        width: 44px;
        height: 100%;
        margin: 0 10px;
        i{
          display: inline-block;
          width: 44px;
          height: 44px;
          @include div-bg("../../assets/image/zc-logo.png");
          background-size: cover;
        }
    }
    .metro-text{
        height: 100%;
        width: 136px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        color:#fff;
        padding-top:3px;
      div:nth-child(1){
        font-size:12px;
        font-weight: 600;
      }
      div:nth-child(2){
        font-size: 17px;
        font-weight: 600;
        font-family: $fontFamily2;
      }
    }
  }
    .title-text{
      font-size: 15px;
      font-weight: 800;
      padding-left:10px;
    }
    .icon-caidan{
      margin-left:30px;
      font-size:20px;
      cursor: pointer;
    }
    .information{
      padding: 0 10px;
      &:hover{
        background:#32A4A8;
      }
    }
    .logout{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      color: white;
      cursor: pointer;
      &:hover{
        background:#32A4A8;
      }
    }
    .current-admin{
      position: absolute;
      right:0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      color: #fff;
      cursor: pointer;
      div{
        display: flex;
        align-items: center;
        line-height: 60px;
        height: 60px;
      }
      .admin-name{
        padding-left: 5px;
      }
    }
  }
</style>
