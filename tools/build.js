/**
 * dar-tool
 *
 * Copyright © 2016 Jacob Windsor. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const pkg = require('../package.json');

let promise = Promise.resolve();

// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel
// Only do common js
for (const format of ['cjs']) {
  promise = promise.then(() => rollup.rollup({
    entry: 'src/server.js',
    external: Object.keys(pkg.dependencies),
    plugins: [babel(Object.assign(pkg.babel, {
      babelrc: false,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }))],
  }).then(bundle => bundle.write({
    dest: `dist/${format === 'cjs' ? 'server' : `server.${format}`}.js`,
    format,
    sourceMap: true,
    moduleName: format === 'umd' ? pkg.name : undefined,
  })));
}

// Copy package.json, app.yaml, .env, app-engine-key.json, and LICENSE.txt
promise = promise.then(() => {
  delete pkg.eslintConfig;
  delete pkg.babel;
  delete pkg.scripts.start;
  pkg.scripts.start = 'node server.js';
  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');
  fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('LICENSE.txt', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/.env', fs.readFileSync('.env', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/app-engine-key.json', fs.readFileSync('app-engine-key.json', 'utf-8')
    , 'utf-8');
  fs.writeFileSync('dist/app.yaml', fs.readFileSync('app.yaml', 'utf-8'), 'utf-8');
});


promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
