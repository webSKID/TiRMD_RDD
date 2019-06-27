function Ajax () {

}
Ajax.prototype = {
  // 获取批量类对象(不分页)URL,可以用post方式传递rules规则（url）
  getObjsByClsRuleUrl: function (clsid, rule, arg) {
    let rurl = eaf.getObjsToFrameUrl('RuleEngine', 'GetObjectsByClsByRule') + '&clsid=' + clsid + '&filterRules=' + encodeURIComponent(rule)
    if (arg) {
      rurl = rurl + '&arg=' + encodeURIComponent(arg)
    }
    return rurl
  },
  // 获取批量对象URL（根据框架和命令）
  getObjsToFrameUrl: function (taskFramePN, command) {
    return '/txieasyui?taskFramePN=' + taskFramePN + '&command=' + command + '&colname=json&refresh=' + JSON.parse(Math.random()) + '&colname1={\'dataform\':\'eui_datagrid_data\',\'tablename\':\'detail0\'}'
  },
  // 获取单个对象URL（根据框架和命令）
  getObjByIdToFrameUrl: function (taskFramePN, command, objid) {
    var objidstr = ''
    if (objid) objidstr = '&objid=' + objid
    return '/txieasyui?taskFramePN=' + taskFramePN + '&command=' + command + objidstr + '&colname=json&colname1={\'dataform\':\'eui_form_data\'}' + '&refresh=' + JSON.parse(Math.random())
  },
  // 获取批量类对象(不分页)URL,可以指定某个属性过滤（url）
  getObjsByClsAttrUrl: function (clsid, pname, pvalue) {
    return eaf.getObjsToFrameUrl('ObjectService', 'GetObjectsByClsPid') + '&clsid=' + clsid + '&pname=' + pname + '&pvalue=' + encodeURI(pvalue) + '&isReturnResource=1'
  },
  // 保存单个类对象（根据框架和命令）
  saveObjByIdToFrameUrl: function (taskFramePN, command, objid) {
    return '/txieasyui?taskFramePN=' + taskFramePN + '&command=' + command +
      '&objid=' + objid +
      '&colname=json&colname1={\'dataform\':\'eui_form_data\'}'
  },
  getFrameUrl: function (taskFramePN, command, variableName) {
    return '/txieasyui?taskFramePN=' + taskFramePN + '&command=' + command + '&colname=json_ajax&colname1={\'dataform\':\'eui_variable_data\',\'variable\':\'' + variableName + '\'}'
  },
  jsonToStr: function (json) {
    if (!json) {
      return json
    }
    return JSON.stringify(eaf.escapejson(json))
  }
}
let eaf = new Ajax()

export default eaf
