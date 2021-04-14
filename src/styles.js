// the outer most wrapper of the whole component
const box = {
  position: 'relative',
  fontFamily: 'sans-serif',
  boxSizing: 'border-box'
}

// screen-reader only label
const label = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  boxSizing: 'border-box'
}

// wrapper for the input field (combobox)
const inputBox = {
  display: 'block',
  boxSizing: 'border-box'
}

// actual <input>
const input = {
  display: 'block',
  width: '100%',
  height: '45px',
  border: 'solid 1px rgba(255,255,255,.5)',
  padding: '8px 12px',
  borderRadius: '5px',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  outline: 'none',
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 10px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px',
  boxSizing: 'border-box'
}

// attribution links below results, defined here above results so the results
// can use its height
const attribution = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  boxSizing: 'border-box',
  padding: '0 12px',
  height: '35px',
  color: '#707f8e',
  lineHeight: '35px',
  fontSize: '12px',
  textAlign: 'right'
}

const attributionLink = {
  color: attribution.color,
  textDecoration: 'underline',
  boxSizing: 'border-box'
}

// list of results (ol)
const results = {
  position: 'absolute',
  top: `calc(${input.height} + 10px)`,
  left: 0,
  margin: 0,
  padding: `0 0 ${attribution.height} 0`,
  width: '100%',
  listStyle: 'none',
  border: input.border,
  borderRadius: '5px',
  backgroundColor: '#fff',
  overflow: 'hidden',
  boxShadow: input.boxShadow,
  boxSizing: 'border-box'
}

// an individual result item (<li>)
const resultItem = {
  padding: '12px',
  cursor: 'pointer',
  boxSizing: 'border-box'
}

// hover and active state when navigating with arrow keys
const resultItemActive = {
  backgroundColor: '#eee',
  boxSizing: 'border-box'
}

// temporary display for the selected result
const selectedResult = {
  marginTop: '50px',
  color: '#fff',
  boxSizing: 'border-box'
}

export default {
  box,
  inputBox,
  label,
  input,
  results,
  resultItem,
  resultItemActive,
  selectedResult,
  attribution,
  attributionLink
}
