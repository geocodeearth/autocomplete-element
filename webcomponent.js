import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import Autocomplete from './src/autocomplete'

const customElementName = 'ge-autocomplete'

// events dispatched on the custom element are prefixed with this string
// to prevent conflicts
const eventPrefix = 'ge'

// WebComponent is a wrapper component for <Autocomplete>.
// It has three major tasks, specifically it
//
// 1. dispatches custom events on the host
// 2. copies the CSS from the owner (surrounding document) into the Shadow DOM
// 3. create an `environment` for Downshift to add event listeners to
const WebComponent = ({ apiKey, host }) => {
  // This is a hack: we look for a <style> element with an ID that looks like a SHA256 hash, which is what
  // is inserted into the owner’s <head> by the Autocomplete component. We then render these styles in the
  // Shadow DOM ourselves as otherwise they wouldn’t apply correctly. We don’t remove them from the owner
  // though as this component might be used multiple times on the same page, but the <style> tag is only
  // inserted once.
  //
  // It would be better if instead we could query for the <style> element directly using a known attribue,
  // or even better if the component exported its compiled css so we can render it in the Shadow DOM ourselves.
  // esbuild-css-modules does not support this yet, but I will open a PR and see that I can improve that.
  //
  // We use querySelectorAll because there might be other <style> elements with an ID, and while technically others
  // with an ID like this could exist, I think it’s unlikely enough for now.
  const css = useMemo(() => {
    const css = [...document.querySelectorAll('head> style[id]')].find(({ id }) => (new RegExp(/\b[A-Fa-f0-9]{64}\b/)).test(id))?.innerHTML
    if (!css) throw new Error(`${customElementName}: can’t find matching CSS in <head>`)
    return css
  }, []) // only run once on mount; no need for cleanup

  // for Downshift to register events properly when being rendered in a Shadow DOM
  // (as we do here), we need to give it an `environment`. as a performance improvement
  // we also force the listeners to be passive
  //
  // https://github.com/downshift-js/downshift/tree/master/src/hooks/useCombobox#environment
  const environment = useMemo(() => {
    const doc = host.shadowRoot.ownerDocument
    return {
      document: doc,
      addEventListener: (name, cb) => doc.addEventListener.bind(host.shadowRoot)(name, cb, { passive: true }),
      removeEventListener: (name, cb) => doc.removeEventListener.bind(host.shadowRoot)(name, cb, { passive: true })
    }
  }, [])

  // dispatch a custom event when a user selects an item
  const onSelect = (item) => {
    const e = new CustomEvent(`${eventPrefix}:select`, {
      detail: { item },
      bubbles: true,
      composed: true
    })

    host.dispatchEvent(e)
  }

  return <>
    <style>{css}</style>
    <Autocomplete apiKey={apiKey} onSelect={onSelect} environment={environment} />
  </>
}

// GEAutocomplete is registered in the browser as a custom element.
// It observes element attributes, converts them to props and renders
// a react component, rerendering it if the attributes change.
class GEAutocomplete extends HTMLElement {
  static get observedAttributes() {
    return ['apikey']
  }

  // props returns element attributes converted to props to be passed on
  // to the react component
  get props () {
    return {
      apiKey: this.getAttribute('apikey').trim()
    }
  }

  connectedCallback () {
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  render () {
    ReactDOM.render(
      <WebComponent {...this.props} host={this} />,
      this.shadowRoot
    )
  }

  attributeChangedCallback (_, oldValue, newValue) {
    // this callback is called once for every observed attribute before the
    // connectedCallback with oldValue as null, in which case we just ignore
    // it as the initial render will follow
    if (oldValue === null || oldValue === newValue) {
      return
    }

    this.render()
  }
}

customElements.define(customElementName, GEAutocomplete)
