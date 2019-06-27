<template>
<div class='info'>
  <top-column></top-column>
  <template v-if="navDatas">
    <nav-column :navData='navDatas'></nav-column>
  </template>
</div>
</template>

<script>
import { getMenu } from 'api/api'
import commonCons from 'assets/js/commonConstant'
import TopColumn from 'components/top-column/top-column'
import NavColumn from 'pages/home/component/nav-column'
export default {
  name: 'home',
  components: {
    TopColumn,
    NavColumn
  },
  data () {
    return {
      userId: commonCons.getConstant('user'),
      navDatas: []
    }
  },
  methods: {
    // 获取导航数据
    getMenuData () {
      var self = this
      getMenu()
        .then(res => {
          self.navDatas = self.filterNavData(res.data.rows)
        })
        .catch(error => console.log(error))
    },
    // 导航数据格式化
    filterNavData (data) {
      var self = this
      let ret = []
      let childRet = []
      data.forEach(val => {
        if (val.EAF_PID === self.userId) {
          ret.push(val)
          val.children = []
        } else {
          childRet.push(val)
        }
      })
      ret.forEach((parent, index) => {
        childRet.forEach(child => {
          if (child.EAF_PID === parent.EAF_ID) {
            ret[index].children.push(child)
          }
        })
      })
      return ret
    }
  },
  mounted () {
    this.getMenuData()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "css-reset-and-normalize-sass";
.info{
  width:100%;
  height: 100%;
}
</style>
