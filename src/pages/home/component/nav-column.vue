<template>
  <el-main class="el-main">
    <!-- <el-col> -->
      <el-menu close="el-menu" :collapse-transition='false' default-active="0-0" :collapse='isCollapse' class="el-menu-vertical-demo" :unique-opened="true" @open="handleOpen" @close="handleClose"  text-color="#fff" active-text-color="#ffd04b">
        <el-submenu :index="fit.toString()" v-for="(item,fit) in navData" :key="fit">
          <template slot="title">
            <svg v-if='item.EAF_ARG' class="icon" aria-hidden="true">
              <use :xlink:href="gerSrc(item.EAF_ARG)"></use>
            </svg>
            <span>{{item.EAF_NAME}}</span>
					</template>
          <el-menu-item :index="tabCount(fit,sed)" v-for="(count,sed) in item.children" :key="sed" @click="tabClick(count.EAF_ARG)">
            <svg v-if='count.EAF_ARG' class="icon" aria-hidden="true">
                <use :xlink:href="gerSrc(count.EAF_ARG)"></use>
              </svg>
            <span slot="title">{{count.EAF_NAME}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    <!-- </el-col> -->
    <el-col style="height:100%;">
      <!-- <div style="background: rgba(159,159,159, .8);"> -->
        <keep-alive :include="KeepAliveRoute">
          <router-view style="width:100%;height:100%;"></router-view>
        </keep-alive>
      <!-- </div> -->
    </el-col>
  </el-main>
</template>
<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'nav-side',
  props: {
    navData: Array
  },
  computed: {
    KeepAliveRoute () {
      return this.$store.getters.KeepAliveRoute
    },
    isCollapse () {
      return this.$store.state.isCollapse
    }
  },
  methods: {
    gerSrc (src) {
      if (src) {
        return src.split('?')[1]
      } else {
        return ''
      }
    },
    tabCount (index, second) {
      return index + '-' + second
    },
    tabClick (_path) {
      const localhostPath = _path.split('?')[0]
      if (_path) {
        if (localhostPath === '/equipment/equipment-list') {
          this.$store.commit('removeKeepAliveRoute')
        }
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + localhostPath
          })
        })
      } else {
        this.$router.push('')
      }
    },
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    }
  },
  mounted () {
    this.$router.push('/home/network-overview')
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.icon{
  vertical-align: -0.35em;
}
.el-main {
  display: flex;
  width: 100%;
  height: calc(100% - 60px);
  .el-menu{
    border-right: none;
    background: #133034;
    .el-submenu{
      background: #1f4e56;
      .el-menu.el-menu--inline{
        .el-menu-item{
          background: #133034;
          &:hover{
            background: #32a4a8;
          }
        }
        .el-menu-item.is-active{
          background: #133034 !important;
        }
      }
    }
  }
}
</style>
<style>
.el-submenu__title:hover {
    background-color: #32a4a8 !important;
}
.el-menu--popup{
  background: #32a4a8 !important;
  padding:0 !important;
}
.el-menu--popup>li:hover{
  background: #133034 !important;
}
/* 导航展开时宽度 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 224px;
    min-height: 400px;
  }
.el-menu-vertical-demo:not(.el-menu--collapse) .el-submenu{
  width: 200px;
}
</style>
