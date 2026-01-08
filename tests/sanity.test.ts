// Sanity check test
// Run with: npx tsx tests/sanity.test.ts

import assert from 'assert';

console.log('Running sanity checks...');

// Basic arithmetic check
assert.strictEqual(1 + 1, 2, 'Math should work');

console.log('Sanity check passed!');
