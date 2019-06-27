function Session (key, value) {

}
Session.prototype = {
  constructor: Session,
  setItem: function (key, value) {
    sessionStorage.setItem(key, value)
  },
  getItem: function (key) {
    return sessionStorage.getItem(key)
  },
  removeItem: function (key) {
    sessionStorage.removeItem(key)
  },
  clear: function () {
    sessionStorage.clear()
  }
}
let storage = new Session()
export default storage
