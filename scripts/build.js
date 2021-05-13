const esbuild = require('esbuild')
const cssModulesPlugin = require('esbuild-css-modules-plugin')
const { dependencies, cssModules } = require('../package.json')

const entrypoint= 'webcomponent.js'
const outDir = 'dist'
const options = {
  entryPoints: [entrypoint],
  format: 'esm',
  bundle: true,
  sourcemap: true,
  loader: { '.js': 'jsx' },
  plugins: [cssModulesPlugin(cssModules)],
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info',
  logLimit: 0
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
  outfile: `${outDir}/index.wcb.js`,
  minify: true,
}).catch(() => process.exit(1))
