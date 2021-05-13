# Geocode Earth Autocomplete Element

An autocomplete element (Web Component) for use with the [Geocode Earth](https://geocode.earth/) Autocomplete API.

## Installation

### Via CDN

The easiest way to get started is to load it directly from our CDN:

```html
<script type="module" src="https://js.geocode.earth/autocomplete.js">
```

### Via NPM

Alternatively you can install it with NPM:

```bash
$ npm install @geocodeearth/autocomplete
```

The package is also available via GitHub Packages.

Then import it:

```js
import '@geocodeearth/autocomplete'
```

You can also use a script tag referencing it locally:

```html
<script type="module" src="./node_modules/@geocodeearth/autocomplete/dist/bundle.js">
```

## Basic Usage

Once installed you can use the custom element:

```html
<ge-autocomplete api_key='ge-YOURKEY'></ge-autocomplete>
```

All configuration happens through **attributes** on the element. `apikey` is the only required one (as without it you can’t access the API). All other available attributes are documented below.

The element also emits **events** as a user interacts with it. This is how you can be notified when a user selects a result, for example.

## Attributes

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


## Development

Both `core-js` and this library are private still, so use `npm link` like so:

1. clone https://github.com/geocodeearth/core-js
2. run `npm install`, `npm run build`, `npm link`
3. clone https://github.com/geocodeearth/autocomplete
4. run `npm link <path to core js>`, `npm install`, `npm run dev`

This will run a local development server to serve the example HTML as well as rebuild on every request.

## License

This code is licensed under the MIT license. Please see the `LICENSE` file for details.
