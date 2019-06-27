import Cookies from 'js-cookie'

export function getItem (key) {
  return Cookies.get(key)
}

export function setItem (key, value) {
  return Cookies.set(key, value, { expires: 7, path: '' })
}

export function removeItem (key) {
  return Cookies.remove(key)
}
