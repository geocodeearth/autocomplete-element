const esbuild = require('esbuild')
const cssModulesPlugin = require('esbuild-css-modules-plugin')
const fse = require('fs-extra')
const pkg = require('../package.json')
const cyan = (s) => `\x1b[36m${s}\x1b[0m` // tiny log helper for some color

// output folder
const out = 'dist'

// shared esbuild options
const options = {
  format: 'esm',
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  logLimit: 0,
  loader: { '.js': 'jsx' },
  plugins: [
    cssModulesPlugin()
  ]
}

// DEVELOPMENT
//
// in development we bundle example/index.js on the fly using the
// esbuild dev server, which also serves the example HTML
if (process.argv.includes('--dev')) {
  esbuild.serve({
    servedir: 'example',
    port: 5000
  }, {
    ...options,
    entryPoints: ['example/index.js', 'webcomponent.js'],
    outdir: 'example',
    entryNames: '[name].dev',
    define: {
      'process.env.NODE_ENV': `"development"`,
    },
  }).then(({host, port}) => {
    console.log('🔗 dev server running on %s\n', cyan(`http://${host}:${port}`))
  })

} else {
  // PRODUCTION / DISTRIBUTION
  fse.emptyDirSync(out)

  // set NODE_ENV to optimize dependencies for production
  const define = { 'process.env.NODE_ENV': `"production"` }

  // React Component (external dependency ESM)
  esbuild.build({
    ...options,
    entryPoints: ['src/autocomplete.js'],
    outfile: `${out}/${pkg.name}.esm.js`,
    minify: false, // not minified as this is expected to be bundled again
    external: Object.keys({
      ...pkg.dependencies,
      ...pkg.peerDependencies
    }),
    define
  }).catch(() => process.exit(1))

  // Web Component (IIFE)
  esbuild.build({
    ...options,
    entryPoints: ['webcomponent.js'],
    outfile: `${out}/${pkg.name}.wcb.js`,
    format: 'iife',
    minify: true, // minified as this is expected to be used as-is
    define
  }).catch(() => process.exit(1))
}
