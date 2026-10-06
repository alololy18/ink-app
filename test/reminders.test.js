// Run: node test/reminders.test.js
// Checks the pure reminder helpers embedded in www/index.html.
const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync(__dirname + '/../www/index.html', 'utf8');
const src = html.split('/* reminders-pure:start */')[1].split('/* reminders-pure:end */')[0];
const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const { reminderNotifId, reminderDayKey } = new Function('dateKey', src + 'return { reminderNotifId, reminderDayKey };')(dateKey);

// Answered after it fired, same day -> today
assert.strictEqual(reminderDayKey('08:00', new Date(2026, 9, 6, 8, 5)), '2026-10-06');
// 22:00 reminder answered after midnight -> still yesterday
assert.strictEqual(reminderDayKey('22:00', new Date(2026, 9, 7, 0, 30)), '2026-10-06');
// Across month boundary
assert.strictEqual(reminderDayKey('23:30', new Date(2026, 10, 1, 0, 10)), '2026-10-31');
// Exactly at fire time -> today
assert.strictEqual(reminderDayKey('09:00', new Date(2026, 9, 6, 9, 0)), '2026-10-06');

// Ids: stable, positive, fit in a Java int, distinct for different habits
const a = reminderNotifId('lq3k9x2abc'), b = reminderNotifId('lq3k9x2abd');
assert.strictEqual(a, reminderNotifId('lq3k9x2abc'));
assert.ok(a > 0 && a <= 2147483647 && b > 0 && b <= 2147483647 && a !== b);
console.log('reminders: ok');
