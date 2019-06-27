import {mapMutations} from 'vuex'
const logoutMixin = {
  methods: {
    logout: function () {
      this.removeUser()
      this.$router.push({
        path: '/login'
      })
      this.$message.error('您已退出，请重新登录')
    },
    ...mapMutations({
      removeUser: 'removeUser'
    })
  }
}
export default logoutMixin
