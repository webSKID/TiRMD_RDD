function Constant () {
  this.constants = {
    // 用户id
    user: '00000000000000000000000000000000',
    // 用户类id
    userClsId: '97293E35DA6F2BCDF57399C08C01F3F7',
    // 获取菜单时父id
    menuParent: '5FCDAF02E7B6F7B992B77BB5121B99DB',
    // 设备诊断
    menuP: '5FCDAF02E7B6F7B992B77BB5121B99DB',
    // 导航类id
    navClsId: 'C1925BF68B463A6BEAB718A501BEF6CD',
    // 设备类
    deviceClsId: '1FB1E3B4BD5283B06886F68EC56D82D2',
    // 车辆段类
    depotClsId: 'E488B2D2F689E404015E65943A3BC23D',
    // 故障字典id
    troubleDicId: '8763A04CECE3C84741FB26C06BA1183D',
    // 专业id
    majorId: '982C020379875EBB1A62BE74CAAE58A3',
    // 维修单与文件的关联id
    repairRelationId: '33E4165235FEE7A45E35F52B799524AB',
    // 基本修程类
    repairProjectClsId: '03F9A9ECAA50BFBBED440F9BFC11568B',
    // 工单模板类
    workOrderClsId: '2EECC3172A67A7735276A6278A5EF28F',
    // 检查项类
    checkItemClsId: 'E77CF934137BDAAA87BA3185CB288AB3'
  }
};
Constant.prototype = {
  getConstant: function (name) {
    return this.constants[name]
  }
}
let con = new Constant()
export default con
