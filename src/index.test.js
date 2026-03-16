import { describe, it, expect, beforeEach } from 'vitest'

vi.mock('./autocomplete/autocomplete.css', () => ({ default: '' }))
vi.mock('@geocodeearth/core-js', () => ({ createAutocomplete: vi.fn(() => vi.fn()) }))
vi.mock('react-dom', () => ({ default: { render: vi.fn() } }))

import './index.js'

describe('GEAutocomplete props getter', () => {
  let el

  beforeEach(() => {
    el = document.createElement('ge-autocomplete')
  })

  describe('top-level props', () => {
    it('maps api_key to apiKey, trimming whitespace', () => {
      el.setAttribute('api_key', '  my-key  ')
      expect(el.props.apiKey).toBe('my-key')
    })

    it('maps placeholder', () => {
      el.setAttribute('placeholder', 'Search here')
      expect(el.props.placeholder).toBe('Search here')
    })

    it('parses throttle as an integer', () => {
      el.setAttribute('throttle', '300')
      expect(el.props.throttle).toBe(300)
    })

    it('omits throttle when not set', () => {
      expect(el.props.throttle).toBeUndefined()
    })

    it('maps value, trimming whitespace', () => {
      el.setAttribute('value', '  Boston  ')
      expect(el.props.value).toBe('Boston')
    })

    it('sets autoFocus to true when autofocus attribute is present', () => {
      el.setAttribute('autofocus', '')
      expect(el.props.autoFocus).toBe(true)
    })

    it('omits autoFocus when autofocus attribute is absent', () => {
      expect(el.props.autoFocus).toBeUndefined()
    })
  })

  describe('params', () => {
    it('maps lang', () => {
      el.setAttribute('lang', 'fr')
      expect(el.props.params.lang).toBe('fr')
    })

    it('parses size as an integer', () => {
      el.setAttribute('size', '5')
      expect(el.props.params.size).toBe(5)
    })

    it('splits layers on commas and trims whitespace', () => {
      el.setAttribute('layers', 'address, street , locality')
      expect(el.props.params.layers).toEqual(['address', 'street', 'locality'])
    })

    it('splits sources on commas and trims whitespace', () => {
      el.setAttribute('sources', 'openstreetmap, whosonfirst')
      expect(el.props.params.sources).toEqual(['openstreetmap', 'whosonfirst'])
    })

    it('omits params entirely when no param attributes are set', () => {
      el.setAttribute('api_key', 'my-key')
      expect(el.props.params).toBeUndefined()
    })

    it('omits size when not set (does not pass NaN)', () => {
      el.setAttribute('lang', 'en')
      expect(el.props.params.size).toBeUndefined()
    })
  })

  describe('focus point', () => {
    it('maps focus.point.lat and focus.point.lon as floats', () => {
      el.setAttribute('focus.point.lat', '51.5074')
      el.setAttribute('focus.point.lon', '-0.1278')
      expect(el.props.params.focusPoint).toEqual({ lat: 51.5074, lon: -0.1278 })
    })

    it('omits focusPoint when neither attribute is set', () => {
      el.setAttribute('lang', 'en')
      expect(el.props.params.focusPoint).toBeUndefined()
    })

    it('omits focusPoint when only one coordinate is set', () => {
      el.setAttribute('focus.point.lat', '51.5074')
      expect(el.props.params.focusPoint).toEqual({ lat: 51.5074 })
    })
  })

  describe('boundary', () => {
    it('maps boundary.country', () => {
      el.setAttribute('boundary.country', 'US')
      expect(el.props.params.boundary.country).toBe('US')
    })

    it('maps boundary.gid', () => {
      el.setAttribute('boundary.gid', 'whosonfirst:locality:101736545')
      expect(el.props.params.boundary.gid).toBe('whosonfirst:locality:101736545')
    })

    it('omits boundary when no boundary attributes are set', () => {
      el.setAttribute('lang', 'en')
      expect(el.props.params.boundary).toBeUndefined()
    })

    describe('circle', () => {
      it('maps boundary.circle.lat, .lon, and .radius as floats', () => {
        el.setAttribute('boundary.circle.lat', '48.8566')
        el.setAttribute('boundary.circle.lon', '2.3522')
        el.setAttribute('boundary.circle.radius', '50')
        expect(el.props.params.boundary.circle).toEqual({
          lat: 48.8566,
          lon: 2.3522,
          radius: 50,
        })
      })

      it('omits circle when no circle attributes are set', () => {
        el.setAttribute('boundary.country', 'FR')
        expect(el.props.params.boundary.circle).toBeUndefined()
      })
    })

    describe('rect', () => {
      it('omits rect when no rect attributes are set', () => {
        el.setAttribute('boundary.country', 'US')
        expect(el.props.params.boundary.rect).toBeUndefined()
      })
    })
  })
})
