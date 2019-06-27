<template>
<div class='tag-p'>
    <div id="tags" class='tags' placeholder="请选择数据项" contenteditable="false">
        <el-tag
        placeholder="请选择数据项"
            :key="tag.EAF_ID"
            v-for="tag in dataItemAry"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag.EAF_NAME}}
        </el-tag>
    </div>
</div>
</template>

<script>
export default{
  name: 'auto-tags',
  props: {
    dataItem: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dataItemAry: []
    }
  },
  watch: {
    dataItem (val) {
      this.dataItemAry = val.slice()
    }
  },
  methods: {
    handleClose (tag) {
      this.dataItemAry.splice(this.dataItemAry.indexOf(tag), 1)
      this.$emit('changeData', this.dataItemAry.slice())
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
.tag-p{
  display: inline;
  min-width: 200px;
  .tags{
      display: table;
      border:1px solid #E4E7ED;
      min-width: 200px;
      height:32px;
      line-height: 32px;
      background-color: #f5f7fa;
      background-image: none;
      border-radius: 4px;
      box-sizing: border-box;
      outline: 0;
      padding: 0 15px;
      color: #606266;
      &:empty:before{
          content: attr(placeholder);
          color:#C0C4CC;
      }
      .el-tag + .el-tag {
          margin-left: 10px;
      }
      .button-new-tag {
          margin-left: 10px;
          height: 32px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
      }
      .input-new-tag {
          width: 90px;
          margin-left: 10px;
          vertical-align: bottom;
      }
  }
}
</style>
