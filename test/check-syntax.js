// Run: node test/check-syntax.js
// Fails if any inline <script> in www/index.html has a syntax error.
// One stray brace kills the whole app (sidebar, buttons, everything), so CI runs this before building.
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync(__dirname + '/../www/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length === 0) throw new Error('No inline <script> found in www/index.html');
scripts.forEach((src, i) => {
  try { new vm.Script(src, { filename: `index.html <script> #${i + 1}` }); }
  catch (err) { console.error(err.stack); process.exit(1); }
});
console.log(`syntax: ok (${scripts.length} scripts)`);
