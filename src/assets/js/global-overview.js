// 全局概览相关页面接口
import agent from '@/assets/js/agent'

// 地图初始化接口
export function mapDataInit () {
  return agent.askMasterToServer('BFEquipmentMap', 'getAllDepot', 'data')
}

// 请求车辆段数据接口
export function getDepotData (id) {
  const params = new URLSearchParams()
  params.append('DepotId', id)
  return agent.askMasterToServer('BFEquipmentMap', 'getDeviceInformationByDepotId', 'data', params)
}
