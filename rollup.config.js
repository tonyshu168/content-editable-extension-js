import path from 'path';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');
const isDev = /development/.test(process.env.NODE_ENV);
const outPath = isDev ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'dist/min');
const name = isDev ? 'content-editable-extension' : 'content-editable-extension-min';

const outputConfigs = [
  {
    file: `${outPath}/${name}-${pkg.version}.js`,
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
    json(),
    commonjs(),
    resolve(),
  ].concat(!isDev ? terser() : ''),
  watch: {
    include: 'src/**',
  }
}