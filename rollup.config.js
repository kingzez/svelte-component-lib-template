import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'

const production = !process.env.ROLLUP_WATCH

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`

const externalPeerDeps = Object.keys(pkg.peerDependencies || {})

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/lib/index.ts',
  output: {
    banner,
    sourcemap: true,
    format: 'esm',
    file: 'dist/index.js',
  },
  external: ['svelte', 'svelte/internal'],
  plugins: [
    // teach rollup how to handle typescript imports
    resolve({
      browser: true,
      exportConditions: ['svelte'],
      extensions: ['.svelte', '.js', '.ts', '.scss'],
    }),    
    typescript({ sourceMap: true }),
    postcss(),
    svelte({
      preprocess: sveltePreprocess({
        sourceMap: true,
        scss: {
          // We can use a path relative to the root because
          // svelte-preprocess automatically adds it to `includePaths`
          // if none is defined.
          prependData: `@import 'src/styles/variables.scss';`,
        },
        postcss: {
          plugins: [require('autoprefixer')()],
        },
      }),
    }),
  ],
}
