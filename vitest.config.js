import { defineConfig } from 'vitest/config'
import esbuild from 'esbuild'

export default defineConfig({
  plugins: [
    {
      // Vitest won't parse JSX in .js files by default; this plugin handles it
      name: 'treat-js-as-jsx',
      async transform(code, id) {
        if (!id.match(/\/src\/.*\.js$/)) return null
        const result = await esbuild.transform(code, {
          loader: 'jsx',
          jsxFactory: 'React.createElement',
          jsxFragment: 'React.Fragment',
          sourcefile: id,
          sourcemap: true,
          sourcesContent: false,
        })
        return { code: result.code, map: result.map }
      },
    },
  ],
  resolve: {
    mainFields: ['module', 'main'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
