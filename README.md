# Geocode Earth Autocomplete Element

An autocomplete element (Web Component) for use with the [Geocode Earth](https://geocode.earth/) Autocomplete API.

## Installation

```bash
$ npm install @geocodeearth/autocomplete-element
```

The package is also available via GitHub Packages.

Then import it:

```js
import '@geocodeearth/autocomplete-element'
```

You can also use a script tag referencing it locally:

```html
<script type="module" src="./node_modules/@geocodeearth/autocomplete-element/dist/bundle.js">
```

## Basic Usage

Once installed you can use the custom element:

```html
<ge-autocomplete api_key='ge-YOURKEY'></ge-autocomplete>
```

## Attributes

All configuration happens through **attributes** on the element. `api_key` is the only required one (as without it you can’t access the API). All other available attributes are documented below.

### `api_key`
> **required**, no default

Your Geocode Earth API key. [Sign up for a free trial »](https://geocode.earth)

### `debounce`
> defaults to `300`

Used to prevent firing a request for every keystroke as the user types, in milliseconds.

### `size`
> defaults to `10`

Controls how many results should be shown.

### `placeholder`
> defaults to `Search a city or address`

Sets the placeholder text for the input field.

### `autofocus`
> defaults to `false`

Sets whether the input should be automatically focused, can be set without an explicit value as it’s a boolean:

```html
<ge-autocomplete api_key="…" autofocus></ge-autocomplete>
```

### `lang`
> defaults to `Accept-Language` header, falls back to `en`

Sets the language in which results are returned.

### `sources`
> defaults to all sources

The Geocode Earth dataset is a combination of multiple data sources. This attribute can be used to limit results to a specific source (or multiple ones, comma separated). Please see our API documentation for a list of available sources: [geocode.earth/docs/reference/data_sources/](https://geocode.earth/docs/reference/data_sources/)

### `focus.point.lat` & `focus.point.lon`
> defaults to unfocused

Sets latitude and longitude around which to focus results. In addition to providing results that are more relevant due to their proximity, setting a focus point is generally significantly faster than an unfocused query.

### `boundary.country`
### `boundary.gid`
### `boundary.circle.lat`
### `boundary.circle.lon`
### `boundary.circle.radius`
### `boundary.rect.min_lat`
### `boundary.rect.max_lon`
### `boundary.rect.max_lat`
### `boundary.rect.min_lon`

## Events

The element also emits **events** as a user interacts with it. This is how you can be notified when a user selects a result, for example. The `event.detail` payload contains details about the event.

**Note:** These events do not bubble, which means listeners have to be attached to the element directly (see examples below).

|Event&nbsp;Name|`event.detail`|Description|
|---------------|--------------|-----------|
|`select`       |`Feature`     |Dispatched when a user selects a suggested item from the list.|
|`change`       |`string`      |Dispatched with every keystroke as the user types (not debounced).|
|`error`        |`Error`       |Dispatched if an error occures during the request (for example if the rate limit was exceeded.) More on error handling below.|

## Example

Please see the `example` folder. You can follow the steps in the [**Development**](#development) section to run them directly, too.

## Development

```bash
$ npm install
$ npm run dev
```

## License

This code is licensed under the MIT license. Please see the `LICENSE` file for details.
