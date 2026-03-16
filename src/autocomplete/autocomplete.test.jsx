import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

vi.mock('./autocomplete.css', () => ({ default: '' }))

vi.mock('@geocodeearth/core-js', () => ({
  createAutocomplete: vi.fn(),
}))

import { createAutocomplete } from '@geocodeearth/core-js'
import Autocomplete from './autocomplete'

const makeFeature = (gid, label, extra = {}) => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [0, 0] },
  properties: { gid, label, ...extra },
})

const sampleFeatures = [
  makeFeature('geo:1', 'New York, NY, USA'),
  makeFeature('geo:2', 'New Jersey, USA'),
]

const defaultProps = {
  apiKey: 'test-key',
  params: {},
  options: {},
}

describe('Autocomplete', () => {
  let mockSearch

  beforeEach(() => {
    mockSearch = vi.fn().mockResolvedValue({ features: [], discard: false })
    createAutocomplete.mockReturnValue(mockSearch)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('renders an input field', () => {
      const { container } = render(<Autocomplete {...defaultProps} />)
      expect(container.querySelector('input')).toBeInTheDocument()
    })

    it('shows the default placeholder', () => {
      render(<Autocomplete {...defaultProps} />)
      expect(screen.getByPlaceholderText('Search a city or address')).toBeInTheDocument()
    })

    it('shows a custom placeholder', () => {
      render(<Autocomplete {...defaultProps} placeholder="Find a place" />)
      expect(screen.getByPlaceholderText('Find a place')).toBeInTheDocument()
    })

    it('renders attribution links', () => {
      render(<Autocomplete {...defaultProps} />)
      expect(screen.getByText('Geocode Earth')).toBeInTheDocument()
      expect(screen.getByText('OpenStreetMap')).toBeInTheDocument()
    })
  })

  describe('default result rendering', () => {
    it('displays feature labels after a search', async () => {
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument()
        expect(screen.getByText('New Jersey, USA')).toBeInTheDocument()
      })
    })

    it('renders each result as a list item', async () => {
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => {
        expect(screen.getAllByRole('option')).toHaveLength(2)
      })
    })

    it('clears results when the input is emptied', async () => {
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} />)

      const input = screen.getByPlaceholderText('Search a city or address')
      fireEvent.change(input, { target: { value: 'new' } })
      await waitFor(() => screen.getByText('New York, NY, USA'))

      fireEvent.change(input, { target: { value: '' } })
      expect(screen.queryByText('New York, NY, USA')).not.toBeInTheDocument()
    })
  })

  describe('stringTemplate', () => {
    it('uses stringTemplate to render the item label', async () => {
      const stringTemplate = vi.fn(({ feature }) => `result: ${feature.properties.label}`)
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} stringTemplate={stringTemplate} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => {
        expect(screen.getByText('result: New York, NY, USA')).toBeInTheDocument()
      })
    })

    it('passes the full feature to stringTemplate', async () => {
      const stringTemplate = vi.fn(({ feature }) => feature.properties.label)
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} stringTemplate={stringTemplate} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => screen.getAllByRole('option'))
      expect(stringTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ feature: sampleFeatures[0] })
      )
    })

    it('passes active, searchTerm, and index to stringTemplate', async () => {
      const stringTemplate = vi.fn(({ feature }) => feature.properties.label)
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} stringTemplate={stringTemplate} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => screen.getAllByRole('option'))
      expect(stringTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTerm: 'new',
          index: 0,
          active: expect.any(Boolean),
        })
      )
    })

    it('falls back to feature.properties.label when no stringTemplate is provided', async () => {
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument()
      })
    })
  })

  describe('rowTemplate', () => {
    it('uses rowTemplate to render custom HTML for each result', async () => {
      const rowTemplate = vi.fn(({ feature }) =>
        `<span class="custom">${feature.properties.label}</span>`
      )
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} rowTemplate={rowTemplate} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => {
        expect(document.querySelector('.custom')).toBeInTheDocument()
        expect(document.querySelector('.custom').textContent).toBe('New York, NY, USA')
      })
    })

    it('passes active, searchTerm, and index to rowTemplate', async () => {
      const rowTemplate = vi.fn(() => '<span>result</span>')
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} rowTemplate={rowTemplate} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'test query' } })

      await waitFor(() => screen.getAllByRole('option'))
      expect(rowTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTerm: 'test query',
          index: 0,
          active: expect.any(Boolean),
        })
      )
    })

    it('escapes feature data passed to rowTemplate to prevent XSS', async () => {
      const maliciousFeature = makeFeature(
        'geo:evil',
        '<script>alert("xss")</script>',
        { name: '<img onerror="bad()">' }
      )
      const capturedArgs = []
      const rowTemplate = vi.fn((args) => {
        capturedArgs.push(args)
        return '<span>result</span>'
      })

      mockSearch.mockResolvedValue({ features: [maliciousFeature], discard: false })
      render(<Autocomplete {...defaultProps} rowTemplate={rowTemplate} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'xss' } })

      await waitFor(() => screen.getAllByRole('option'))

      const passedFeature = capturedArgs[0].feature
      expect(passedFeature.properties.label).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(passedFeature.properties.name).toBe('&lt;img onerror=&quot;bad()&quot;&gt;')
    })

    it('does not escape feature data passed to stringTemplate', async () => {
      // stringTemplate is NOT escaped — it receives raw values so templates
      // can access structured data cleanly; the string is rendered as text (not HTML)
      const maliciousFeature = makeFeature('geo:1', '<b>Bold City</b>')
      const stringTemplate = vi.fn(({ feature }) => feature.properties.label)

      mockSearch.mockResolvedValue({ features: [maliciousFeature], discard: false })
      render(<Autocomplete {...defaultProps} stringTemplate={stringTemplate} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'bold' } })

      await waitFor(() => screen.getAllByRole('option'))
      expect(stringTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ feature: maliciousFeature })
      )
    })
  })

  describe('callbacks', () => {
    it('calls onSelect with the selected feature', async () => {
      const onSelect = vi.fn()
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} onSelect={onSelect} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })
      await waitFor(() => screen.getAllByRole('option'))

      fireEvent.click(screen.getAllByRole('option')[0])
      expect(onSelect).toHaveBeenCalledWith(sampleFeatures[0])
    })

    it('calls onFeatures with results after each search', async () => {
      const onFeatures = vi.fn()
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: false })
      render(<Autocomplete {...defaultProps} onFeatures={onFeatures} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await waitFor(() => {
        expect(onFeatures).toHaveBeenCalledWith(sampleFeatures)
      })
    })

    it('calls onError when the API fails', async () => {
      const onError = vi.fn()
      const error = new Error('network error')
      mockSearch.mockRejectedValue(error)

      render(<Autocomplete {...defaultProps} onError={onError} />)
      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'test' } })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })

    it('calls onChange when the user types', () => {
      const onChange = vi.fn()
      render(<Autocomplete {...defaultProps} onChange={onChange} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'portland' } })
      expect(onChange).toHaveBeenCalledWith('portland')
    })
  })

  describe('API client setup', () => {
    it('initializes the API client with the provided key and params', () => {
      render(<Autocomplete {...defaultProps} apiKey="my-key" params={{ lang: 'fr' }} />)
      expect(createAutocomplete).toHaveBeenCalledWith(
        'my-key',
        { lang: 'fr' },
        expect.any(Object)
      )
    })

    it('does not search when the input is empty', () => {
      render(<Autocomplete {...defaultProps} />)
      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: '' } })
      expect(mockSearch).not.toHaveBeenCalled()
    })

    it('ignores out-of-order responses (discard: true) to prevent stale results from a slower earlier request overwriting results from a faster later one', async () => {
      mockSearch.mockResolvedValue({ features: sampleFeatures, discard: true })
      render(<Autocomplete {...defaultProps} />)

      fireEvent.change(screen.getByPlaceholderText('Search a city or address'), { target: { value: 'new' } })

      await new Promise((r) => setTimeout(r, 50))
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })
  })
})
