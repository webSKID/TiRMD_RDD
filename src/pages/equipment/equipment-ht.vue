<template>
<div class='ht'>
  <el-container>
    <el-main v-loading="loading" element-loading-text="拼命加载中">
      	<div ref="pageContent0" class="pageContent" style="position: relative;">
				</div>
    </el-main>
  </el-container>
  </div>
</template>

<script>
export default {
  props: {
    htId: {
      type: String
    },
    post: {
      type: Object
    }
  },
  data () {
    return {
      json: '',
      dataModel: '', // 数据模型
      graphView: '', // ht实例
      loading: false
    }
  },
  methods: {
    // 加载json数据
    loadData (htId) {
      let self = this
      self.dataModel = new this.$ht.DataModel()
      self.graphView = new this.$ht.graph.GraphView(self.dataModel)
      self.graphView.addToDOM(this.$refs.pageContent0)
      self.$ht.Default.xhrLoad('/RDD/HtClient/instance/storage/displays/' + htId + '.json', function (text) {
        if (text) {
          self.loading = false
          text = text.replace(/symbols/g, '/RDD/HtClient/instance/storage/symbols')
          self.json = self.$ht.Default.parse(text)
          self.graphView.fitContent(true)
          self.graphView.deserialize(self.json)
          self.loadPost(self.post)
          self.loadUrlNode()
          self.clickNode()
        }
      })
    },
    // 节点点击
    clickNode () {
      let self = this
      self.graphView.mi(function (e) {
        if (e.kind === 'clickData') {
          var data = e.data
          for (let item of self.json.d) {
            if (item.a) {
              if (Object.keys(item.a)[1] === 'urlSrc') {
                if (data.getTag() === Object.values(item.a)[0]) {
                  self.$refs.pageContent0.innerHTML = '' // 页面清空
                  self.$emit('postChange', Object.values(item.a)[1]) // 改变tabId
                  self.$emit('changeHtData')
                  self.loadData(Object.values(item.a)[1])
                }
              }
            }
          }
        }
      })
    },
    // 数据项文本框
    loadPost (post) {
      console.log(post)
      let postData = Object.assign({}, post)
      let self = this
      for (let item of self.json.d) {
        let tagName = item.p.tag
        if (tagName) {
          let test = self.dataModel.getDataByTag(tagName) // 对应ht编辑器的“标签”，以及下面用到setAttr属性
          for (let item1 in postData) {
            let index = tagName.lastIndexOf('-')
            let val = tagName.substring(index + 1, tagName.length)
            if (item1 === val) {
              test.setAttr('text', postData[item1])
            }
          }
        }
      }
    },
    // 组态文本框
    loadUrlNode () {
      let self = this
      for (let item of self.json.d) {
        if (item.a) {
          let key = Object.keys(item.a)
          let val = Object.values(item.a)
          if (key[1] && key[1] === 'urlName') {
            if (item.p.tag) {
              let test = self.dataModel.getDataByTag(item.p.tag)
              if (val[1] === item.p.tag) {
                test.setAttr('urlName', val[1])
              }
            }
          }
        }
      }
    }
  },
  watch: {
    post: {
      handler (newValue, oldValue) {
        let data = Object.assign({}, newValue)
        this.loadPost(data)
      },
      deep: true
    }
  },
  mounted () {
    this.loadData(this.htId)
  }
}
</script>>
<style lang="scss" scoped>
.ht{
  display: flex;
  height: 500px;
  .el-container{
    .el-main{
      display: flex;
      padding-top: 0;
      .pageContent{
        flex: 1;
        background-color: #fff;
      }
    }
  }
}
</style>
