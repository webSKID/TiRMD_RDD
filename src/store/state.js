import { getItem } from '@/util/auth.js'

const state = {
  user: {
    // 登录信息
    name: getItem('RDD-USER'),
    token: getItem('RDD-token'),
    sysName: '',
    sysId: ''
  },
  KeepAliveRoute: ['equipment-list'],
  isCollapse: false, // 导航伸展
  analytical: {
    // 分析应用
    dataAnalysis: {
      // 数据分析
      selectDeviceInput: [], // 选择设备
      selectDeviceRmdId: '', // 设备RMD_ID
      dataItems: [], // 数据项
      gapTimeStartEnd: [], // 指示条点击时获取范围
      gapTimeArr: [], // 数据范围之时条
      chartData: [] // 图表数据
    }
  },
  repair: {// 维修单
    repairManage: {// 维修单管理
      repairDeviceInput: '', // 设备input反显数据
      repairDeviceEafId: '' // 设备EAF_ID
    }
  },
  repairPlan: { // 检修计划
    repairPerson: null
  }
}
export default state
