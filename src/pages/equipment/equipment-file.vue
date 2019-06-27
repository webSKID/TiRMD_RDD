<template>
<div id="info" class="info">
    <el-header height="30px">
      <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/equipment/equipment-list' }">设备列表</el-breadcrumb-item>
          <el-breadcrumb-item>设备工况</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class='main'>
      <el-dialog  custom-class='detail-dialog' title="设备概况" :visible.sync="dialogTableVisible"  width='70%' top='60px'>
          <FileDetail :parent-swiper-data='swiperData' :parent-equip-data='equipData'></FileDetail>
      </el-dialog>
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="设备工况" name="first">
              <el-row class="row-top">
                  <el-col :span="8">
                      <div class="block">
                          <el-carousel trigger="click" height="300px" :autoplay="false">
                            <template v-if='swiperData && swiperData.length > 0'>
                              <el-carousel-item v-for="(swiper,sindex) in swiperData" :key="sindex">
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
                      <div class='prop-desc-parent'>
                          <el-row class="prop-desc">
                              <el-col :span='8'><span>名称:</span></el-col>
                              <el-col :span='16'><span>{{equipData.EAF_NAME}}</span></el-col>
                          </el-row>
                          <el-row>
                              <el-col :span='8'><span>故障状态:</span></el-col>
                              <el-col :span='16'>
                                <template v-if='equipData.TRBLEVEL_URL'>
                                  <span :title="equipData.TRBLEVEL_NAME">
                                    <svg class="icon" aria-hidden="true">
                                      <use :xlink:href="equipData.TRBLEVEL_URL"></use>
                                    </svg>
                                  </span>
                                  <i class="el-icon-question cursor" @click="clickIcon"></i>
                                </template>
                                <template v-else>
                                  <span :title="equipData.TRBLEVEL_NAME">{{equipData.TRBLEVEL_NAME}}</span>
                                </template>
                              </el-col>
                          </el-row>
                          <el-row class="prop-desc">
                              <el-col :span='8'><span>型号规格:</span></el-col>
                              <el-col :span='16'><span>{{equipData.RMD_TS}}</span></el-col>
                          </el-row>
                          <el-row>
                              <el-col :span='8'><span>设备编码:</span></el-col>
                              <el-col :span='16'><span>{{equipData.EAF_CODE}}</span></el-col>
                          </el-row>
                          <el-row class="prop-desc">
                              <el-col :span='8'><span>制造厂商:</span></el-col>
                              <el-col :span='16'><span>{{equipData.RMD_MANUF}}</span></el-col>
                          </el-row>
                          <el-row>
                              <el-col :span='8'><span>制造日期:</span></el-col>
                              <el-col :span='16'><span>{{equipData.RMD_MANUF_TIME_STR}}</span></el-col>
                          </el-row>
                          <el-row class="prop-desc">
                              <el-col :span='8'><span>外形尺寸:</span></el-col>
                              <el-col :span='16'><span>{{equipData.RMD_DIMEN}}</span></el-col>
                          </el-row>
                          <el-row class="prop-desc-bottom">
                              <el-button type="primary" @click="dialogTableVisible = true">更多</el-button>

                          </el-row>
                      </div>
                  </el-col>
                  <el-col :span="16" class="swiper-right">
                      <el-row class='swiper-right-seach'>
                        <el-col :span='8' class='gray'>
                          采集时间：2019-02-13 14:23:00
                        </el-col>
                        <el-col :span='5'>
                          <el-input v-model='search' placeholder='请输入检查项' clearable class="inline-input"></el-input>
                        </el-col>
                        <el-col :span='4' class="center">
                          <el-select v-model='selectValue'  @change='searchTable'  style="width:90%">
                            <el-option v-for='hcol in tableHeaderCol' :value='hcol.value' :label='hcol.label' :key='hcol.value'>
                            </el-option>
                          </el-select>
                        </el-col>
                         <el-col :span='4' class="left">
                          <el-select v-model='headListValue' @change='headListChange' placeholder='请选择表格每页条数' style="width:90%">
                            <el-option v-for='col in tableHeadList' :value='col.value' :label='col.label' :key='col.value'>
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span='3'>
                          <el-button type="primary" icon="el-icon-search" @click="searchTable">查询</el-button>
                        </el-col>
                      </el-row>
                      <div class="attribute-list" v-loading="loading3" element-loading-text="拼命加载中">
                        <el-table v-if='groupNum>=2' :data='table1' border >
                          <el-table-column prop='EAF_NAME' label='检验项' align='center' :show-overflow-tooltip='true'></el-table-column>
                          <el-table-column prop='value' label='检验值' align='center' :show-overflow-tooltip='true'>
                            <template slot-scope="scope">
                              <div v-if="scope.row.type === 'CURVE'" class='cursor' @click="getChart(scope.row.EAF_NAME,scope.row.RMD_KEY)">
                                <el-button size="mini" >查看</el-button>
                              </div>
                              <div v-else>
                                {{scope.row.value}}
                              </div>
                            </template>
                             <!-- <template slot-scope="scope">
                              <el-popover trigger="click" placement="left">
                                <tableChart v-if='scope.row.EAF_CODE' :chart-id='scope.row.EAF_CODE'></tableChart>
                                <span slot="reference">{{ scope.row.EAF_NAME }}</span>
                              </el-popover>
                            </template> -->
                          </el-table-column>
                        </el-table>
                        <el-table v-if='groupNum>=2' :data='table2' border>
                          <el-table-column prop='EAF_NAME' label='检验项' align='center' :show-overflow-tooltip='true'></el-table-column>
                          <el-table-column prop='value' label='检验值' align='center' :show-overflow-tooltip='true'>
                            <template slot-scope="scope">
                              <div v-if="scope.row.type==='CURVE'" class='cursor' @click="getChart(scope.row.EAF_NAME,scope.row.RMD_KEY)">
                                <el-button size="mini" >查看</el-button>
                              </div>
                              <div v-else>
                                {{scope.row.value}}
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-table v-if='groupNum>=3' :data='table3' border >
                          <el-table-column prop='EAF_NAME' label='检验项' align='center' :show-overflow-tooltip='true'></el-table-column>
                          <el-table-column prop='value' label='检验值' align='center' :show-overflow-tooltip='true'>
                            <template slot-scope="scope">
                              <div v-if="scope.row.type === 'CURVE'" class='cursor' @click="getChart(scope.row.EAF_NAME,scope.row.RMD_KEY)">
                                <el-button size="mini" >查看</el-button>
                              </div>
                              <div v-else>
                                {{scope.row.value}}
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-table v-if='groupNum>=4' :data='table4' border >
                          <el-table-column prop='EAF_NAME' label='检验项' align='center' :show-overflow-tooltip='true'></el-table-column>
                          <el-table-column prop='value' label='检验值' align='center' :show-overflow-tooltip='true'>
                            <template slot-scope="scope">
                              <div v-if="scope.row.type === 'CURVE'" class='cursor' @click="getChart(scope.row.EAF_NAME,scope.row.RMD_KEY)">
                                <el-button size="mini" >查看</el-button>
                              </div>
                              <div v-else>
                                {{scope.row.value}}
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="tableList" :page-size="tablePageSize" :current-page="tablePage" layout="total, prev, pager, next, jumper" :total="tableTotal">
                        </el-pagination>
                  </el-col>
              </el-row>
          </el-tab-pane>
          <el-tab-pane label='故障报警' name='second'>
            <span slot="label">故障报警<span ref="gzbj">{{trbNum}}</span></span>
            <FaultPage  v-if="activeName=='second'" :eaf-id='equimentId'></FaultPage>
          </el-tab-pane>
          <el-tab-pane :label='item.EAF_NAME'  :name="index.toString()" :htId="item.EAF_ID" v-for='(item,index) in htTab' :key='item.EAF_ID'>
            <template v-if='JSON.stringify(postData)!=="{}"'>
              <HtPage v-if="activeName==index.toString()" @changeHtData="changeHtData" v-on:postChange="changePost($event)" :post='postData' :ht-id='item.EAF_ID'></HtPage>
            </template>
          </el-tab-pane>
      </el-tabs>
    </el-main>
