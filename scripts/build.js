const esbuild = require('esbuild')
const cyan = (s) => `\x1b[36m${s}\x1b[0m` // tiny log helper for some color

// esbuild options shared for production & dev builds
const options = {
  entryPoints: ['index.js'],
  outfile: `dist/autocomplete.js`,
  bundle: true,
  logLevel: 'info',
  logLimit: 0,
  loader: { '.js': 'jsx' },
  minify: true,
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': `"production"`
  }
}

// for development we use esbuild to run a server that rebuilds on every request as well as serves our example HTML
// IIFE uncompressed
if (process.argv.includes('--dev')) {
  esbuild.serve({
    servedir: 'example',
    port: 5000
  }, {
    ...options,
    minify: false,
    outfile: `example/${options.outfile}`,
    define: {
      'process.env.NODE_ENV': `"development"`
    },
  }).then(({host, port}) => {
    console.log('🔗 dev server running on %s\n', cyan(`http://${host}:${port}`))
  })

} else {
  // IIFE minified production
  esbuild.build({...options}).catch(() => process.exit(1))
}
