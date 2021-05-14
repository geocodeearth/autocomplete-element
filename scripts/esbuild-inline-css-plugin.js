const esbuild = require('esbuild')

// this plugin bundles (and minifies) CSS files using esbuild
// and returns the contents as a string using the built-in `text` loader
module.exports = {
  name: 'inline-css',
  setup({ onLoad }) {
    onLoad({ filter: /\.css$/ }, async (args) => {
      const { outputFiles } = await esbuild.build({
        entryPoints: [args.path],
        write: false,
        bundle: true,
        minify: true
      })

      return {
        contents: outputFiles[0].text.trim(),
        loader: 'text'
      }
    })
  }
}
