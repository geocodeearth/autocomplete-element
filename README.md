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
<script type="module" src="./node_modules/@geocodeearth/autocomplete-element/dist/bundle.js"></script>
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
> defaults to unset (all countries)

Sets a country filter to only return results in the specified country. Use a comma separated list of [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) country codes (2 or 3 letter variants).

### `boundary.gid`
> defaults to unset (all GIDs)

Filters results by parent ID, which can be used to search in areas smaller than a country and/or areas with shapes not well represented by rectangular bounding boxes.

[Please see our documentation how to use this.](https://geocode.earth/docs/forward/customization/#restrict-results-by-parent-id)

### `boundary.circle.lat`, `boundary.circle.lon`, `boundary.circle.radius`
> defaults to unset

Searches within a circular region. Useful to return results in a radius around a known point. Note: all three parameters need to be set. The `radius` is defined in kilometers.

### `boundary.rect.min_lat`, `boundary.rect.max_lon`, `boundary.rect.max_lat`, `boundary.rect.min_lon`
> defaults to unset

Searches within a rectangular region. Same as with a circular boundary all 4 parameters have to be set.

Tip: You can look up a bounding box for a known region using [geojson.io](https://geojson.io/).

## Events

The element also emits **events** as a user interacts with it. This is how you can be notified when a user selects a result, for example. The `event.detail` payload contains details about the event.

**Note:** These events do not bubble, which means listeners have to be attached to the element directly (see examples below).

|Event&nbsp;Name|`event.detail`|Description|
|---------------|--------------|-----------|
|`select`       |`Feature`     |Dispatched when a user selects a suggested item from the list.|
|`change`       |`string`      |Dispatched with every keystroke as the user types (not debounced).|
|`error`        |`Error`       |Dispatched if an error occures during the request (for example if the rate limit was exceeded.)|



## Customization

We did our best to design the element in such a way that it can be used as is in a lot of different contexts without needing to adjust how it looks. However, there certainly can be situations where customization is necessary. The element supports three different customization APIs:

1. Custom CSS (variables)
2. A string template as well as
3. A row template

### 1. Custom CSS

We use CSS variables for almost all properties that you would want to customize. This includes the font family, background or shadow of the input and the hover state for a result just to name a few. For a list of all available variables please check the source CSS file directly ([`/src/autocomplete/autocomplete.css`](src/autocomplete/autocomplete.css)).

You can adjust these variables by placing a `<style>` tag _inside_ the element, like so:

```html
<ge-autocomplete api_key="…">
  <style>
     :host {
       --input-bg: salmon;
       --input-color: green;
       --loading-color: hotpink;
    }
  </style>
</ge-autocomplete>
```

**Important:** While it is technically possible to override the actual classnames the element uses internally, we do not consider those part of the public API. That means they can change without a new major version, which could break your customization. The CSS variables on the other hand are specifically meant to be customized, which is why they will stay consistent even if the internal markup changes.

If you would like to customize a property for which there is no variable we’d be happy to accept a pull-request or issue about it.

### 2. String Template

If you want to customize how a feature is turned into a string for rendering (in the results as well as the input field after it was selected), you can define a custom string template. This allows you to use the [lodash template language][_template] to access every property of the feature to build a custom string.

```html
<ge-autocomplete api_key="…">
  <template string>
    ${item.feature.properties.name} (${item.feature.properties.id}, ${item.feature.properties.source})
  </template>
</ge-autocomplete>
```

**Important:** Make sure to return a plain string here, no HTML. The reason for this is that this template will also be used in the input field itself after a result has been selected, which doesn’t support HTML.

### 3. Row Template

Similar to the string template mentioned above, you can use the row template to define how a single row in the results is rendered. The key here is that this supports full HTML:

```html
<ge-autocomplete api_key="…">
  <template row>
    <div class="custom-row ${item.active ? 'custom-row--active' : null}">
      <img src="/flags/${item.feature.properties.country_a.png}" alt="${item.feature.properties.country_a}">
      <span>${item.feature.properties.label}</span>
    </div>
  </template>
</ge-autocomplete>
```

**Pro Tip™:** Use the `item.active` property to check if the current row is being hovered over or activated via arrow keys.

The example above could render a little flag icon for the result’s country, for example. You can customize the styling by defining custom classes in the same way you would customize the CSS variables. It’s best to prefix your classes to avoid conflicts with internal classnames of the element.

The [lodash template language][_template] supports much more than just straight variables. Please refer to their docs directly to understand how it works. It’s pretty powerful.

  [_template]: https://lodash.com/docs/4.17.15#template



## Example

Please see the `example` folder. You can follow the steps in the [**Development**](#development) section to run them directly, too.

## Development

```bash
$ npm install
$ npm run dev
```

## License

This code is licensed under the MIT license. Please see the `LICENSE` file for details.
