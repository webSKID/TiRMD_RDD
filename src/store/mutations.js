import * as types from './mutation-types'
export default {
  [types.setUser] (state, user) {
    state.user.token = user.EAF_ID
    state.user.name = user.loginname
    state.user.sysName = user.EAF_NAME
    state.user.sysId = user.EAF_ID
  },
  [types.removeUser] (state) {
    state.user.token = null
  },
  [types.setKeepAliveRoute] (state, newVal) {
    state.KeepAliveRoute.push(newVal)
  },
  [types.removeKeepAliveRoute] (state, newVal) {
    if (newVal) {
      let index = state.KeepAliveRoute.indexOf(newVal)
      if (index > -1) {
        state.KeepAliveRoute.splice(index, 1)
      }
    } else {
      state.KeepAliveRoute = []
    }
  },
  [types.changeCollapse] (state, newVal) {
    // 导航伸缩标识
    state.isCollapse = newVal
  },
  [types.selectDevice] (state, newVal) {
    // 更新所选设备
    state.analytical.dataAnalysis.selectDeviceInput = newVal
  },
  [types.selectDeviceRemove] (state) {
    // 移除所选设备
    state.analytical.dataAnalysis.selectDeviceInput = []
  },
  [types.setDeviceRmdId] (state, newVal) {
    // 更新设备RMD_ID
    state.analytical.dataAnalysis.selectDeviceRmdId = newVal
  },
  [types.removeDeviceRmdId] (state) {
    // 移除设备RMD_ID
    state.analytical.dataAnalysis.selectDeviceRmdId = ''
  },
  [types.saveDataItems] (state, newVal) {
    // 保存数据项
    state.analytical.dataAnalysis.dataItems = newVal
  },
  [types.removeDataItems] (state) {
    // 移除设备RMD_ID
    state.analytical.dataAnalysis.dataItems = []
  },
  [types.setGapTimeStartEnd] (state, newVal) {
    // 保存指示条点击时的数据
    state.analytical.dataAnalysis.gapTimeStartEnd = newVal
  },
  [types.removeGapTimeStartEnd] (state) {
    // 移除指示条点击存储的数据
    state.analytical.dataAnalysis.gapTimeStartEnd = []
  },
  [types.setGapTime] (state, newVal) {
    // 保存指示条数据
    state.analytical.dataAnalysis.gapTimeArr = newVal
  },
  [types.removeGapTime] (state) {
    // 移除指示条数据
    state.analytical.dataAnalysis.gapTimeArr = []
  },
  [types.setChartData] (state, newVal) {
    // 保存图表数据
    state.analytical.dataAnalysis.chartData = newVal
  },
  [types.removeChartData] (state) {
    // 移除图表数据
    state.analytical.dataAnalysis.chartData = []
  },
  // 创建维修单选择设备
  [types.repairDeviceInput] (state, newVal) {
    // 更新维修单所选设备input
    state.repair.repairManage.repairDeviceInput = newVal
  },
  [types.repairDeviceEafId] (state, newVal) {
    // 更新维修单设备EAF_ID
    state.repair.repairManage.repairDeviceEafId = newVal
  },
  [types.repairDeviceAllRemove] (state) {
    // 移除维修单设备所有
    state.repair.repairManage.repairDeviceInput = ''
    state.repair.repairManage.repairDeviceEafId = ''
  },
  [types.setRepairPerson] (state, newVal) {
    // 设置检修人
    state.repairPlan.repairPerson = newVal
  },
  [types.removeRepairPerson] (state) {
    // 删除检修人
    state.repairPlan.repairPerson = null
  }
}
