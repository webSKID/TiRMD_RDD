import commonCons from 'assets/js/commonConstant'
import agent from '@/assets/js/agent'
import eaf from '@/assets/js/eaf'

/**
 * @desc: 设备列表表格列头
 * @param {tyoe}
 * @return: 表的所有字段
 * @author: molong
 */
export function getEquimenKeys () {
  let params = new URLSearchParams()
  params.append('clsid', commonCons.getConstant('deviceClsId'))
  return agent.askToServer('UserInterface', 'GetAttrExByCls', params)
}

/**
 * @desc: 设备列表表格数据
 * @param {_page:当前页,_row:每页行数,_rule:查询条件规则}
 * @return:表格数据
 * @author:molong
 */
export function getEquimentList (_page, _row, _rule) {
  const params = new URLSearchParams()
  params.append('orderStr', 'EAF_MODIFYTIME desc')
  params.append('jsonArray', JSON.stringify(_rule) || '[]')
  params.append('arg', JSON.stringify({
    page: _page,
    rows: _row
  }))
  return agent.askToServer('BFEquipment', 'getDeviceData', params)
}

/**
 * @desc: 联想数据接口
 * @param {_tableName:查询的表名，_key:查询的键名}
 * @return:该键名对应的数据
 * @author:molong
 */
export function getAutoComplete (_tableName, _key) {
  let params = new URLSearchParams()
  params.append('tablename', _tableName)
  params.append('key', _key)
  return agent.askMasterToServer('BFCommon', 'getAssociateData', 'data', params)
}

/**
 * @desc: 设备列表客户下拉框
 * @param {type}
 * @return:客户数据
 * @author:molong
 */
export function getClient (_tablename) {
  let params = new URLSearchParams()
  params.append('tablename', _tablename)
  return agent.askMasterToServer('BFCommon', 'getComboData', 'data', params)
}

/**
 * @desc: 设备工况页面初始化接口
 * @param {_equipId:设备EAF_ID,_page:表格页码,_row:表格每页数据条数,_groupNum:表格动态列头数}
 * @return: equipData: 设备数据, imageData: 图片数据, paramObj:协议数据
 * @author:molong
 */
export function initEquipBasicData (_equipId, _page, _rows, _groupNum) {
  let params = new URLSearchParams()
  params.append('equipId', _equipId)
  params.append('page', _page)
  params.append('rows', _rows)
  params.append('groupNum', _groupNum)
  return agent.askMasterToServer('BFEquipment', 'getEquipBasicData', 'data', params)
}
/**
 * @desc: 设备工况页面表格查询
 * @param {_equipId:设备EAF_ID,_page:表格页码,_row:表格每页数据条数,_groupNum:表格动态列头数,_search:查询条件}
 * @return:表格数据
 * @author: molong
 */
export function getEquipFileTable (_equipId, _page, _rows, _groupNum, _search) {
  let params = new URLSearchParams()
  params.append('equipId', _equipId)
  params.append('page', _page)
  params.append('rows', _rows)
  params.append('groupNum', _groupNum)
  params.append('search', _search)
  return agent.askMasterToServer('BFEquipment', 'searchEquipParamData', 'data', params)
}
/**
 * @desc:表格获取波形图数据
 * @param {_equipId:设备EAF_ID,_keyId=>EAF_KEY}
 * @return:
 * @author:molong
 */
export function getCurve (_equipId, _keyId) {
  let params = new URLSearchParams()
  params.append('eafId', _equipId)
  params.append('itemId', _keyId)

  return agent.askMasterToServer('BFEquipment', 'getCurveById', 'data', params)
}
/**
 * @desc:故障报警页面初始化接口
 * @param {type}
 * @return:
 * @author:molong
 */
