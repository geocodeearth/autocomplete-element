const esbuild = require('esbuild')
const inlineCSSPlugin = require('./esbuild-inline-css-plugin')

// tiny log helper for some color
const cyan = (s) => `\x1b[36m${s}\x1b[0m`

// run esbuild dev server that serves the `example` folder
// and recompiles the webcomponent.js entrypoint on every request
esbuild.serve({
  servedir: 'example',
  port: 5000
}, {
  entryPoints: ['src/index.js'],
  outfile: 'example/index.dev.js',
  format: 'esm',
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  logLimit: 0,
  loader: { '.js': 'jsx' },
  plugins: [inlineCSSPlugin]
}).then(({ host, port }) => {
  console.log('🔗 dev server running on %s\n', cyan(`http://${host}:${port}`))
})
