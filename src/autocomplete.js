import React, { useState, useRef } from 'react'
import { useCombobox } from 'downshift'
import { createAutocomplete } from 'geocode-earth-core'
import debounce from 'lodash.debounce'
import styles from './styles'
import strings from './strings'

export default ({apiKey, options}) => {
  const [results, setResults] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  // Geocode Earth Autocomplete Client
  const autocomplete = useRef(createAutocomplete(apiKey, options)).current

  // search queries the autocomplete API
  const search = ({ inputValue }) => {
    if (inputValue === '') {
      setSelectedItem(null)
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

  // called when an item is selected
  const onSelectItem = ({ selectedItem }) => setSelectedItem(selectedItem)

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
      </ol>

      {/* temporarily show selected item, this will be moved out of this component */}
      { selectedItem &&
        <pre style={styles.selectedResult}>
          {JSON.stringify(selectedItem, undefined, 4)}
        </pre>
      }
    </div>
  )
}