export function initFaultWarn (_eafId, _page, _row, _level, _troublestate, _dispatchstate, _startTime, _endTime) {
  const params = new URLSearchParams()
  params.append('instant', 'true')
  params.append('EAF_ID', _eafId)
  params.append(
    'arg',
    JSON.stringify({
      page: _page,
      rows: _row
    })
  )
  params.append('level', _level || '')
  params.append('troublestate', _troublestate || '')
  params.append('dispatchstate', _dispatchstate || '')
  params.append('startTime', _startTime || '')
  params.append('endTime', _endTime || '')

  return agent.askMasterToServer('BFCurrentTrouble', 'getCurrentTroubles', 'data', params)
}

/**
 * @desc: 故障等级公用方法
 * @param {_page:当前页,_row:每页行数,_rule:查询条件规则}
 * @return:故障等级分类数据
 * @author:molong
 */
// export function getFaultLevel () {
//   const params = new URLSearchParams()
//   params.append('tableName', 'RMD_TRBLEVEL')
//   params.append('orderStr', 'EAF_NAME')
//   params.append('jsonArray', '[]')
//   params.append('arg', JSON.stringify({
//     page: '',
//     rows: ''
//   }))
//   return agent.askToServer('BFCommon', 'getCommonQuery', params)
// }

/**
 * @desc: 故障等级公用方法
 * @param {_page:当前页,_row:每页行数,_rule:查询条件规则}
 * @return:故障等级分类数据
 * @author:molong
 */
export function getFaultLevel () {
  const params = new URLSearchParams()
  params.append('filterRules', JSON.stringify({
    orderString: 'decode(EAF_NAME,\'正常\',1),EAF_NAME desc'
  }))
  params.append('clsid', '1257595A809ABA5CD042A83D1573F1E1')
  return agent.askToServer('RuleEngine', 'GetObjectsByClsByRule', params)
}

/**
 * @desc: 客户列表表格数据
 * @param {_page:当前页,_row:每页行数,_rule:查询条件规则}
 * @author:SKID   changed   20190404
 */

export function getCustomerList (_page, _row, _rule) {
  const params = new URLSearchParams()
  params.append('tableName', 'RMD_DEPOT_V')
  params.append('orderStr', 'RMD_CITY ASC,EAF_CREATETIME_STR DESC')
  params.append('jsonArray', JSON.stringify(_rule) || '[]')
  params.append('arg', JSON.stringify({
    page: _page,
    rows: _row
  }))
  return agent.askToServer('BFCommon', 'getCommonQuery', params)
}

/**
 * @desc: 客户列表城市下拉框
 * @param {type}
 * @author:SKID   changed   20190404
 */
export function getRegion (_tablename, _key) {
  let params = new URLSearchParams()
  params.append('tablename', 'RMD_DEPOT')
  params.append('key', 'RMD_CITY')
  return agent.askMasterToServer('BFCommon', 'getComboData', 'data', params)
}

/**
 * @desc: 客户列表详情数据
 * @param {客户的eafId}
 * @author:SKID   changed   20190404
 */
export function getCustomerDetail (_eafId) {
  let url = eaf.getObjByIdToFrameUrl('ObjectService', 'GetObjectById', _eafId)
  let params = new URLSearchParams()
  params.append('clsid', commonCons.getConstant('depotClsId'))
  params.append('isReturnResource', '1')
  return agent.askToServerByUrl(url, params)
}
/**
 * @desc: 获取HT初始化数据
 * @param {_devId设备id,_keys键值}
 * @author:lxm  20190507
 */
export function getHtInitData (_devId, _keys) {
  const params = new URLSearchParams()
  let array = []
  let obj = {}
  obj.devId = _devId
  obj.keys = _keys
  array.push(obj)
  params.append('jsonstr', JSON.stringify(array))
  return agent.askMasterToServer('BFBigData', 'getRealTimeDataByItems', 'data', params)
}
/**
 * @desc: 检修计划初始化接口
 * @param {_page:当前页,_row:每页行数,_rule:查询条件规则,_rule.equimentId:设备id,_rule.orderPlan:修程,_rule.orederModel:工单}
 * @return: 所有检修的设备数据
 * @author: molong
 */
