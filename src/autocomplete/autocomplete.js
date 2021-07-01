import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useCombobox } from 'downshift'
import { createAutocomplete } from '@geocodeearth/core-js'
import debounce from 'lodash.debounce'
import css from './autocomplete.css'
import strings from '../strings'
import { LocationMarker, Loading } from '../icons'
import escape from '../escape'

const emptyResults = {
  text: '',
  features: []
}

export default ({
  apiKey,
  params,
  options,
  placeholder = strings.inputPlaceholder,
  value = '',
  autoFocus = false,
  debounce: debounceWait = 200,
  onSelect: userOnSelectItem,
  onChange: userOnChange,
  onError: userOnError,
  environment = window,
  rowTemplate,
  stringTemplate
}) => {
  const [results, setResults] = useState(emptyResults)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef()

  // setting params & options as state so they can be passed to useMemo as dependencies,
  // which doesn’t work if they’re just objects as the internal comparison fails
  const [apiParams, setApiParams] = useState(params)
  const [apiOptions, setApiOptions] = useState(options)

  // Geocode Earth Autocomplete Client
  const autocomplete = useMemo(() => {
    return createAutocomplete(apiKey, params, {
      ...options,
      client: `ge-autocomplete${typeof VERSION !== 'undefined' ? `-${VERSION}` : ''}`
    })
  }, [apiKey, apiParams, apiOptions])

  // search queries the autocomplete API
  const search = useCallback(text => {
    autocomplete(text).then(({ features, discard }) => {
      if (discard || inputRef.current.value !== text) {
        return
      }

      setIsLoading(false)
      setResults({ text, features })
      openMenu()
    })
    .catch(onError)
  }, [autocomplete])

  const debouncedSearch = useCallback(
    debounce(search, debounceWait, { trailing: true }),
    [search]
   )

  const onInputValueChange = ({ type, inputValue }) => {
    const term = inputValue.trim()

    // call user-supplied onChange callback
    if (typeof userOnChange === 'function') {
      userOnChange(term)
    }

    if (term === '') {
      setIsLoading(false)
      setResults(emptyResults)
      return
    }

    // only search if the input value actually changed and not if an item was selected,
    // which also fires this callback. this prevents an additional request after the user has already
    // selected an item.
    const searchOn = [
      useCombobox.stateChangeTypes.InputChange,
      useCombobox.stateChangeTypes.FunctionSetInputValue
    ]

    if (searchOn.includes(type)) {
      setIsLoading(true)
      debouncedSearch(term)
    }
  }

  // called user-supplied callback when an item is selected
  const onSelectItem = ({ selectedItem }) => {
    if (typeof userOnSelectItem === 'function') {
      userOnSelectItem(selectedItem)
    }
  }

  // call user-supplied error callback
  const onError = (error) => {
    setIsLoading(false) // hide loading indicator as this normally happens after a successful request
    if (typeof userOnError === 'function') {
      userOnError(error)
    }
  }

  // turns an autocomplete result (feature) into a string
  const itemToString = (feature) => {
    if (typeof stringTemplate === 'function') {
      return stringTemplate(escape(feature))
    }

    return feature.properties.label
  }

  // focus the input field if requested
  useEffect(() => {
    if (autoFocus === true) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  // if an initial value is provided trigger a search with that, which allows
  // programmatically setting the value attribute, for example for a typewriter effect
  useEffect(() => setInputValue(value), [value])

  // downshift combobox
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
    openMenu
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
        {isLoading && <Loading className={'loading'} />}
      </div>

      <ol {...getMenuProps()} className={showResults ? 'results' : 'results-empty'}>
        {showResults &&
          results.features.map((item, index) => {
            // render row with custom template, if available
            // the feature itself is recursively escaped as we can’t guarantee safe data from the API
            if (typeof rowTemplate === 'function') {
              return <li
                key={item.properties.id}
                {...getItemProps({ item, index })}
                dangerouslySetInnerHTML={{ __html: rowTemplate(escape({
                  ...item,
                  active: highlightedIndex === index
                })) }}
              />
            } else {
              return <li
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
            }
          })}

        <div className='attribution'>
          ©&nbsp;<a href="https://geocode.earth">Geocode Earth</a>,&nbsp;
          <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>,&nbsp;and&nbsp;
          <a href="https://geocode.earth/guidelines">others</a>.
        </div>
      </ol>
    </div>
  </>
}
