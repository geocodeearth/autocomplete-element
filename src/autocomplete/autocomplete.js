import React, { useState, useMemo, useCallback } from 'react'
import { useCombobox } from 'downshift'
import { createAutocomplete } from '@geocodeearth/core-js'
import debounce from 'lodash.debounce'
import styles from './autocomplete.module.css'
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
  debounce: debounceWait = 300,
  onSelect: userOnSelectItem,
  environment = window
}) => {
  const [results, setResults] = useState(emptyResults)
  const [searchTerm, setSearchTerm] = useState('')

  // Geocode Earth Autocomplete Client
  const autocomplete = useMemo(() => {
    return createAutocomplete(apiKey, params, options)
  }, [apiKey, params, options])

  // search queries the autocomplete API
  const search = useCallback(text => {
    if (!text) return

    autocomplete(text).then(({ features, discard }) => {
      if (discard) {
        return
      }

      setResults({ text, features })
    })
    .catch(console.error)
  }, [autocomplete])

  const debouncedSearch = useCallback(
    debounce(search, debounceWait, { trailing: true }),
    [search]
   )

  const onInputValueChange = ({ inputValue }) => {
    setSearchTerm(inputValue)
    if (inputValue === '') setResults(emptyResults)
    debouncedSearch(inputValue)
  }

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
    getItemProps
  } = useCombobox({
    environment,
    itemToString,
    items: results.features,
    onInputValueChange: onInputValueChange,
    onSelectedItemChange: onSelectItem
  })

  const showResults = isOpen && searchTerm === results.text && results.features.length > 0

  return (
    <div className={styles.autocomplete}>
      <label {...getLabelProps()} className={styles.label}>{placeholder}</label>

      <div {...getComboboxProps()} >
        <input {...getInputProps()} spellCheck={false} placeholder={placeholder} className={styles.input} />
      </div>

      <ol {...getMenuProps()} className={showResults ? styles.results : styles.resultsEmpty}>
        {showResults &&
          results.features.map((item, index) => (
            <li
              className={
                highlightedIndex === index
                  ? `${styles.resultItem} ${styles.resultItemActive}`
                  : styles.resultItem
              }
              key={item.properties.id}
              {...getItemProps({ item, index })}
            >
              <LocationMarker className={styles.resultItemIcon} />
              {itemToString(item)}
            </li>
          ))}

        <div className={styles.attribution}>
          ©&nbsp;<a href="https://geocode.earth">Geocode Earth</a>,&nbsp;
          <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>,&nbsp;and&nbsp;
          <a href="https://geocode.earth/guidelines">others</a>.
        </div>
      </ol>
    </div>
  )
}
