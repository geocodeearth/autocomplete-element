// removes falsy and empty object values from objects
export default (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => {
    if (v === 0) return true
    if (v && v.constructor === Object && Object.keys(v).length === 0) return false
    return !!v
  }))
}
