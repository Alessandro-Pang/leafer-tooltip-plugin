/*
 * @Author: zi.yang
 * @Date: 2023-07-06 00:31:58
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-01 23:54:06
 * @Description: rollup
 * @FilePath: /leafer-tooltip-plugin/rollup.config.js
 */
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import typescript from 'rollup-plugin-typescript2';

import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

const entries = ['src/index.ts']

const plugins = [
  babel({
    babelrc: false,
    babelHelpers: 'bundled',
    presets: [['env', { modules: false }]]
  }),
  resolve({
    preferBuiltins: true
  }),
  alias(),
  json(),
  typescript(),
  commonjs(),
  esbuild()
]

export default [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
        format: 'esm'
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
        format: 'cjs'
      }
    ],
    plugins
  })),
  {
    input: './index.d.ts',
    output: { file: 'dist/index.d.ts', format: 'esm' },
    plugins: [dts({ respectExternal: true })]
  }
]

