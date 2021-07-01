import _escape from 'lodash.escape'

// escape takes any value (primarily objects) and recursively escapes the values
const escape = (v) => {
  if (typeof v === 'string') return _escape(v)
  if (typeof v === 'number' || typeof v === 'boolean') return v
  if (Array.isArray(v)) return v.map(l => escape(l))

  return Object.keys(v).reduce(
    (attrs, key) => ({
      ...attrs,
      [key]: escape(v[key]),
    }),
    {}
  )
}

export default escape
