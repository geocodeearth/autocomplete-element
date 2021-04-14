// classnames are prefixed with this string to prevent conflicts with the surrounding site
const prefix = 'geocode-earth-autocomplete'

// className adds the prefix to a list of given class names
export const className = (...classNames) => classNames.length === 0 ? prefix : classNames.map(cn => `${prefix}-${cn}`).join(' ')

export const css = `
  .${prefix} {
    position: relative;
    font-family: sans-serif;
  }

  .${prefix} * {
    box-sizing: border-box;
  }

  .${prefix}-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .${prefix}-input {
    font-size: 16px;
    display: block;
    width: 100%;
    height: 45px;
    border: solid 1px rgba(255,255,255,.5);
    padding: 8px 12px;
    border-radius: 5px;
    appearance: none;
    -webkit-appearance: none;
    -moz-ppearance: none;
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 10px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
  }

  .${prefix}-results {
    font-size: 16px;
    position: absolute;
    top: calc(45px + 10px); ${/* height of input plus 10px spacing */''}
    left: 0;
    margin: 0;
    padding: 0 0 35px 0; ${/* padding bottom equal to attribution height */''}
    width: 100%;
    list-style: none;
    border: solid 1px rgba(255,255,255,.5);
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 10px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
  }

  .${prefix}-results-empty {
    display: none;
  }

  .${prefix}-result-item {
    padding: 12px;
    cursor: pointer;
  }

  .${prefix}-result-item-active {
    background-color: #eee;
  }

  .${prefix}-attribution {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 12px;
    height: 35px;
    color: #707f8e;
    line-height: 35px;
    font-size: 12px;
    text-align: right;
  }

  .${prefix}-attribution a {
    color: #707f8e;
    text-decoration: underline;
  }

  .${prefix}-attribution a:hover {
    color: #3273dc;
  }
`
