const esbuild = require('esbuild')
const cssModulesPlugin = require('esbuild-css-modules-plugin')
const fse = require('fs-extra')
const pkg = require('../package.json')

// clear out the dist folder
const out = 'dist'
fse.emptyDirSync(out)

// IIFE, for direct use in the browser
esbuild.build({
  entryPoints: ['webcomponent.js'],
  outfile: `${out}/${pkg.name}.wcb.js`,
  format: 'iife',
  bundle: true,
  minify: true,
  sourcemap: false,
  loader: { '.js': 'jsx' },
  plugins: [ cssModulesPlugin() ],
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info',
  logLimit: 0
}).catch(() => process.exit(1))
