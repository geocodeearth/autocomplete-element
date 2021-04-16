import React from 'react'
import { render } from 'react-dom'
import Autocomplete from '../src/autocomplete'

const onSelect = (result) => {
  console.debug(result)
  render(
    JSON.stringify(result, undefined, 4),
    document.getElementById('result')
  )
}

render(
  <Autocomplete
    apiKey={'ge-2550bcc43e8dd92e'}
    onSelect={onSelect}
  />,
  document.getElementById('autocomplete')
)
