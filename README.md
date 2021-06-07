# Geocode Earth Autocomplete JS

This repo contains an autocomplete Web Component for use with the [Geocode Earth](https://geocode.earth/) Autocomplete API.

## Usage

```html
<ge-autocomplete
  api_key='ge-abc123'
  size='5'
  lang='en'
  boundary.country='de'
></ge-autocomplete>
```

All available Autocomplete API parameters are supported and can be used by setting attributes on the element.

## Development

Both `core-js` and this library are private still, so use `npm link` like so:

1. clone https://github.com/geocodeearth/core-js
2. run `npm install`, `npm run build`, `npm link`
3. clone https://github.com/geocodeearth/autocomplete
4. run `npm link <path to core js>`, `npm install`, `npm run dev`

This will run a local development server to serve the example HTML as well as rebuild on every request.

## License

This code is licensed under the MIT license. Please see the `LICENSE` file for details.
