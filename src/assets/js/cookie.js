export function setCookie (name, value, day) {
  const d = new Date()
  d.setTime(d.getTime() + (day * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = name + '=' + value + ';' + expires
}
export function getCookie (name) {
  const arg = name + '='
  const alen = arg.length
  const clen = document.cookie.length
  var i = 0
  while (i < clen) {
    var j = i + alen
    if (document.cookie.substring(i, j) === arg) {
      return getCookieVal(name, j)
    }
    i = document.cookie.indexOf('', i) + 1
    if (i === 0) {
      break
    }
  }
  return null
}
export function deleteCookie (name) {
  const expdate = new Date()
  expdate.setTime(expdate.getTime() - (86400 * 1000 * 1))
  setCookie(name, '', expdate)
}

function getCookieVal (name, offset) {
  var endstr = document.cookie.indexOf(';', offset)
  if (endstr === -1) {
    endstr = document.cookie.length
  }
  return decodeURI(document.cookie.substring(offset, endstr))
}
