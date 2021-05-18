import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useCombobox } from 'downshift'
import { createAutocomplete } from '@geocodeearth/core-js'
import debounce from 'lodash.debounce'
import css from './autocomplete.css'
import strings from '../strings'
import { LocationMarker } from '../icons'

const emptyResults = {
  text: '',
  features: []
}

export default ({
  apiKey,
  params,
  options,
  placeholder = strings.inputPlaceholder,
  autoFocus = false,
  debounce: debounceWait = 300,
  onSelect: userOnSelectItem,
  onChange: userOnChange,
  onError = () => {},
  environment = window
}) => {
  const [results, setResults] = useState(emptyResults)
  const inputRef = useRef()

  // Geocode Earth Autocomplete Client
  const autocomplete = useMemo(() => {
    return createAutocomplete(apiKey, params, options)
  }, [apiKey, params, options])

  // search queries the autocomplete API
  const search = useCallback(text => {
    if (!text) return

    autocomplete(text).then(({ features, discard }) => {
      if (discard || inputRef.current.value !== text) {
        return
      }

      setResults({ text, features })
    })
    .catch(onError)
  }, [autocomplete])

  const debouncedSearch = useCallback(
    debounce(search, debounceWait, { trailing: true }),
    [search]
   )

  const onInputValueChange = ({ type, inputValue }) => {
    const term = inputValue.trim()
    if (term === '') {
      setResults(emptyResults)
    }

    // call user-supplied onChange callback
    if (typeof userOnChange === 'function') {
      userOnChange(term)
    }

    // only search if the input value actually changed and not if an item was selected,
    // which also fires this callback. this prevents an additional request after the user has already
    // selected an item.
    if (type === useCombobox.stateChangeTypes.InputChange && term.length > 0) {
      debouncedSearch(term)
    }
  }

  // called user-supplied callback when an item is selected
  const onSelectItem = ({ selectedItem }) => {
    if (typeof userOnSelectItem === 'function') {
      userOnSelectItem(selectedItem)
    }
  }

  // turns an autocomplete result (feature) into a string
  const itemToString = ({ properties: { label } }) => label

  // focus the input field if requested
  useEffect(() => {
    if (autoFocus === true) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  // downshift combobox
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    environment,
    itemToString,
    items: results.features,
    onInputValueChange: onInputValueChange,
    onSelectedItemChange: onSelectItem
  })

  const showResults = isOpen && results.features.length > 0

  return <>
    <style>{css}</style>
    <div className='autocomplete'>
      <label {...getLabelProps()} className='label'>{placeholder}</label>

      <div {...getComboboxProps()} >
        <input {...getInputProps({ref: inputRef})} spellCheck={false} placeholder={placeholder} className='input' />
      </div>

      <ol {...getMenuProps()} className={showResults ? 'results' : 'results-empty'}>
        {showResults &&
          results.features.map((item, index) => (
            <li
              className={
                highlightedIndex === index
                  ? 'result-item result-item-active'
                  : 'result-item'
              }
              key={item.properties.id}
              {...getItemProps({ item, index })}
            >
              <LocationMarker className='result-item-icon' />
              {itemToString(item)}
            </li>
          ))}

        <div className='attribution'>
          ©&nbsp;<a href="https://geocode.earth">Geocode Earth</a>,&nbsp;
          <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>,&nbsp;and&nbsp;
          <a href="https://geocode.earth/guidelines">others</a>.
        </div>
      </ol>
    </div>
  </>
}
