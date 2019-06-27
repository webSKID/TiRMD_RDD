import eaf from 'assets/js/eaf'
import commonCons from 'assets/js/commonConstant'
import agent from '@/assets/js/agent'

const navClsId = commonCons.getConstant('navClsId')
const fid = commonCons.getConstant('menuP')

/**
 * 登录接口
 * @param userName
 * @param passWord
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getLogin (userName, passWord) {
  const url = eaf.getObjByIdToFrameUrl('AccessCtrl', 'Login', null)
  let params = new URLSearchParams()
  params.append('loginname', userName)
  params.append('loginpass', passWord)
  params.append('captcha', '_search || ""')

  return agent.askToServerByUrl(url, params)
}

/**
 * 退出登录
 * @returns {Promise<AxiosResponse<any>>}
 */
export function logOut () {
  const url = eaf.getObjByIdToFrameUrl('AccessCtrl', 'Logout', null)
  return agent.askToServerByUrl(url)
}

/**
 * @desc:首页导航数据获取
 * @param:无
 * @return:无
 * @author: molong
 */
export function getMenu () {
  const url = eaf.getObjsByClsAttrUrl(navClsId, 'EAF_FID', fid)
  return agent.askToServerByUrl(url)
}
/**
 * @desc:获取个人信息数据
 * @param:无
 * @return:无
 * @author: lxm
 */
export function getPersonalInfo (_eafId) {
  const url = eaf.getObjByIdToFrameUrl('ObjectService', 'GetObjectById')
  let params = new URLSearchParams()
  params.append('clsid', commonCons.getConstant('userClsId'))
  params.append('objid', _eafId)
  return agent.askToServerByUrl(url, params)
}
/**
 * @desc:个人信息保存功能
 * @param:无
 * @return:无
 * @author: lxm
 */
export function savePersonal (_uoid, _psd, _data) {
  const url = eaf.saveObjByIdToFrameUrl('AccessCtrl', 'UpdatePerson')
  let params = new URLSearchParams()
  params.append('uoid', _uoid)
  params.append('oldps', _psd)
  params.append('uobj', _data)
  return agent.askToServerByUrl(url, params)
}
