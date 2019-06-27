<template>
  <div class='content'>
    <el-row class='row1'>
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :highlight-current='true'>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="data.icon"></use>
          </svg>{{ node.label }}
        </span>
      </el-tree>
    </el-row>
    <el-row class='row2'>
      <div>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancle">取消</el-button>
      </div>
    </el-row>
  </div>
</template>
<script>
import { repairPerson } from 'assets/js/equipment'

export default {
  props: {
    equimentId: {
      type: String
    },
    layerid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectPerson: null
    }
  },
  methods: {
    getRepairPerson () {
      let self = this
      repairPerson(this.equimentId).then(res => {
        if (!res.data.EAF_ERROR && Object.keys(res.data).length !== 0) {
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
      }).catch(error => {
        console.log(error)
      })
    },
    handleNodeClick (data) {
      if (!data.hasOwnProperty('children')) {
        this.selectPerson = data
      } else {
        this.selectPerson = null
      }
    },
    onSubmit () {
      if (this.selectPerson) {
        this.$store.commit('setRepairPerson', this.selectPerson)
      }
      this.$layer.close(this.layerid)
    },
    cancle () {
      this.$layer.close(this.layerid)
    }
  },
  mounted () {
    this.getRepairPerson()
  }
}
</script>

<style lang="scss" scoped>
.content{
  height:100%;
  padding:10px;
  display: flex;
  flex-direction: column;
  .row1{
    border:1px solid lightgrey;
    flex:1;
    .el-tree{
      height:100%;
    }
  }
  .row2{
    margin-top:10px;
    text-align: center;
  }
  .icon{
    display: inline-block;
    margin: 0 5px;
  }
}
</style>
