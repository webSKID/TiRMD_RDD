<template>
    <div id="info" class="info">
        <el-row class="row-top">
          <el-col :span="10">
              <div class="block">
                <el-carousel trigger="click" :autoplay="false">
                  <template v-if='parentSwiperData && parentSwiperData.length > 0'>
                    <el-carousel-item v-for="(swiper,sindex) in parentSwiperData" :key="sindex">
                      <img :src="swiper.src" alt="图片" width="100%" height="100%">
                    </el-carousel-item>
                  </template>
                  <template v-else>
                    <el-carousel-item>
                      <img src="../../assets/image/tipImg.jpg" alt="图片" width="100%" height="100%">
                    </el-carousel-item>
                  </template>

                </el-carousel>
              </div>
          </el-col>
          <el-col :span="14" class="swiper-right">
            <el-row class="swiper-right-top">
              <p class="prop-desc">
                  <span>名称:</span>
                  <span>规格型号:</span>
                  <span>设备编码:</span>
                  <span>制造厂商:</span>
                  <span>制造日期:</span>
              </p>
              <p class="prop-desc">
                  <span>{{parentEquipData.EAF_NAME}}</span>
                  <span>{{parentEquipData.RMD_TS}}</span>
                  <span>{{parentEquipData.EAF_CODE}}</span>
                  <span>{{parentEquipData.RMD_MANUF}}</span>
                  <span>{{parentEquipData.RMD_MANUF_TIME_STR}}</span>
              </p>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="row-bottom">
          <div class="attribute-list">
            <div class="list-row">
              <label>故障状态</label>
              <span>
                <template v-if='trbStateURL'>
                  <span :title="trbStateName">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="trbStateURL"></use>
                    </svg>
                  </span>
                </template>
                <template v-else>
                  <span :title="trbStateName">{{trbStateName}}</span>
                </template>
              </span>
              <label>所属类别</label>
              <span>{{category}}</span>
              <label>所属类型</label>
              <span>{{type}}</span>
              <label>外型尺寸</label>
              <span>{{parentEquipData.RMD_DIMEN}}</span>
            </div>
          </div>
        </el-row>
    </div>
</template>
<script>
import { getEquimenKeys } from '@/assets/js/equipment'
export default {
  props: {
    parentSwiperData: Array,
    parentEquipData: Array
  },
  data () {
    return {
      category: '',
      type: '',
      trbState: '',
      trbStateURL: this.parentEquipData['TRBLEVEL_URL'],
      trbStateName: this.parentEquipData['TRBLEVEL_NAME'],
      swiperData: []
    }
  },
  computed: {

  },
  methods: {
    // 资源属性名字段转中文
    rowKeyFormatter (row) {
      let resname = 'RES_' + row.EAF_CNAME + '_' + row.EAF_RELATESHOW
      if (resname.length + 2 > 30) {
        resname = 'RES_' + row.EAF_SN + '_1'
      }
      if (row.EAF_RCNAME && row.EAF_RCNAME.indexOf('R_') === 0) resname = 'R_' + resname
      return resname
    },
    // 获取资源表数据
    getRowKeyTable () {
      let self = this
      getEquimenKeys().then((res) => {
        if (!res.data.EAF_ERROR) {
          let rowData = res.data.rows
          for (let i in rowData) {
            if (rowData[i].EAF_CNAME === 'RMD_BELONG_CATEGORY') {
              self.category = self.parentEquipData[self.rowKeyFormatter(rowData[i])]
            }
            if (rowData[i].EAF_CNAME === 'RMD_BELONG_TYPE') {
              self.type = self.parentEquipData[self.rowKeyFormatter(rowData[i])]
            }
            if (rowData[i].EAF_CNAME === 'RMD_TRB_STATE') {
              self.trbState = self.parentEquipData[self.rowKeyFormatter(rowData[i])]
            }
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
    }
  },
  mounted () {
    this.getRowKeyTable()
  }
}
</script>

<style scoped lang="scss">
.info {
    background: #ffffff;
    padding-left: 20px;
    overflow: auto;
}
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .row-top{
    height: 50%;
  }
  .row-bottom{
    height: 50%;
    margin: 20px 0;
  }
  .attribute-list{
    display: flex;
    flex-wrap: wrap;
  }
  .swiper-right{
    padding-left:30px;
  }
  .swiper-right-top{
    display: flex
  }
  .swiper-right-bottom{
    height: 100px;
    display: flex;
    align-items: flex-end;
  }
  .prop-desc{
    width: 200px;
    &:nth-child(2){
      width: 50%
    }
    /* text-align: justify;
    text-align-last: justify; */
  }
  .prop-desc>span{
      display: inline-block;
      width: 100%;
      line-height: 50px;
      height:50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
  .list-row{
    line-height: 40px;
    margin-right:10px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    label{
      width: 25%;
      display: inline-block;
      text-align: center;
      background: lightblue;
    }
    span{
      width: 25%;
      display: inline-block;
      text-align: center;
      background: lightgray;
    }
  }
</style>
