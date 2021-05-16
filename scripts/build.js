const esbuild = require('esbuild')
const inlineCSSPlugin = require('./esbuild-inline-css-plugin')
const { version, dependencies } = require('../package.json')

const entrypoint= 'src/index.js'
const outDir = 'dist'
const banner = `/**
 * Geocode Earth Autocomplete Element v${version}
 * Copyright (c) ${new Date().getFullYear()} Cleared for Takeoff, Inc.
 *
 * @license MIT
 */`

const options = {
  entryPoints: [entrypoint],
  format: 'esm',
  bundle: true,
  sourcemap: true,
  loader: { '.js': 'jsx' },
  plugins: [inlineCSSPlugin],
  logLevel: 'info',
  logLimit: 0,
  banner: { js: banner }
}

// unminified with external dependencies
// expected to be imported and bundled again
esbuild.build({
  ...options,
  outfile: `${outDir}/index.js`,
  minify: false,
  external: Object.keys(dependencies)
}).catch(() => process.exit(1))

// minified with bundled dependencies for direct use in the browser
// expected to be used via <script type="module">
esbuild.build({
  ...options,
  outfile: `${outDir}/bundle.js`,
  minify: true,
}).catch(() => process.exit(1))
