import React, { useState, useMemo, useCallback } from 'react'
import { useCombobox } from 'downshift'
import { createAutocomplete } from 'geocode-earth-core'
import debounce from 'lodash.debounce'
import styles from './autocomplete.module.css'
import strings from './strings'
import { LocationMarker } from './icons'

export default ({apiKey, options, onSelect: userOnSelectItem, environment = window}) => {
  const [results, setResults] = useState([])

  // Geocode Earth Autocomplete Client
  const autocomplete = useMemo(() => {
    return createAutocomplete(apiKey, options)
  }, [apiKey, options])

  // search queries the autocomplete API
  const search = useCallback(({ inputValue }) => {
    if (inputValue === '') {
      setResults([])
    } else {
      autocomplete(inputValue).then(({ features, discard }) => {
        if (discard) {
          return
        }

        setResults(features)
      })
      .catch(console.error)
    }
  }, [autocomplete])

  // debounced search function
  const onInputValueChange = useCallback(
    debounce(search, 300, { trailing: true }),
    [search]
  )

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
    environment,
    itemToString,
    items: results,
    onInputValueChange: onInputValueChange,
    onSelectedItemChange: onSelectItem
  })

  return (
    <div className={styles.autocomplete}>
      <label {...getLabelProps()} className={styles.label}>{strings.inputPlaceholder}</label>

      <div {...getComboboxProps()} >
        <input {...getInputProps()} spellCheck={false} placeholder={strings.inputPlaceholder} className={styles.input} />
      </div>

      <ol {...getMenuProps()} className={(isOpen && results.length > 0) ? styles.results : styles.resultsEmpty}>
        {isOpen &&
          results.map((item, index) => (
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
