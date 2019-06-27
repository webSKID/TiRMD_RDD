<template>
    <!--地图容器-->
    <div id="container-parent" class="container-parent">
      <div id="container" class="container"></div>
      <div id="container-panel" class="container-panel" @change="handleChange">
        <template v-if="leftMove">
          <div class="panel-title">
            <i class="el-icon-arrow-left" @click="changeState(false)"></i>
            <img :src="cityLogo"  style="width:22px;margin:0 5px;">
            <span>{{depotTitle}}</span>
            <span>设备{{depotAccount}}台</span>
             <template v-if="show">
              <span @click="changePanel">收起</span>
            </template>
            <template v-else>
              <span @click="changePanel">展开</span>
            </template>
          </div>
        </template>
        <template v-else>
          <div id="panel-title" class="panel-title">
            <span>=全部车辆段=</span><span>设备{{AllDepotAccount}}台</span>
            <template v-if="show">
              <span @click="changePanel">收起</span>
            </template>
            <template v-else>
              <span @click="changePanel">展开</span>
            </template>
          </div>
        </template>
        <transition name="el-zoom-in-top">
          <div id="panel-main" v-show="show" class="panel-main" :class="{left1:leftMove}">
            <li v-for="(item,index) in coordData" :key="index" @click="changeState(true,item.EAF_ID,item.EAF_NAME,item.RMD_LNG,item.RMD_LAT)" :eid = "item.EAF_ID" :ename = "item.EAF_NAME">
              <img :src="item.RMD_PICTURE_URL" alt="img">
              <div class="msc-title-parent">
                <div :title="item.EAF_NAME">{{item.EAF_NAME}}</div>
                <div :title="item.EAF_CODE">{{item.EAF_CODE}}</div>
              </div>
              <div class="msc-title-parent2">
                <p>设备{{item.ACCOUNTNUM?item.ACCOUNTNUM:0}}台</p>
              </div>
            </li>
          </div>
        </transition>
        <transition name="el-zoom-in-top">
        <div id="car-depot" class="car-depot" v-show="show" :class="{left2:leftMove}" v-loading="loading">
          <p class="car-depot-title"><span>设备名称/编码</span><span>故障状态<i class="el-icon-question cursor" style="margin-left:4px;" @click="clickIcon"></i></span><span>最后联系</span></p>
          <ul>
            <li v-for="(stem,sndex) in sxData" :key="sndex">
              <div  class="msc-title-parent">
                <div :title="stem.EAF_NAME">{{stem.EAF_NAME}}</div>
                <div :title="stem.EAF_CODE">{{stem.EAF_CODE}}</div>
              </div>
              <div  class="msc-title-parent" :title="stem.TRBLEVEL_NAME">
                <template v-if='stem.TRBLEVEL_URL'>
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="stem.TRBLEVEL_URL"></use>
                  </svg>
                </template>
                <template v-else>
                  <div :title="stem.TRBLEVEL_NAME">{{stem.TRBLEVEL_NAME}}</div>
                </template>
              </div>
              <div  class="msc-title-parent">
                <div :title="stem.EAF_MODIFYTIME_STR">{{stem.EAF_MODIFYTIME_STR}}</div>
                <div></div>
              </div>
            </li>
          </ul>
        </div>
        </transition>
      </div>
    </div>
</template>

