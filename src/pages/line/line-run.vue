<template>
  <div>
    <template v-if="defaultSel">
            <my-line v-bind:line-data="lines" :def-sel.sync="defaultSel"></my-line>
        </template>
            <div id="info" class="info">
        <img class="line-arrow-left hidde" src="/RMD/Common/images/u30187.png" alt="img" :class="{show:show}"/>
        <ul>
            <li v-for="(item,index) in stations" :key="index">
                <div class="column-content column-content-top">
                    <div class="train-content" v-for="(upitem,upindex) in item.upObj" :key="upindex">
                        <div class="train-content-code" :style="{borderColor:bdColor(upitem.BOM_TRB_STATE)}"
                             @click="jumpStatusPage(upitem.BOM_TRAINNUMBER)">
                            <span title="点击查看列车状态" :style="{color:fontColor(upitem.BOM_TRB_STATE)}">{{upitem.BOM_TRAINNUMBER}}</span>
                            <template v-if="upitem.BOM_TRB_STATE != 0">
                                <img class="train-content-code-img" :src="stationImage(upitem.BOM_TRB_STATE)"
                                     :title="titleState(upitem.BOM_TRB_STATE)" alt="img"
                                     @mouseover="errorInfoShow($event,upitem.BOM_TRAINNUMBER)" @mouseout="errorInfoHide($event)"/>
                            </template>
                        </div>
                        <img class="train-content-img" src="/RMD/Common/images/u30047.png" alt="img"/>

                        <div class="error-info" @mouseenter="panelShow($event)" @mouseleave="panelHide($event)">
                            <p class="first-eor"></p>

                            <div class="error-info-body">
                                <!--此部分可以动态生成-->
                                <div class="eor-bottom-content" v-for="(eitem,index) in errorInfo" :key="index" @click="jumperrorDetail(eitem)"  v-cloak>
                                    <img :src="breakdownImage(eitem.BOM_TROUBLE_LEVEL)" class="eor-bottom-img1"
                                         v-cloak/>
                                    <p class="p-left" :id="eitem.EAF_ID" :title="eitem.EAF_NAME" v-cloak>{{eitem.EAF_NAME}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column-top">
                    <div class="column-top-img" :class="{hiddenCla:item.upObj.length == 0 }">
                        <div class="column-top-img-btm"></div>
                        <div class="column-top-img-top"></div>
                    </div>
                    <div class="train-content-parent">
                        <div class="train-content" v-for="(uritem,urindex) in item.upRunObj" :key="urindex">
                            <div class="train-content-code" :style="{borderColor:bdColor(uritem.BOM_TRB_STATE)}"
                                 @click="jumpStatusPage(uritem.BOM_TRAINNUMBER)">
                                <span title="点击查看列车状态" :style="{color:fontColor(uritem.BOM_TRB_STATE)}">{{uritem.BOM_TRAINNUMBER}}</span>
                                <template v-if="uritem.BOM_TRB_STATE != 0">
                                    <img class="train-content-code-img" :src="stationImage(uritem.BOM_TRB_STATE)"
                                         :title="titleState(uritem.BOM_TRB_STATE)" alt="img"
                                         @mouseover="errorInfoShow($event,uritem.BOM_TRAINNUMBER)" @mouseout="errorInfoHide($event)"/>
                                </template>
                            </div>
                            <img class="train-content-img2 train-breathe" src="/RMD/Common/images/u30040.png"
                                 alt="img"/>
                            <div class="error-info" @mouseenter="panelShow($event)" @mouseleave="panelHide($event)">
                                <p class="first-eor"></p>

                                <div class="error-info-body">
                                    <!--此部分可以动态生成-->
                                    <div class="eor-bottom-content" v-for="(eitem,index) in errorInfo" :key="index" @click="jumperrorDetail(eitem)" v-cloak>
                                        <img :src="breakdownImage(eitem.BOM_TROUBLE_LEVEL)" class="eor-bottom-img1"
                                             v-cloak/>

                                        <p class="p-left" :id="eitem.EAF_ID" :title="eitem.EAF_NAME" v-cloak>{{eitem.EAF_NAME}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column-round">
                    <div class="box1">
                        <div class="box2">
                            <div class="box3"></div>
                        </div>
                    </div>
                    <template v-if="index != stations.length-1">
                        <div class="cyl cyl-bg1"></div>
                    </template>
                </div>
                <div class="column-char">
                    <span class="column-char-text">{{item.EAF_NAME}}</span>
                </div>
                <div class="column-round">
                    <div class="box1">
                        <div class="box2">
                            <div class="box3"></div>
                        </div>
                    </div>
                    <template v-if="index != stations.length-1">
                        <div class="cyl cyl-bg2"></div>
                    </template>
                    <template v-else>
                        <img class="line-arrow-right" src="/RMD/Common/images/u30189.png" alt="img"/>
                    </template>
                </div>
                <div class="column-btm">
                    <div class="column-top-img" :class="{hiddenCla:item.downObj.length == 0 }">
                        <div class="column-top-img-top"></div>
                        <div class="column-top-img-btm"></div>
                    </div>
                    <div class="train-content-parent">
                        <div class="train-content" v-for="(dritem,drindex) in item.downRunObj" :key="drindex">
                            <img class="train-content-img2-rotate train-breathe" src="/RMD/Common/images/u30040.png"
                                 alt="img"/>
                            <div class="train-content-code" :style="{borderColor:bdColor(dritem.BOM_TRB_STATE)}"
                                 @click="jumpStatusPage(dritem.BOM_TRAINNUMBER)">
                                <span title="点击查看列车状态" :style="{color:fontColor(dritem.BOM_TRB_STATE)}">{{dritem.BOM_TRAINNUMBER}}</span>
                                <template v-if="dritem.BOM_TRB_STATE != 0">
                                    <img class="train-content-code-img2" :src="stationImage(dritem.BOM_TRB_STATE)"
                                         :title="titleState(dritem.BOM_TRB_STATE)" alt="img"
                                         @mouseover="errorInfoShow($event,dritem.BOM_TRAINNUMBER)" @mouseout="errorInfoHide($event)"/>
                                </template>
                            </div>
                            <div class="error-info error-info-top" @mouseenter="panelShow($event)"
                                 @mouseleave="panelHide($event)">
                                <p class="first-eor"></p>

                                <div class="error-info-body">
                                    <!--此部分可以动态生成-->
                                    <div class="eor-bottom-content" v-for="(eitem,index) in errorInfo" :key="index" @click="jumperrorDetail(eitem)" v-cloak>
                                        <img :src="breakdownImage(eitem.BOM_TROUBLE_LEVEL)" class="eor-bottom-img1"
                                             v-cloak/>

                                        <p class="p-left" :id="eitem.EAF_ID" :title="eitem.EAF_NAME" v-cloak>{{eitem.EAF_NAME}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column-content column-content-btm">
                    <div class="train-content" v-for="(downitem,downindex) in item.downObj" :key="downindex">
                        <img class="train-content-img" src="/RMD/Common/images/u30047.png" alt="img"/>

                        <div class="train-content-code" :style="{borderColor:bdColor(downitem.BOM_TRB_STATE)}"
                             @click="jumpStatusPage(downitem.BOM_TRAINNUMBER)">
                            <span title="点击查看列车状态" :style="{color:fontColor(downitem.BOM_TRB_STATE)}">{{downitem.BOM_TRAINNUMBER}}</span>
                            <template v-if="downitem.BOM_TRB_STATE != 0">
                                <img class="btm-train-content-code-img" :src="stationImage(downitem.BOM_TRB_STATE)"
                                     :title="titleState(downitem.BOM_TRB_STATE)" alt="img"
                                     @mouseover="errorInfoShow($event,downitem.BOM_TRAINNUMBER)" @mouseout="errorInfoHide($event)"/>
                            </template>
                        </div>
                        <div class="error-info error-info-top" @mouseenter="panelShow($event)"
                             @mouseleave="panelHide($event)">
                            <p class="first-eor"></p>

                            <div class="error-info-body">
                                <!--此部分可以动态生成-->
                                <div class="eor-bottom-content" v-for="(eitem,index) in errorInfo" :key="index" @click="jumperrorDetail(eitem)" v-cloak>
                                    <img :src="breakdownImage(eitem.BOM_TROUBLE_LEVEL)" class="eor-bottom-img1"
                                         v-cloak/>

                                    <p class="p-left" :id="eitem.EAF_ID" :title="eitem.EAF_NAME" v-cloak>{{eitem.EAF_NAME}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>

  </div>
</template>

<script>
import myLine from 'pages/line/component/line'
import eaf from 'assets/js/eaf'
import axios from 'axios'
import logoutMixin from 'assets/js/mixin'
export default{
  name: 'line-run',
  mixins: [logoutMixin],
  components: {
    myLine
  },
  data () {
    return {
      flag: false,
      errorFlag: false,
      show: false,
      defaultSel: '', // 默认线路id
      initData: [],
      lines: [], // 线路数据
      stations: [], // 车站站点数据
      errorInfo: [] // 故障数据
    }
  },
  methods: {
    initInterFace (linesId) {
      var that = this
      var paraData = {
        linesId: linesId || '',
        'type': ''
      }
      const url = eaf.getFrameUrl('VehicleRela', 'getTrunkLineOperationData', 'data')
      axios.post(url, {
        paraData: paraData
      }).then(res => {
        res = res.data
        if (res.EAF_ERROR) {
          this.logout()
        }
        if (!that.defaultSel) {
          that.defaultSel = res.selectedLineId
          that.lines = res.lineData
          that.show = true
        }
        that.initData = res
        that.stations = res.stationData
      })
    }
  },
  mounted () {
    this.initInterFace()
  }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

html, body {
    background-color: rgba(4, 94, 106, 1);
    height: 100%;
}

body {
    background-image: url(/RMD/Common/images/bg.jpg);
}

[v-cloak] {
    display: none;
}

.content-body {
    height: 100%;
}

.line {
    width: 100%;
    padding: 30px;
    position: relative;
}
.zx-kn{
    height: 37px;
    position: absolute;
    top: 30px;
    right: 35px;
}
.qh{
    width: 60px;
    height:37px;
    background-color: #013441;
    box-sizing: border-box;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
}
.qh:hover{
    box-shadow: 0 0 20px rgba(72,190,193,1), 0 0 20px rgba(72,190,193,1) inset;
}
.qh-select{
    border: 1px solid #48BEC1;
}
/*线路组件样式*/
ul.line-ul {
    width: 96%;
    display: flex;
    flex-wrap: wrap;
}

ul.line-ul > li {
    float: left;
    display: flex;
    flex-direction: column;
}

ul.line-ul > li > p {
    width: 100%;
    height: 100%;
    padding: 0.06rem 0.08rem;
    border-bottom-width: 5px;
    border-bottom-style: solid;
    border-color: transparent;
    color: #fff;
}

ul.line-ul > li:hover {
    font-weight: 700;
    cursor: pointer;
}

/*正线运行图*/
.info {
    width: 100%;
    position: relative;
    margin: 0 30px;
}

.info > ul {
    width: 100%;
    min-height: 3rem;
    display: flex;
    flex: 1;
    padding: 30px;
    margin-top: 100px;
    position: relative;
}

.info > ul > li {
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
}

.info > ul > li > div {
    width: 100%;
    display: flex;
    align-items: left;
    justify-content: left;
}

.line-arrow-left {
    position: absolute;
    top: 108px;
    left: 2px;
}

.line-arrow-right {
    margin-left: 6px;
}

.column-content {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.column-content-top {
    position: absolute;
    bottom: 100%;
}

.column-content-btm {
    position: absolute;
    top: 100%;
}

.train-content {
    width:38px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    position: relative;
    margin-left: -11px;
}

.train-content-parent {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    color: #fff;
    position: absolute;
    left: 48%;
}

.train-content-code {
    width: 38px;
    padding: 0 0.04rem;
    border-radius: 4px;
    font-size: 12px;
    background: rgba(6, 6, 6, .1);
    position: relative;
    border-width: 1px;
    border-style: solid;
    text-align: center;
    cursor: pointer;
}

.train-content-code-img {
    position: absolute;
    top: -14px;
    right: -10px;
    z-index: 1000;
    text-align: center;
}

.train-content-code-img2 {
    position: absolute;
    bottom: -10px;
    right: -10px;
    z-index: 1000;
}

.btm-train-content-code-img {
    position: absolute;
    bottom: -10px;
    right: -10px;
}

.train-content-img {
    width: 20px;
}

.train-content-img2 {

}

.train-content-img2-rotate {
    transform: rotateX(180deg) rotateZ(180deg);
}

.train-breathe {
    -webkit-animation-timing-function: ease-in-out;
    -webkit-animation-name: breathe;
    -webkit-animation-duration: 500ms;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
}

.column-top {
    width: 100%;
    position: relative;
    align-items: flex-end !important;
}

.column-btm {
    position: relative;
}

.column-top-img {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-left: -2px;
}

.column-top-img-btm {
    width: 20px;
    height: 4px;
    background-color: #FFD101;
    border-radius: 4px;
}

.column-top-img-top {
    width: 4px;
    height: 80px;
    margin-top: -2px;
    background-color: #FFD101;
    border-radius: 4px;
}

.column-char {
    justify-content: center;
    flex: 1;
}

.column-char-text {
    height: 100%;
    color: #48BEC1;
    display: flex;
    flex-direction: column;
    width: 0.16rem;
    background-color: rgba(0, 0, 0, .1);
    padding: 0.2rem 0.14rem;
    align-items: center;
    margin-left: -0.06rem;
    font-size: 12px;
}

.column-round {
    align-items: center !important;
}

.box1 {
    width: 16px;
    height: 16px;
    background-color: #FFD101;
    padding: 2px;
    border-radius: 16px;
}

.box2 {
    width: 12px;
    height: 12px;
    background-color: #013441;
    padding: 3px;
    border-radius: 12px;
}

.box3 {
    width: 6px;
    height: 6px;
    background-color: #FFD101;
    padding: 2px;
    border-radius: 6px;
}

.cyl {
    width: calc(100% - 0.12rem);
    height: 0.08rem;
    background: #FFD101;
    margin-left: -0.02rem;
    margin-right: -0.2rem;
}

.cyl-bg1 {
    background: #FFD101 url(/RMD/Common/images/online-arrow-left.png) no-repeat center center;
}

.cyl-bg2 {
    background: #FFD101 url(/RMD/Common/images/online-arrow-right.png) no-repeat center center;
}

.error-info {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    top: -5px;
    left: 90%;
    display: none;
    background-color: rgba(51, 51, 51, 0.8);
    z-index: 1001;
}

.error-info::after {
    display: block;
    content: "";
    position: absolute;
    bottom: 0px;
    left: 0px;
    height: 1px;
    width: 100%;
    background: url(/RMD/Common/images/long-title-bottom-line.png) no-repeat;
}

.error-info-top {
    top: 98%;
}

.first-eor {
    width: 100%;
    position: relative;
}

.first-eor::before {
    display: block;
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    height: 1px;
    width: 100%;
    transform: rotate(180deg);
    background: url(/RMD/Common/images/long-title-bottom-line.png) no-repeat;
}

.error-info-body {
    width: 100%;
    height: 98%;
    position: relative;
    overflow: auto;
    margin-top: 1%;
    margin-bottom: 1%;
}

.eor-bottom-content {
    width: 100%;
    padding: 4px 0;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.eor-bottom-img1 {
    padding-left: 0.1rem;
}

.eor-bottom-content p {
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
}

.hiddenCla {
    opacity: 0.4;
}

.show {
    display: block;
}

.hidde {
    display: none;
}

@-webkit-keyframes breathe {
    0% {
        opacity: 0.4;
    }
    100% {
        opacity: 1;
    }
}
</style>
