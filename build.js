const esbuild = require('esbuild')

const options = {
  entryPoints: ['index.js'],
  bundle: true,
  logLevel: 'info',
  loader: { '.js': 'jsx' },
  minify: true,
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': `"production"`
  },
  outfile: `dist/autocomplete.js`,
  watch: process.argv.includes('--watch')
}

// IIFE minified production
esbuild.build({
  ...options,
}).catch(() => process.exit(1))

// IIFE uncompressed dev build
esbuild.build({
  ...options,
  minify: false,
  outfile: `dist/autocomplete.development.js`,
  define: {
    'process.env.NODE_ENV': `"development"`
  },
}).catch(() => process.exit(1))
