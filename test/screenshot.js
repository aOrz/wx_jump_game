'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync('wx_jump.js', 'utf8');
function run(codes) {
  const commands = [];
  const reads = [];
  const context = {
    __dirname: '/installed/package',
    console: { log() {} },
    setTimeout() { throw new Error('unexpected retry'); },
    require(name) {
      if (name === 'shelljs') return {
        rm() {},
        exec(command) { commands.push(command); return {code: codes.shift() || 0}; }
      };
      if (name === 'canvas') return {};
      if (name === 'child_process') return {};
      if (name === 'fs') return {readFileSync(path) { reads.push(path); throw new Error('read boundary'); }};
      throw new Error(name);
    }
  };
  let error;
  try { vm.runInNewContext(source, context); } catch (e) { error = e; }
  return {commands, reads, error};
}
let result = run([1]);
assert.strictEqual(result.commands.length, 1, 'do not pull stale screenshot after capture failure');
assert.strictEqual(result.reads.length, 0);
assert.match(result.error.message, /capture/);
result = run([0, 1]);
assert.strictEqual(result.reads.length, 0, 'do not process stale screenshot after pull failure');
assert.match(result.error.message, /pull/);
result = run([0, 0]);
assert.deepStrictEqual(result.reads, ['./1.png'], 'read from same working directory as adb pull');
assert.strictEqual(result.commands.length, 2);
console.log('Screenshot command/path regression tests passed.');
