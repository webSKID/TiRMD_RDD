import commonCons from 'assets/js/commonConstant'
import agent from '@/assets/js/agent'
// import eaf from '@/assets/js/eaf'

/**
 * @desc: 维修单列表表格数据接口（进行中/已关闭）
 * @param {}
 * @author:SKID
 */
export function getRepairList (_deviceNameVal, _deviceCodeVal, _repairContentVal, _dateValue, _tabType, _page, _row) {
  const params = new URLSearchParams()
  params.append('status', _tabType)
  params.append('deviceName', _deviceNameVal)
  params.append('deviceCode', _deviceCodeVal)
  params.append('detail', _repairContentVal)
  params.append('startTime', _tabType === 'doing' ? '' : _dateValue[0])
  params.append('endTime', _tabType === 'doing' ? '' : _dateValue[1])
  params.append('arg', JSON.stringify({
    page: _page,
    rows: _row
  }))
  return agent.askToServer('BFRepairOrder', 'getRepairOrderData', params)
}

/**
 * @desc: 创建、派发、关闭、填报接口
 * @param {}
 * @author:SKID
 */
export function sendRepairOrder (_arrTrouble, _troubleId, _arrFile) {
  let params = new URLSearchParams()
  params.append('arrRepairOrder', JSON.stringify(_arrTrouble))
  params.append('troubleId', _troubleId)
  params.append('arrFile', _arrFile)
  return agent.askMasterToServer('BFRepairOrder', 'sendRepairOrder', 'data', params)
}

/**
 * @desc: 删除维修单接口
 * @param {}
 * @author: SKID
 */
export function deleteRepairOrder (_eafId) {
  let params = new URLSearchParams()
  params.append('repairOrderId', _eafId)
  return agent.askMasterToServer('BFRepairOrder', 'deleteRepairOrder', 'data', params)
}

/**
 * @desc: 故障类型接口
 * @param {}
 * @author:SKID
 */
export function troubleType () {
  let params = new URLSearchParams()
  params.append('filterRules', '{}')
  params.append('clsid', commonCons.getConstant('majorId'))
  return agent.askToServer('RuleEngine', 'GetObjectsByClsByRule', params)
}

/**
 * @desc: tree树形结构数据接口
 * @param {}
 * @author:SKID
 */
export function getReporter (_parentType, _deviceDisEafId, _deviceEafId) {
  let params = new URLSearchParams()
  params.append('deviceEafId', _parentType === 'distribute' ? _deviceDisEafId : _deviceEafId)
  return agent.askMasterToServer('BFRepairOrder', 'getReporterData', 'data', params)
}
