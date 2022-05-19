import React, { useState, useCallback, useRef, useEffect } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useCombobox } from 'downshift'
import { createAutocomplete } from '@geocodeearth/core-js'
import throttle from 'lodash.throttle'
import css from './autocomplete.css'
import strings from '../strings'
import { LocationMarker, Loading, Search as SearchIcon } from '../icons'
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
  throttle: throttleWait = 200,
  onSelect: userOnSelectItem,
  onChange: userOnChange,
  onFeatures: userOnFeatures,
  onError: userOnError,
  environment = window,
  rowTemplate,
  stringTemplate
}) => {
  const [results, setResults] = useState(emptyResults)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef()
  const autocomplete = useRef()

  // call user-supplied onFeatures callback
  useEffect(() => {
    if (typeof userOnFeatures === 'function') {
      userOnFeatures(results.features)
    }
  }, [results])

  // deep compare is used to to only instantiate a new autocomplete API client if
  // required properties for it change
  useDeepCompareEffect(() => {
    try {
      autocomplete.current = createAutocomplete(apiKey, params, {
        ...options,
        client: `ge-autocomplete${typeof VERSION !== 'undefined' ? `-${VERSION}` : ''}`
      })
    } catch (err) {
      onError(err)
    }
  }, [apiKey, params, options])

  // search queries the autocomplete API
  const search = useCallback(text => {
    autocomplete.current(text).then(({ features, discard }) => {
      setIsLoading(false)

      if (discard || inputRef.current.value !== text) {
        return
      }

      setResults({ text, features })
      openMenu()
    })
    .catch(onError)
  }, [autocomplete])

  const throttledSearch = useCallback(
    throttle(search, throttleWait, { leading: true, trailing: true }),
    [search]
   )

  const onInputValueChange = ({ type, inputValue }) => {
    const term = inputValue

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
      throttledSearch(term)
    }
  }

  // called user-supplied callback when an item is selected
  const onSelectItem = ({ selectedItem }) => {
    setResults(emptyResults)

    if (typeof userOnSelectItem === 'function') {
      userOnSelectItem(selectedItem)
    }
  }

  // call user-supplied error callback
  const onError = (error) => {
    setIsLoading(false) // hide loading indicator as this normally happens after a successful request
    if (typeof userOnError === 'function') {
      userOnError(error)
    } else {
      console.error(error)
    }
  }

  // turns an autocomplete result (feature) into a string
  const itemToString = (feature, extra) => {
    if (typeof stringTemplate === 'function') {
      return stringTemplate({feature, ...extra})
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
        <SearchIcon className='search-icon' />
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
                dangerouslySetInnerHTML={{
                  __html: rowTemplate({
                    feature: escape(item),
                    active: highlightedIndex === index,
                    searchTerm: inputRef.current.value,
                    index
                  })}}
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
                {itemToString(item, {
                  active: highlightedIndex === index,
                  searchTerm: inputRef.current.value,
                  index
                })}
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
