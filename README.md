# Geocode Earth Autocomplete JS

This repo contains an autocomplete component to be used with the Geocode Earth Autocomplete API.

## Development

Both `core-js` and this library are private still, so use `npm link` like so:

1. clone https://github.com/geocodeearth/core-js
2. run `npm install`, `npm run build`, `npm link`
3. clone https://github.com/geocodeearth/autocomplete
4. run `npm link <path to core js>`, `npm install`, `npm run dev`

Then open a webserver in the `autocomplete` directory, for example with `serve` or python simple http server (`python -m SimpleHTTPServer -p 5000`).
