import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const isDev = /development/.test(process.env.NODE_ENV);
const outPath = isDev ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'dist/min');
const name = 'content-editable-extension';

const outputConfigs = [
  {
    file: `${outPath}/${name}-umd.js`,
    format: 'umd',
    name: 'CEExtension',
    sourcemap: isDev
  },
  {
    file: `${outPath}/${name}-es.js`,
    format: 'esm',
    sourcemap: isDev
  },
  {
    file: `${outPath}/${name}-cjs.js`,
    format: 'cjs',
    sourcemap: isDev
  }
]

export default {
  input: 'src/main.ts',
  output: outputConfigs,
  plugins: [
    typescript({
      sourceMap: isDev
    }),
    commonjs(),
    resolve(),
  ].concat(!isDev ? terser() : ''),
  watch: {
    include: 'src/**',
  }
}