</div>
</template>

<script>
// 工况设备详情页面
import FileDetail from 'pages/equipment/equipment-file-detail'
// 波形图表
import tableChart from 'pages/equipment/component/table-echarts'
// 故障预警页面
import FaultPage from 'pages/equipment/equipment-fault'
// HT页面
import HtPage from 'pages/equipment/equipment-ht'
import { initEquipBasicData, getEquipFileTable, getCurve, getEquimenKeys, getFaultLevel, getHtInitData } from '@/assets/js/equipment'
// 故障图例弹出框
import FaultLegend from 'pages/equipment/component/fault-legend'
export default {
  name: 'equipment-file',
  components: {
    FileDetail,
    tableChart,
    FaultPage,
    HtPage
  },
  data () {
    return {
      title: 'ttt',
      activeName: 'first',
      equimentId: this.$route.params.userId, // 设备id
      rmdId: '', // 给websocket用的设备类id RMD_ID
      trbState: '', // 故障状态资源字段
      docWid: '',
      docHei: '',
      search: '',
      tableHeaderCol: [{value: 2, label: '2列'}, {value: 3, label: '3列'}, {value: 4, label: '4列'}],
      equipData: {},
      selectValue: 2,
      groupNum: 2,
      dialogTableVisible: false,
      dialogHeight: '100%',
      table1: [],
      table2: [],
      table3: [],
      table4: [],
      tableHeight: window.innerHeight - 450,
      headListValue: 10,
      tableHeadList: [{value: 10, label: '10条/列'}, {value: 20, label: '20条/列'}, {value: 30, label: '30条/列'}], // 表格每页显示条数
      tableList: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120], // 表格每页显示条数
      tablePageSize: 20, // 表格初始化每页显示条数
      tablePage: 1, // 表格当前页
      tableTotal: 0, // 总条数
      tabData: [
        {
          label: '用户管理',
          name: 'first'
        },
        {
          label: '配置管理',
          name: 'second'
        },
        {
          label: '角色管理',
          name: 'third'
        },
        {
          label: '定时任务补偿',
          name: 'fourth'
        }
      ],
      swiperData: [],
      webSocket: '', // webSocket初始化对象
      webSocketData: {}, // 给webSocket发送的数据

      htTab: [], // ht页面tab数据 add by SKID 20190401
      postData: {}, // ht页面json转换数据
      htData: {},
      tabID: '', // 画布tab标签的id
      webSocketType: 'dataItem', // webSocket请求类型
      loading3: true,
      trbLevelAry: [], // 故障图例
      trbNum: null, // 默认未解除故障数
      init: true // 初始化标识
    }
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
            if (rowData[i].EAF_CNAME === 'RMD_TRB_STATE') {
              self.trbState = self.equipData[self.rowKeyFormatter(rowData[i])]
            }
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },
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
    // 弹出框大小
    defaultSize: function () {
      this.docWid = window.innerWidth * 0.5
      this.docHei = window.innerHeight * 0.6
    },
    getChart (name, key) {
      getCurve(this.rmdId, key).then((res) => {
        if (!res.data.EAF_ERROR) {
          let chartData = res.data
          this.$layer.iframe({
            content: {
              content: tableChart, // 传递的组件对象
              parent: this, // 当前的vue对象
              data: {
                domW: this.docWid,
                domH: this.docHei,
                chartId: key,
                x: JSON.stringify(chartData['x']),
                y: JSON.stringify(chartData['y'])
              }
            },
            area: [this.docWid + 'px', this.domHei + 'px'],
            title: name + '波形图'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleClick (tab, event) { // tab点击刷新 add by SKID 20190402
      let self = this
      if (tab.label === '设备工况') {
        self.webSocketType = 'dataItem'
        // this.getTableData()
      } else if (tab.label === '故障报警') {
        self.webSocketType = 'trbNum'
      } else {
        self.webSocketType = 'canvas'
        self.tabID = tab.$attrs.htId
        self.changeHtData()
      }
    },
    changeHtData () { // ht页面json转换数据  add by SKID 20190402
      let self = this
      self.$ht.Default.xhrLoad('/RDD/HtClient/instance/storage/displays/' + self.tabID + '.json', function (text) {
        if (text) {
          text = text.replace(/symbols/g, '/RDD/HtClient/instance/storage/symbols')
          let json = self.$ht.Default.parse(text)
          let paramArr = []
          for (let item of json.d) {
            if (item.a) {
              let key = Object.keys(item.a)[0] // 后台ht编辑器图标中只规定两种文本框：数据项文本框只有param, 组态文本框为urlName和urlSrc,此处只判断[0]为param就行
              let str = Object.values(item.a)[0]
              let index = str.lastIndexOf('-')
              let val = str.substring(index + 1, str.length)
              if (key === 'param') {
                paramArr.push(val)
                self.postData[val] = '---'
              }
            }
          }
          getHtInitData(self.rmdId, paramArr.join(',')).then((res) => {
            self.postData = (res.data)[0]
          }).catch((err) => {
            console.log(err)
          })
          // websocket需要的数据格式
          self.webSocketSendData(paramArr, self.tabId)
          // 发送
          self.webSocketSend()
        }
      })
    },
    // 接收子组件变量值的变化
    changePost (obj) {
      this.tabID = obj
    },
    // 切换每页条数的时候触发
    handleSizeChange (val) {
      this.tablePageSize = val
      if (this.init) {
        this.searchInterFace()
      } else {
        this.searchInterFace(this.search)
      }
      console.log(`每页 ${val} 条`)
    },
    // 翻页时触发
    handleCurrentChange (val) {
      this.tablePage = val
      if (this.init) {
        this.searchInterFace()
      } else {
        this.searchInterFace(this.search)
      }

      console.log(`当前页: ${val}`)
    },
    headListChange (val) { // 自定义分页改变
      this.tablePage = 1
      this.tablePageSize = val * this.selectValue
      this.searchInterFace()
    },
    getTableData () { // 初始化接口
      let self = this
      initEquipBasicData(this.equimentId, this.tablePage, this.tablePageSize, this.selectValue).then((res) => {
        if (!res.data.EAF_ERROR) {
          self.htTab = res.data.canvas.rows // tab点击刷新 add by SKID 20190401
          self.rmdId = res.data.equipData[0]['RMD_ID']
          self.equipData = res.data.equipData[0] // 设备数据
          let objDatas = res.data.paramObj
          self.table1 = objDatas.array1 // 表格列
          self.table2 = objDatas.array2
          self.table3 = objDatas.array3
          self.table4 = objDatas.array4
          self.tableTotal = parseInt(res.data.paramObj.total) // 表格数据总数
          self.swiperData = res.data.imageData
          self.trbNum = res.data.trbNum || res.data.trbNum !== 0 ? (res.data.trbNum > 99 ? '99+' : res.data.trbNum) : ''

          if (self.trbNum === '') {
            this.$refs.gzbj.className = ''
            this.$refs.gzbj.innerHTML = ''
          } else {
            this.$refs.gzbj.className = 'brage-num'
            this.$refs.gzbj.innerHTML = self.trbNum
          }
          self.getRowKeyTable()

          setTimeout(() => {
            self.loading3 = false
          }, 500)
          // websocket需要的数据格式
          self.webSocketSendData(objDatas)
          // webSocket初始化连接
          self.initWebSocket()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    searchTable () { // 查询按钮
      this.tablePage = 1
      this.tablePageSize = this.headListValue * this.selectValue
      this.init = false
      this.searchInterFace(this.search)
    },
    searchInterFace (_search) { // 查询接口
      let self = this
      self.loading3 = true
      getEquipFileTable(this.equimentId, this.tablePage, this.tablePageSize, this.selectValue, _search || '').then((res) => {
        if (!res.data.EAF_ERROR) {
          let objDatas = {
            array1: res.data.array1 ? res.data.array1 : [],
            array2: res.data.array2 ? res.data.array2 : [],
            array3: res.data.array3 ? res.data.array3 : [],
            array4: res.data.array4 ? res.data.array4 : []
          }
          self.table1 = res.data.array1 // 表格列
          self.table2 = res.data.array2
          self.table3 = res.data.array3
          self.table4 = res.data.array4
          self.tableTotal = parseInt(res.data.total) // 表格数据总数
          self.groupNum = self.selectValue

          setTimeout(() => {
            self.loading3 = false
          }, 500)
          // 拼接websocket数据格式
          self.webSocketSendData(objDatas)
          // 发送
          self.webSocketSend()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    initWebSocket () {
      // 判断当前浏览器是否支持websocket
      if ('WebSocket' in window) {
        const localhostPath = window.document.location.host
        this.webSocket = new WebSocket('ws://' + localhostPath + '/pushMsg')
        // this.webSocket = new WebSocket('ws://192.168.9.35:9193/pushMsg')
      } else {
        console.log('当前浏览器不支持webSocket')
      }
      // 链接发生错误的回调方法
      this.webSocket.onerror = this.webSocketOnerror
      // 连接成功建立的回调函数
      this.webSocket.onopen = this.webSocketOpen
      // 接收到消息的回调方法
      this.webSocket.onmessage = this.webSocketOnMessage
      // 连接关闭的回调方法
      this.webSocket.onclose = this.webSocketOnClose
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛出异常
      // window.onbeforeunload = this.webSocketOnBefore
    },
    webSocketSendData (objDatas) { // webSocket请求类型 changed by SKID 20190402
      if (this.webSocketType === 'dataItem') { // 设备工况
        let ary = []
        let paramsString = ''
        for (let i in objDatas) {
          for (let j = 0; j < objDatas[i].length; j++) {
            ary.push(objDatas[i][j]['RMD_KEY'])
          }
        }
        paramsString = ary.join(',')
        this.webSocketData['type'] = 'dataItem,trbNum'
        this.webSocketData['tabId'] = ''
        this.webSocketData['equipId'] = this.rmdId
        this.webSocketData['oIds'] = paramsString
      } else if (this.webSocketType === 'canvas') { // ht画布
        let canvasParamsString = ''
        canvasParamsString = objDatas.join(',')
        this.webSocketData['type'] = 'canvas'
        this.webSocketData['tabId'] = this.tabID
        this.webSocketData['equipId'] = this.rmdId
        this.webSocketData['oIds'] = canvasParamsString
      }
    },
    webSocketSend () {
      // var arry = []
      // arry.push(this.webSocketData)
      this.webSocket.send(JSON.stringify(this.webSocketData)) // webSocket请求数据格式改变 changed by SKID 20190402
    },
    webSocketOpen () { // 连接成功建立的回调函数
      console.log('WebSocket连接成功')
      this.webSocketSend()
    },
    webSocketOnMessage (event) { // 接收到消息的回调方法    //类型区分  changed by SKID 20190402
      let self = this
      console.log('接收')
      let datas = JSON.parse(event.data)
      // 故障预警角标
      if (datas && datas.type && datas.type === 'trbNum') {
        if (datas.num > 99) {
          this.$refs.gzbj.innerHTML = '99+'
        } else {
          this.$refs.gzbj.innerHTML = datas.num
        }
        // 故障为0的时候不显示
        if (datas.num === 0) {
          this.$refs.gzbj.className = ''
        } else {
          this.$refs.gzbj.className = 'brage-num'
        }
      }
      for (let i in datas) {
        if (this.webSocketType === 'dataItem') { // 设备工况
          if (self.table2) {
            self.table1.forEach((res) => {
              if (res['RMD_KEY'] === i) {
                res['value'] = datas[i]
              }
            })
          }
          if (self.table2) {
            self.table2.forEach((res) => {
              if (res['RMD_KEY'] === i) {
                res['value'] = datas[i]
              }
            })
          }
          if (self.table3) {
            self.table3.forEach((res) => {
              if (res['RMD_KEY'] === i) {
                res['value'] = datas[i]
              }
            })
          }
          if (self.table4) {
            self.table4.forEach((res) => {
              if (res['RMD_KEY'] === i) {
                res['value'] = datas[i]
              }
            })
          }
        } else if (this.webSocketType === 'canvas') { // ht画布
          if (self.postData) {
            for (let item in self.postData) {
              if (item === i) {
                self.$set(self.postData, self.postData[item], datas[i])
                self.postData[item] = datas[i]
              }
            }
          }
        }
      }
    },
    webSocketOnClose () { // 连接关闭的回调方法
      this.webSocket.close()
      console.log('WebSocket连接关闭')
    },
    webSocketOnerror () { // 链接发生错误的回调方法
      console.log('WebSocket连接发生错误')
    },
    webSocketOnBefore () { // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛出异常
      this.closeWebSocket()
    },
    closeWebSocket () { // 关闭webSocket连接
      if (this.webSocket) {
        this.webSocket.close()
      }
    }
  },
  mounted: function () {
    // 获取故障等级
    this.initTrbLevel()
    // 初始化
    this.getTableData()

    this.defaultSize()
    // this.$router.afterEach(function () {
    //   this.closeWebSocket()
    // })
  },
  beforeDestroy () {
    this.closeWebSocket()
    this.$store.commit('removeKeepAliveRoute', 'equipment-list')
  }
}
</script>

<style lang="scss" scoped>
@import "assets/css/variable.scss";
.info {
  background: #E9EEF3;
  overflow: auto;
  /deep/ .el-table th, /deep/ .el-table tr{
    height:40px;
  }
  .el-header {
      background-color: #e4e7ed;
      color: #333;
      text-align: center;
      line-height: 30px;
      .el-breadcrumb {
          line-height: 30px;
      }
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

  .row-top {
      height: 300px;
  }
  .swiper-right {
      padding: 0 20px;
      text-align: center;
      .swiper-right-seach{
        line-height: 50px;
        .gray{
          color:gray;
        }
        .el-col{
          text-align: left;
        }
        .center{
          text-align: center;
        }
      }
      .attribute-list {
          display: flex;
          flex-wrap: wrap;
      }
      .el-pagination{
        background: #fff;
      }
  }

  .prop-desc-parent {
      padding: 10px 0;

      .prop-desc {
          background: lightgray;
      }
      .prop-desc-bottom {
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
      }
      .el-col-8 {
          text-align: center;
      }

      span {
          display: inline-block;
          line-height: 38px;
      }
  }

  .list-row {
      line-height: 40px;
      margin-right: 10px;
      width: 48%;

      label {
          width: 50%;
          display: inline-block;
          text-align: center;
          background: lightblue;
      }

      span {
          width: 50%;
          display: inline-block;
          text-align: center;
          background: lightgray;
      }
  }
  .brage-num{
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 20px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    position: absolute;
  }
  .cursor {
    cursor: $cursor;
  }
}
</style>