export function getRepairPlanDatas (_page, _row, _rule) {
  const params = new URLSearchParams()
  params.append('deviceEafId', _rule.equimentId || '')
  params.append('orderPlan', _rule.orderPlan || '')
  params.append('orederModel', _rule.orederModel || '')
  params.append(
    'arg',
    JSON.stringify({
      page: _page,
      rows: _row
    })
  )
  return agent.askToServer('BFCheckOrder', 'getCheckOrderData', params)
}

/**
 * @desc: 获取修程数据
 * @param {}
 * @author:molong
 */
export function repairProject () {
  let params = new URLSearchParams()
  params.append('filterRules', '{}')
  params.append('clsid', commonCons.getConstant('repairProjectClsId'))
  return agent.askToServer(
    'RuleEngine',
    'GetObjectsByClsByRule',
    params
  )
}

/**
 * @desc: 获取工单模板
 * @param {}
 * @author:molong
 */
export function workOrderTemplate () {
  let params = new URLSearchParams()
  let recordSearchRules = { 'groupOp': 'and', 'rules': [], 'groups': [] }
  recordSearchRules.rules.push({
    'field': 'RMD_ISMODEL',
    'attrType': '5',
    'op': 'eq',
    'data': 'Y',
    'isParameter': false
  })
  params.append('filterRules', JSON.stringify(recordSearchRules))
  params.append('clsid', commonCons.getConstant('workOrderClsId'))
  return agent.askToServer(
    'RuleEngine',
    'GetObjectsByClsByRule',
    params
  )
}
/**
 * @desc: 获取工单模板实例所有数据项
 * @param {type}
 * @return: 工单模板实例数据项
 * @author: molong
 */
export function getOrderTemplateItem (_modelId) {
  let params = new URLSearchParams()
  params.append('modelVId', _modelId)
  return agent.askMasterToServer(
    'BFCheckOrder',
    'getModelVItermData',
    'data',
    params
  )
}
/**
 * @desc: 工单模板联动数据项
 * @param {_devId:设备EAF_ID,_modelId:工单模板id}
 * @return:
 * @author: molong
 */
export function workOrderTemplateItems (_devId, _modelId) {
  let params = new URLSearchParams()
  params.append('deviceEafId', _devId)
  params.append('modelId', _modelId)
  return agent.askToServer('BFCheckOrder', 'getOrderModelData', params)
}

/**
 * @desc: 检修人树结构
 * @param {type}
 * @return:
 * @author: molong
 */
export function repairPerson (_id) {
  let params = new URLSearchParams()
  params.append('deviceEafId', _id)
  return agent.askMasterToServer('BFRepairOrder', 'getReporterData', 'data', params)
}

/**
 * @desc: 删除单条检修设备数据
 * @param {checkOrderId:检修工单计划id,modelVId:工单模板实例Id}
 * @return:
 * @author:molong
 */
export function deleteRepairPlanRow (_checkOrderId, _modelVId) {
  let params = new URLSearchParams()
  params.append('checkOrderId', _checkOrderId)
  params.append('modelVId', _modelVId)
  return agent.askMasterToServer('BFCheckOrder', 'deleteCheckOrder', 'data', params)
}
/**
 * @desc: 保存新建检修计划
 * @param {arrCheckPlan:检修工单计划对象,arrItemPart:检查项关联部件对象}
 * @return:
 * @author: molong
 */
export function saveRepairProject (object) {
  let params = new URLSearchParams()
  params.append('arrCheckPlan', JSON.stringify(object.arrCheckPlan))
  params.append('arrItemPart', JSON.stringify(object.arrItemPart))
  return agent.askMasterToServer('BFCheckOrder', 'saveCheckOrder', 'data', params)
}
