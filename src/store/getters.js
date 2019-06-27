export const user = state => state.user

export const KeepAliveRoute = state => {
  return state.KeepAliveRoute
}
export const selectDeviceInput = state => { // 获取设备数据
  return state.analytical.dataAnalysis.selectDeviceInput
}

export const selectDeviceRmdId = state => { // 获取设备数据ID
  return state.analytical.dataAnalysis.selectDeviceRmdId
}
export const getDataItems = state => { // 获取数据项数据
  return state.analytical.dataAnalysis.dataItems
}
export const getDataItemsName = state => { // 获取数据项名称
  let params = state.analytical.dataAnalysis.dataItems
  let ary = []
  params.forEach(item => {
    ary.push(item.EAF_NAME)
  })
  return ary
}
export const getDataItemsCode = state => { // 获取数据项编码
  let params = state.analytical.dataAnalysis.dataItems
  let ary = []
  params.forEach(item => {
    ary.push(item.RMD_KEY)
  })
  return ary
}

export const getGapTimeStartEnd = state => { // 指示条点击时获取范围
  return state.analytical.dataAnalysis.gapTimeStartEnd
}

export const getGapTime = state => { // 获取指示条数据
  return state.analytical.dataAnalysis.gapTimeArr
}

export const getChartData = state => { // 获取图表数据
  return state.analytical.dataAnalysis.chartData
}

// 创建维修单选择设备
export const repairDeviceInput = state => { // 获取维修单设备input
  return state.repair.repairManage.repairDeviceInput
}
export const repairDeviceEafId = state => { // 获取维修单设备EAF_ID
  return state.repair.repairManage.repairDeviceEafId
}

// 检修人
export const getRepairPerson = state => {
  return state.repairPlan.repairPerson
}
