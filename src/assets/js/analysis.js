import agent from '@/assets/js/agent'

/**
 * @desc: 获取设备
 * @param {type}
 * @return:根据权限获取的所有设备数据
 * @author:molong
 */
export function getDevice (_page, _rows, _type, _search) {
  const params = new URLSearchParams()
  params.append('type', _type || '')
  params.append('search', _search || '')
  params.append(
    'arg',
    JSON.stringify({
      page: _page,
      rows: _rows
    })
  )
  return agent.askToServer('BFEquipment', 'searchEquipsByParam', params)
}
