import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import Autocomplete from './autocomplete'
import compact from './compact'
import _template from 'lodash.template'
import _unescape from 'lodash.unescape'

const customElementName = 'ge-autocomplete'

// WebComponent is a wrapper component for <Autocomplete>.
// It has three major tasks, specifically it
//
// 1. dispatches custom events on the host
// 2. create an `environment` for Downshift to add event listeners to
const WebComponent = ({ host, ...autocompleteProps }) => {
  // for Downshift to register events properly when being rendered in a Shadow DOM
  // (as we do here), we need to give it an `environment`. as a performance improvement
  // we also force the listeners to be passive
  //
  // https://github.com/downshift-js/downshift/tree/master/src/hooks/useCombobox#environment
  const environment = useMemo(() => {
    const doc = host.shadowRoot.ownerDocument
    return {
      Node,
      document: doc,
      addEventListener: (name, cb) => doc.addEventListener.bind(host.shadowRoot)(name, cb, { passive: true }),
      removeEventListener: (name, cb) => doc.removeEventListener.bind(host.shadowRoot)(name, cb, { passive: true })
    }
  }, [])

  // dispatch custom events on the host (custom element)
  const dispatchEvent = (name, detail) => host.dispatchEvent(new CustomEvent(name, { detail }))
  const onSelect = (item) => dispatchEvent('select', item)
  const onError = (error) => dispatchEvent('error', error)
  const onChange = (text) => {
    // reflect the value of the input field on the element by setting the `value` attribute
    host.setAttribute('value', text)
    dispatchEvent('change', text)
  }

  return <Autocomplete
    {...autocompleteProps}
    onSelect={onSelect}
    onError={onError}
    onChange={onChange}
    environment={environment}
  />
}

// GEAutocomplete is registered in the browser as a custom element.
// It observes element attributes, converts them to props and renders
// a react component, rerendering it if the attributes change.
class GEAutocomplete extends HTMLElement {
  static get observedAttributes() {
    return [
      'api_key',
      'placeholder',
      'autofocus',
      'debounce',
      'lang',
      'size',
      'value',
      'layers',
      'sources',
      'boundary.country',
      'boundary.gid',
      'boundary.circle.lat',
      'boundary.circle.lon',
      'boundary.circle.radius',
      'boundary.rect.min_lat',
      'boundary.rect.max_lon',
      'boundary.rect.max_lat',
      'boundary.rect.min_lon',
      'focus.point.lat',
      'focus.point.lon'
    ]
  }

  // getter & setter for the value attribute as _if_ any attribute is programatically
  // changed then it’s this one
  get value () {
    return this.getAttribute('value')?.trim()
  }

  set value (text) {
    this.setAttribute('value', text)
  }

  // props returns element attributes converted to props to be passed on
  // to the react component
  get props () {
    return compact({
      apiKey: this.getAttribute('api_key')?.trim(),
      placeholder: this.getAttribute('placeholder'),
      autoFocus: this.getAttribute('autofocus') !== null,
      debounce: parseInt(this.getAttribute('debounce')),
      value: this.value,
      params: compact({
        lang: this.getAttribute('lang'),
        size: parseInt(this.getAttribute('size')),
        layers: this.getAttribute('layers')?.split(',').map(l => l.trim()),
        sources: this.getAttribute('sources')?.split(',').map(l => l.trim()),
        boundary: compact({
          country: this.getAttribute('boundary.country'),
          gid: this.getAttribute('boundary.gid'),
          circle: compact({
            lat: parseFloat(this.getAttribute('boundary.circle.lat')),
            lon: parseFloat(this.getAttribute('boundary.circle.lon')),
            radius: parseFloat(this.getAttribute('boundary.circle.radius'))
          }),
          rect: compact({
            minLon: parseFloat(this.getAttribute('boundary.circle.rect.min_lon')),
            maxLon: parseFloat(this.getAttribute('boundary.circle.rect.max_lon')),
            minLat: parseFloat(this.getAttribute('boundary.circle.rect.min_lat')),
            maxLat: parseFloat(this.getAttribute('boundary.circle.rect.max_lat'))
          })
        }),
        focusPoint: compact({
          lat: parseFloat(this.getAttribute('focus.point.lat')),
          lon: parseFloat(this.getAttribute('focus.point.lon'))
        })
      }),
      options: compact({
        host: this.getAttribute('__host')
      })
    })
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.importStyles()
    this.importRowTemplate()
    this.render()
  }

  // importStyles looks for a specific template tag inside the custom element
  // and moves its content (expected to be a <style> tag) inside the Shadow DOM,
  // which can be used to customize the styling of the component.
  importStyles() {
    const styles = this.querySelector('style')
    if (styles === null) return

    // appending the node somewhere else _moves_ automatically it so we don’t have
    // to explicitly remove it
    this.shadowRoot.appendChild(styles)
  }

  // importRowTemplate looks for a <template row> tag inside the custom element
  // and stores its contents as a lodash template, which is then passed on to
  // the autocomplete component
  importRowTemplate() {
    const tmpl = this.querySelector('template[row]')
    if (tmpl === null) return

    this.rowTemplate = _template(
      _unescape(tmpl.innerHTML.trim()), // unescape is important for `<%` etc. lodash tags
      { variable: 'feature' } // namespace the passed in Feature as `feature` so missing keys don’t throw
    )

    // contrary to the way custom styles are handled above we remove the <template> when we’re done
    // so it doesn’t hang around in the host document (not the Shadow DOM)
    tmpl.remove()
  }

  render () {
    ReactDOM.render(
      <WebComponent
        {...this.props}
        host={this}
        rowTemplate={this.rowTemplate} />,
      this.shadowRoot
    )
  }

  attributeChangedCallback (_, oldValue, newValue) {
    // no need to re-render if the value hasn’t changed
    if (oldValue === newValue) {
      return
    }

    this.render()
  }
}

if (window.customElements.get(customElementName) === undefined) {
  window.customElements.define(customElementName, GEAutocomplete)
}

export default GEAutocomplete
