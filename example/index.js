import React from 'react'
import { render } from 'react-dom'
import Autocomplete from '../src/autocomplete'

const SelectedResult = ({ result }) => <pre style={{ marginTop: '50px', color: '#fff', boxSizing: 'border-box'}}>
  {result && JSON.stringify(result, undefined, 4)}
</pre>

const onSelect = (result) => {
  console.debug(result)
  render(<SelectedResult result={result} />, document.getElementById('result'))
}

render(
  <Autocomplete
    apiKey={'ge-2550bcc43e8dd92e'}
    onSelect={onSelect}
  />,
  document.getElementById('autocomplete')
)
