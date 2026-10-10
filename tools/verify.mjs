// Real-Chrome check of the five steps at 1440x900 and 1920x1080: built on load,
// a dragged event posted, an out-of-band update, a team swap, Back, and no
// console errors or [lattice] warnings. Screenshots go to shots/.
//   npm run serve                    (in another terminal)
//   CHROME=/usr/bin/google-chrome node tools/verify.mjs [http://localhost:8000/]
import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const url = process.argv[2] || 'http://localhost:8000/';
const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let failed = 0;
const check = (ok, what) => { if (!ok) failed += 1; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); };
mkdirSync('shots', { recursive: true });

// Card titles of the bound calendar and of the calendar built from a table.
const cardsIn = (sel) => [...document.querySelectorAll(sel + ' .lat-calendar__span')].map((e) => e.textContent.trim());
const bookingCards = (page) => page.evaluate(cardsIn, '.bookings-calendar');
const rotaCards = (page) => page.evaluate(cardsIn, '.rota-calendar');
const gridText = () => [...document.querySelectorAll('#bookings [role=row]')].map((r) => r.textContent).join('|');
const pressed = (page) => page.evaluate(() => [...document.querySelectorAll('.filters button[aria-pressed=true]')].map((b) => b.textContent).join(','));

async function drag(page, selector, title, dx, dy) {
  const at = await page.evaluate((sel, t) => {
    const el = [...document.querySelectorAll(sel + ' .lat-calendar__span')].find((e) => e.textContent.trim() === t);
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + 12, y: r.top + r.height / 2 };
  }, selector, title);
  await page.mouse.move(at.x, at.y);
  await page.mouse.down();
  await page.mouse.move(at.x + dx / 2, at.y + dy / 2, { steps: 5 });
  await page.mouse.move(at.x + dx, at.y + dy, { steps: 5 });
  await page.mouse.up();
}

try {
  for (const [width, height] of [[1440, 900], [1920, 1080]]) {
    console.log(`--- ${width}x${height}`);
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    const problems = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.text().includes('[lattice]')) problems.push(m.text()); });
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => document.querySelectorAll('.bookings-calendar .lat-calendar__span').length > 5
      && document.querySelectorAll('.rota-calendar .lat-calendar__span').length > 1, { timeout: 30000 });
    await sleep(1000);
    check((await bookingCards(page)).includes('Release freeze'), 'built on load: the bound calendar shows the bookings');
    check((await rotaCards(page)).includes('Priya Raman'), 'built on load: the rota calendar is built from its table');
    check((await page.evaluate(gridText)).includes('Release freeze'), 'built on load: the bookings grid is populated');
    await page.screenshot({ path: `shots/load-${width}.png`, fullPage: true });

    // Move an event: drag Brand workshop (13 Oct) two days on; the post carries the new dates.
    await drag(page, '.bookings-calendar', 'Brand workshop', 262 * (width / 1440), 0);
    await sleep(1200);
    const saved = await page.evaluate(() => document.getElementById('save-log').textContent);
    check(/Saved Brand workshop: 2026-10-1[4-9] to 2026-10-1[4-9]/.test(saved), `move: the drag was posted and confirmed (${saved.trim()})`);
    check(/POST \/htmx-demo\/calendar\/save → 200/.test(await page.evaluate(() => document.getElementById('request-log').textContent)), 'move: the request log shows the post');
    await drag(page, '.rota-calendar', 'Priya Raman', 170 * (width / 1440), 55);
    await sleep(1200);
    const savedShift = await page.evaluate(() => document.getElementById('save-log').firstElementChild.textContent);
    check(/Saved Priya Raman: 2026-10-1[3-9] to 2026-10-(1[5-9]|2\d)/.test(savedShift), `move: a dragged shift was posted (${savedShift})`);

    // Out of band: press until the card moves (a shift may fall outside the week shown); the grid keeps its rows.
    for (const [label, read, kind] of [['booking', bookingCards, 'booking'], ['shift', rotaCards, 'shift']]) {
      const before = (await read(page)).join('|');
      let moved = false;
      for (let i = 0; i < 15 && !moved; i += 1) {
        await page.click(`button[hx-vals*='"${kind}"']`);
        await sleep(700);
        moved = (await read(page)).join('|') !== before;
      }
      check(moved, `out of band: a ${label} card moved`);
      check((await page.evaluate(gridText)).includes('Release freeze'), `out of band: the grid is still populated after a ${label} update`);
    }
    await page.screenshot({ path: `shots/oob-${width}.png`, fullPage: true });

    // Swap: a team, then the week view.
    await page.click('button[hx-get*="team=Design&amp;view=month"], button[hx-get*="team=Design&view=month"]');
    await sleep(1500);
    check(await pressed(page) === 'Design,Month view', `swap: pressed buttons ${await pressed(page)}`);
    check((await bookingCards(page)).includes('Brand workshop') && !(await bookingCards(page)).includes('Release freeze'), 'swap: only the Design bookings are built');
    check((await rotaCards(page)).includes('Chloe Marsh') && !(await rotaCards(page)).includes('Priya Raman'), 'swap: the rota is the Design rota');
    await page.click('button[hx-get*="view=week"]');
    await sleep(1500);
    check(await pressed(page) === 'Design,Week view', `swap: week view pressed ${await pressed(page)}`);
    check((await bookingCards(page)).length > 0, 'swap: the week calendar has cards');
    await page.screenshot({ path: `shots/week-${width}.png`, fullPage: true });

    // Back: through the two swaps to the first view.
    await page.goBack();
    await sleep(2000);
    check(await pressed(page) === 'Design,Month view', `back: one step back restores ${await pressed(page)}`);
    check((await bookingCards(page)).length > 3 && (await rotaCards(page)).length > 1, 'back: both calendars are populated');
    await page.goBack();
    await sleep(2000);
    check(await pressed(page) === 'All teams,Month view', `back: the first view returns (${await pressed(page)})`);
    check((await bookingCards(page)).includes('Release freeze') && (await rotaCards(page)).includes('Priya Raman'), 'back: both calendars are rebuilt');
    check((await page.evaluate(gridText)).includes('Release freeze'), 'back: the bound grid still has its rows');
    await page.screenshot({ path: `shots/back-${width}.png`, fullPage: true });
    check(problems.length === 0, `no console errors or [lattice] warnings ${problems.join(' / ')}`);
    await page.close();
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
