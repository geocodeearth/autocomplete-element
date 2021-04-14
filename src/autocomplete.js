import React, { useState, useRef } from 'react'
import { useCombobox } from 'downshift'
import { createAutocomplete } from 'geocode-earth-core'
import debounce from 'lodash.debounce'
import {css, className as cn} from './styles'
import strings from './strings'
import { LocationMarker } from './icons'

export default ({apiKey, options, onSelect: userOnSelectItem}) => {
  const [results, setResults] = useState([])

  // Geocode Earth Autocomplete Client
  const autocomplete = useRef(createAutocomplete(apiKey, options)).current

  // search queries the autocomplete API
  const search = ({ inputValue }) => {
    if (inputValue === '') {
      setResults([])
    } else {
      autocomplete(inputValue).then(({ features, discard }) => {
        if (discard) {
          return
        }

        setResults(features)
      })
    }
  }

  // debounced search function as the user types
  const onInputValueChange = useRef(debounce(search, 300)).current

  // called user-supplied callback when an item is selected
  const onSelectItem = ({ selectedItem }) => {
    if (typeof userOnSelectItem === 'function') {
      userOnSelectItem(selectedItem)
    }
  }

  // turns an autocomplete result (feature) into a string
  const itemToString = ({ properties: { label } }) => label

  // downshift combobox
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    itemToString,
    items: results,
    onInputValueChange: onInputValueChange,
    onSelectedItemChange: onSelectItem
  })

  return (
    <>
      <style>{css}</style>

      <div className={cn()}>
        <label {...getLabelProps()} className={cn('label')}>{strings.inputPlaceholder}</label>

        <div {...getComboboxProps()} >
          <input {...getInputProps()} spellCheck={false} placeholder={strings.inputPlaceholder} className={cn('input')} />
        </div>

        <ol {...getMenuProps()} className={(isOpen && results.length > 0) ? cn('results') : cn('results-empty')}>
          {isOpen &&
            results.map((item, index) => (
              <li
                className={
                  highlightedIndex === index
                    ? cn('result-item', 'result-item-active')
                    : cn('result-item')}
                key={item.properties.id}
                {...getItemProps({ item, index })}
              >
                <LocationMarker className={cn('result-item-icon')} />
                {itemToString(item)}
              </li>
            ))}

          <div className={cn('attribution')}>
            ©&nbsp;<a href="https://geocode.earth">Geocode Earth</a>,&nbsp;
            <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>,&nbsp;and&nbsp;
            <a href="https://geocode.earth/guidelines">others</a>.
          </div>
        </ol>
      </div>
    </>
  )
}