<script>
import BauduMap from '@/pages/state/component/bmap.js'
import BusUnclickedOverlay from '@/pages/state/component/BusUnclickedOverlay.js'
import {mapDataInit, getDepotData} from '@/assets/js/global-overview.js'
import dataTootip from '@/assets/js/nodate-prompt.js'
import MapJson from '@/assets/json/custom_map_config.json'
import { getFaultLevel } from '@/assets/js/equipment'
// 故障图例弹出框
import FaultLegend from 'pages/equipment/component/fault-legend'
export default {
  name: 'bmap',
  data: function () {
    return {
      show: false,
      leftMove: false,
      loading: false,
      map: '',
      BMap: '',
      coordData: [],
      coordDataCity: [],
      AllDepotAccount: 0, // 所有车辆段的设备台数
      depotAccount: 0, // 某个车辆段的设备台数
      cldData: [{name: 1}, {name: 2}],
      sxData: [],
      depotTitle: '', // 车辆段面板title
      cityLogo: '' // RDD/Common/images/logo.png
    }
  },
  methods: {
    // 故障等级图例
    clickIcon () { // 表头图标列点击
      this.$layer.iframe({
        content: {
          content: FaultLegend,
          parent: this, // 当前的vue对象
          data: {
            value: JSON.stringify(this.trbLevelAry),
            nomal: true
          }
        },
        area: ['200px', '400px'],
        title: '故障图例'
      })
    },
    initTrbLevel () { // 故障等级
      let self = this
      getFaultLevel().then((res) => {
        self.trbLevelAry = res.data.rows
      }).catch((err) => {
        console.log(err)
      })
    },
    changePanel: function () {
      this.show = !this.show
    },
    handleChange: function (val) {

    },
    // 全部车辆段面板切换到单个车辆段面板
    changeState: function (flag, id, name, x, y) {
      // 清除无数据提示
      dataTootip.hideTootip('car-depot')
      var self = this
      self.loading = true
      if (flag) {
        this.leftMove = true
      } else {
        this.leftMove = false
      }
      if (id) {
        getDepotData(id).then((res) => {
          // 移动到指定的坐标点
          if (x && y) {
            var pointMove = new self.BMap.Point(x, y)
            self.map.panTo(pointMove)
          }
          // 车辆段数据
          self.sxData = res.data.AllDepot
          self.depotAccount = res.data.AllDepotAccount
          self.cityLogo = res.data.URL
          self.depotTitle = name
          if (!self.sxData || self.sxData.length === 0) {
            // 增加无数据提示
            dataTootip.initTootip('car-depot')
          }
          self.loading = false
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    // 编写自定义函数,创建标注
    addCityMarker: function (map, BMap, point, title, eafId) {
      let self = this
      let content = document.createElement('div')
      content.className = 'map-tootip'
      // 生成二级节点
      let contentTitle = document.createElement('h2')
      contentTitle.className = 'map-tootip-title'
      contentTitle.innerHTML = title
      // let contentChild = document.createElement('div')
      // contentChild.className = 'map-tootip-info test-1'
      // // 生成三级节点
      // for (let i = 0; i < depotData.length; i++) {
      //   var domChild = document.createElement('a')
      //   domChild.className = 'cld'
      //   domChild.innerHTML = depotData[i].EAF_NAME
      //   domChild.setAttribute('eafid', depotData[i].EAF_ID)
      //   domChild.setAttribute('eafname', depotData[i].EAF_NAME)
      //   // 加入
      //   contentChild.appendChild(domChild)
      // }
      content.appendChild(contentTitle)
      // content.appendChild(contentChild)
      let opt = {
        width: '180',
        height: '38',
        display: 'block'
      }
      opt.content = content

      // 创建自定义标注
      let mySquare = new BusUnclickedOverlay(point, opt)
      // 添加到地图上
      map.addOverlay(mySquare)
      // var opts = {
      //   width: 200, // 信息窗口宽度
      //   height: 100 // 信息窗口高度
      // }
      // var infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
      // marker.addEventListener('click', function () {
      //   map.openInfoWindow(infoWindow, point) // 开启信息窗口
      // })

      let marker = new BMap.Marker(point)
      map.addOverlay(marker)
      mySquare.hide()
      // 鼠标移入显示
      marker.addEventListener('mouseover', function () {
        mySquare.show()
      })
      // 鼠标移出隐藏
      marker.addEventListener('mouseout', function () {
        mySquare.hide()
      })
      marker.addEventListener('click', function () {
        // 清除无数据提示
        dataTootip.hideTootip('car-depot')
        // 打开表格面板
        self.show = true
        self.leftMove = true
        self.loading = true
        getDepotData(eafId).then((res) => {
          self.sxData = res.data.AllDepot // 设备数据
          self.depotAccount = res.data.AllDepotAccount // 设备总数
          self.depotTitle = title // 车辆段名称
          self.cityLogo = res.data.URL /// 车辆段图标
          if (!self.sxData || self.sxData.length === 0) {
            // 增加无数据提示
            dataTootip.initTootip('car-depot')
          }
          self.loading = false
        }).catch(function (error) {
          console.log(error)
        })
      })
    },
    // 车辆段级自定义标注
    addMarker: function (map, BMap, point, name, src, eafId) {
      let self = this
      let content = document.createElement('div')
      content.className = 'map-depot-tootip'
      // 生成二级节点
      // 图标
      let contentImg = document.createElement('img')
      contentImg.className = 'map-depot-img'
      contentImg.src = src
      content.appendChild(contentImg)
      // 文字
      let contentTitle = document.createElement('h2')
      contentTitle.className = 'map-depot-title'
      contentTitle.innerHTML = name
      content.appendChild(contentTitle)
      let opt = {
        width: '20',
        height: '20',
        display: 'block',
        background: 'none'
      }
      opt.content = content
      // 创建自定义标注
      let mySquare = new BusUnclickedOverlay(point, opt)
      // 添加到地图上
      map.addOverlay(mySquare)

      content.addEventListener('click', function (e) {
        e.stopPropagation()
        // 清除无数据提示
        dataTootip.hideTootip('car-depot')
        // 打开表格面板
        self.show = true
        self.leftMove = true
        self.loading = true
        getDepotData(eafId).then((res) => {
          self.sxData = res.data.AllDepot // 设备数据
          self.depotAccount = res.data.AllDepotAccount // 设备总数
          self.depotTitle = name // 车辆段名称
          self.cityLogo = res.data.URL /// 车辆段图标
          if (!self.sxData || self.sxData.length === 0) {
            // 增加无数据提示
            dataTootip.initTootip('car-depot')
          }
          self.loading = false
        }).catch(function (error) {
          console.log(error)
        })
      })
      // map.openInfoWindow(mySquare, opt) // 开启信息窗口
      // 自定义标注图标的大小控制
      // let url = 'http://localhost:8083/' + src
      // var myIcon = new BMap.Icon(url, new BMap.Size(30, 30))
      // myIcon.imageSize = new BMap.Size(30, 30)
      // let marker = new BMap.Marker(point, {icon: myIcon})
      // // 添加标注
      // map.addOverlay(marker)

      // 标记监听,点击切换弹出提示框
      // marker.addEventListener('click', function (e) {
      //   mySquare.toggle()
      // })
    },
    // 地图面板上的车辆段点击
    cldClick: function () {
      var self = this
      var ary = document.getElementsByClassName('cld')
      for (let i = 0; i < ary.length; i++) {
        ary[i].onclick = function (event) {
          event.stopPropagation()
          // 清除无数据提示
          dataTootip.hideTootip('car-depot')
          // 打开表格面板
          self.show = true
          self.leftMove = true
          self.loading = true
          var eafId = ary[i].getAttribute('eafid')
          getDepotData(eafId).then((res) => {
            self.sxData = res.data.AllDepot
            self.depotAccount = res.data.AllDepotAccount
            self.cityLogo = res.data.URL // 车辆段图标
            self.depotTitle = ary[i].getAttribute('eafname')
            if (!self.sxData || self.sxData.length === 0) {
            // 增加无数据提示
              dataTootip.initTootip('car-depot')
            }
            self.loading = false
          }).catch(function (error) {
            console.log(error)
          })
        }
      }
      return false
    },
    initData: function () {
      var self = this
      mapDataInit().then((res) => {
        if (!res.data.EAF_ERROR) {
          // 所有车辆段设备台数
          self.AllDepotAccount = res.data.AllDepotAccount ? res.data.AllDepotAccount : 0
          self.coordDataCity = res.data.AllCityDepot // 城市级
          self.coordData = res.data.AllDepot // 车辆段级
          return res
        }
      }).then((res) => {
        if (!res.data.EAF_ERROR) {
          setTimeout(function () {
            self.initMap()
          }, 500)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    initMap: function () {
      var self = this
      BauduMap.init().then(BMap => {
        self.BMap = BMap
        // 最大最小缩放级别
        let map = new BMap.Map('container', {minZoom: 5, maxZoom: 15})
        self.map = map
        map.setMapStyle({
          styleJson: MapJson
        })
        for (let i = 0; i < self.coordData.length; i++) {
          let pointXY = new BMap.Point(self.coordData[i].RMD_LNG, self.coordData[i].RMD_LAT)
          self.addCityMarker(map, BMap, pointXY, self.coordData[i].EAF_NAME, self.coordData[i].EAF_ID)
        }
        // 创建地图实例
        let point = new BMap.Point(116.404, 39.915)
        // 创建点坐标
        map.centerAndZoom(point, 1)
        // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom()
        // 禁用双击放大
        map.disableDoubleClickZoom()
        map.addEventListener('zoomend', function () {
        // alert('地图缩放至：' + this.getZoom() + '级')
          var zoomGrade = this.getZoom()
          map.clearOverlays()
          if (zoomGrade > 9) {
            for (let i = 0; i < self.coordData.length; i++) {
              let pointXY = new BMap.Point(self.coordData[i].RMD_LNG, self.coordData[i].RMD_LAT)
              self.addMarker(map, BMap, pointXY, self.coordData[i].EAF_NAME, self.coordData[i].RMD_PICTURE_URL, self.coordData[i].EAF_ID)
            }
          } else {
            for (let i = 0; i < self.coordData.length; i++) {
              let pointXY = new BMap.Point(self.coordData[i].RMD_LNG, self.coordData[i].RMD_LAT)
              self.addCityMarker(map, BMap, pointXY, self.coordData[i].EAF_NAME, self.coordData[i].EAF_ID)
            }
          }
          self.cldClick()
        })
        self.cldClick()
      })
    },
    // 网络状态
    netState: function (state) {
      if (!state || state === 1) {
        return require('assets/image/wl1.png')
      } else {
        return ''
      }
    },
    // 故障状态
    troubleState: function (state) {
      if (!state || state === 0) {
        return ''
      } else if (state === 1) {
        return require('assets/image/gz1.png')
      } else if (state === 2) {
        return require('assets/image/gz2.png')
      } else if (state === 3) {
        return require('assets/image/gz3.png')
      }
    },
    trubleTitle: function (state) {
      if (!state || state === 0) {
        return ''
      } else if (state === 1) {
        return '1级故障'
      } else if (state === 2) {
        return '2级故障'
      } else if (state === 3) {
        return '3级故障'
      }
    }
  },
  mounted () {
    this.initData()
    this.initTrbLevel()
  }
}

</script>

<style lang="scss" rel="stylesheet/scss">
@import "assets/css/variable.scss";

.test-1::-webkit-scrollbar {/*滚动条整体样式*/
        width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
.test-1::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
         -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: darkgrey;
    }
.test-1::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #EDEDED;
    }
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0px;
  padding: 0px;
  font-size: 14px;
  user-select: none;
}
li{
  list-style: none;

}
// 隐藏地图logo
.anchorBL{
  display:none
  }
// 地图提示面板
.map-tootip{
  border:1px solid #32A4A8;
  width:100%;
  height:100%;
  border-radius:6px;
  box-shadow: #32A4A8 0 0 14px 1px;
  background: #fff;
  color:#666666;
  .map-tootip-title{
    height:38px;
    line-height:38px;
  }
  .map-tootip-info{
    width:100%;
    height:80px;
    line-height:20px;
    overflow:auto;
    padding:0 4px;
    // display: table-cell;
    // vertical-align: middle;
    // text-align: center;
    a{
      margin:2px;
      color:#666666;
      text-decoration: underline;
      cursor: pointer;
      &:hover{
        color:#396EA0
      }
    }
  }
}
.map-depot-tootip{
  width:30px;
  height:30px;
  border-radius:6px;
  color:#666666;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  position: relative;
  .map-depot-img{
    width: 30px;
    height: 36px;
    border-radius: 42%;
    border-top-left-radius: 66%;
    border-top-right-radius: 66%;
    border-bottom-left-radius: 82%;
    border-bottom-right-radius: 82%;
  }
  .map-depot-title{
    color:#666666       ;
    font-size: 10px;
    position: absolute;
    width: 120px;
    top:110%;
    border:2px solid #32A4A8;
    box-shadow: #32A4A8 0 0 14px 1px;
  }
}
.left1{
  left:-100% !important;
}
.left2{
  left:0 !important;
}
.container-parent{
  width:100%;
  height:100%;
  position: relative;
}
.container {
  height: 100%;
}
.container-panel{
  width:422px;
  height:545px;
  overflow-x: hidden;
  line-height: 40px;
  position: absolute;
  top:10px;
  right:10px;
  color:#fff;
  .panel-title {
    height:40px;
    border-radius: 4px;
    padding:0 10px;
    display: flex;
    align-items: center;
    background-color: rgba(31, 78, 86, 1);
    .el-icon-arrow-left{
      padding: 10px;
      cursor: pointer;
    }
    span{
      display: inline-block;
      &:not(:first-child){
        width:25%;
      }
      &:nth-of-type(1){
        width:50%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:last-child{
        text-align: right;
        cursor: pointer;
      }
    }
  }
  .panel-main{
    width:100%;
    height:505px;
    background: #F2F2F2;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    position:absolute;
    left:0;
    overflow-x: hidden;
    li{
      color:#666666;
      height:55px;
      line-height: 50px;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding-top:5px;
      &:hover{
        background: #E6E6E6;
      }
      &::after{
        content: "";
        width:95%;
        height:1px;
        background: #D6CCCC;
        margin:0 auto;
        position: absolute;
        left:0;
        right:0;
        bottom:0;
      }
      img{
        width:22px;
        margin:0 5px;
      }
      .msc-title-parent{
        width: 45%;
        height: 100%;
        line-height: 25px;
        padding-left:2%;
        font-size: 14px;
        div:nth-of-type(2){
          font-size: 12px;
          color:#CCCCCC;
        }
      }
      .msc-title-parent2{
        height: 100%;
        line-height: 25px;
        font-size:12px;
      }
    }
  }
  .car-depot{
    width:100%;
    height:500px;
    background: #F2F2F2;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    position: absolute;
    left:100%;
    .car-depot-title{
      color:#666666;
      text-align: center;
      span{
        display:inline-block;
        &:first-child{
          width:40%;
        }
        &:nth-of-type(2){
          width:20%;
        }
        &:nth-of-type(3){
          width:40%;
        }
      }
    }
    ul{
        overflow-x: hidden;
        width: 100%;
        height: 455px;
        margin: 0 5px;
        background: #fff;
      li{
        color:#666666;
        height:50px;
        line-height: 50px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover{
          background: #E6E6E6;
        }
        &::after{
          content: "";
          width:95%;
          height:1px;
          background: #D6CCCC;
          margin:0 auto;
          position: absolute;
          left:0;
          right:0;
          bottom:0;
        }
        .msc-title-parent{
          height:100%;
          line-height: 25px;
          font-size:14px;
          text-align: center;
          &:nth-child(1){
            width:40%;
          }
          &:nth-child(2){
            width:20%;
          }
          &:nth-child(3){
            width:40%;
          }
          div{
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            text-overflow: ellipsis;
          }
          div:nth-of-type(2){
            font-size: 12px;
            color:#CCCCCC;
          }
          img{
            width:32px;
            margin:0 5px;
          }
        }
      }
    }
  }
  .cursor {
    cursor: $cursor;
  }
}
/* 三角形 */
.map-tootip::after{
    position: absolute;
    z-index: -1;
    content: "";
    bottom: -8px;
    left: 80px;
    /* border-left: 15px solid transparent; */
    /* border-right: 15px solid transparent; */
    /* border-top: 15px solid yellow; */
    width: 20px;
    height: 20px;
    background: #fff;
    border: 1px solid #32A4A8;
    box-shadow: #32A4A8 0 0 14px 1px;
    transform: rotateZ(45deg);
}

</style>
