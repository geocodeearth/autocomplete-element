import React, { useState, useRef } from 'react'
import { useCombobox } from 'downshift'
import { createAutocomplete } from 'geocode-earth-core'
import debounce from 'lodash.debounce'
import styles from './styles'
import strings from './strings'

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
    <div style={styles.box}>
      <label {...getLabelProps()} style={styles.label}>{strings.inputPlaceholder}</label>
      <div style={styles.inputBox} {...getComboboxProps()}>
        <input {...getInputProps()} spellCheck={false} style={styles.input} placeholder={strings.inputPlaceholder} />
      </div>
      <ol {...getMenuProps()} style={isOpen && results.length > 0 ? styles.results : { ...styles.results, display: 'none' }}>
        {isOpen &&
          results.map((item, index) => (
            <li
              style={
                highlightedIndex === index
                  ? { ...styles.resultItem, ...styles.resultItemActive }
                  : styles.resultItem}
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {itemToString(item)}
            </li>
          ))}
        <div style={styles.attribution}>
          ©&nbsp;<a style={styles.attributionLink} href="https://geocode.earth">Geocode Earth</a>,&nbsp;<a style={styles.attributionLink} href="https://openstreetmap.org/copyright">OpenStreetMap</a>,&nbsp;and&nbsp;<a style={styles.attributionLink} href="https://geocode.earth/guidelines">others</a>.
        </div>
      </ol>
    </div>
  )
}
