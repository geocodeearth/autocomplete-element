const esbuild = require('esbuild')
const cssModulesPlugin = require('esbuild-css-modules-plugin')
const fse = require('fs-extra')
const pkg = require('../package.json')
const cyan = (s) => `\x1b[36m${s}\x1b[0m` // tiny log helper for some color

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
    entryPoints: ['example/index.js'],
    outfile: `example/build.js`,
    define: {
      'process.env.NODE_ENV': `"development"`,
    },
  }).then(({host, port}) => {
    console.log('🔗 dev server running on %s\n', cyan(`http://${host}:${port}`))
  })

} else {
  // PRODUCTION / DISTRIBUTION
  fse.emptyDirSync('dist')

  esbuild.build({
    ...options,
    entryPoints: ['src/autocomplete.js'],
    outfile: `dist/${pkg.name}.esm.js`,
    external: Object.keys({
      ...pkg.dependencies,
      ...pkg.peerDependencies
    }),
    define: {
      'process.env.NODE_ENV': `"production"`
    }
  }).catch(() => process.exit(1))
}
