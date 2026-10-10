/**
 * The "server": a bookings table, an on-call rota, the HTML template and the
 * route handlers. The page prints the part between the SERVER TEMPLATE markers
 * beside the demo.
 */
const bookings = [
  ['B1', 'Icon audit', 'Design', '2026-10-01', '2026-10-02'],
  ['B2', 'Capacity review', 'Platform', '2026-10-02', '2026-10-02'],
  ['B3', 'Release freeze', 'Platform', '2026-10-05', '2026-10-07'],
  ['B4', 'Design review', 'Design', '2026-10-06', '2026-10-06'],
  ['B5', 'Ticket triage clinic', 'Support', '2026-10-06', '2026-10-07'],
  ['B6', 'On-call handover', 'Support', '2026-10-08', '2026-10-08'],
  ['B7', 'Accessibility review', 'Design', '2026-10-08', '2026-10-09'],
  ['B8', 'Security patch window', 'Platform', '2026-10-09', '2026-10-09'],
  ['B9', 'Load test window', 'Platform', '2026-10-12', '2026-10-14'],
  ['B10', 'Brand workshop', 'Design', '2026-10-13', '2026-10-13'],
  ['B11', 'Knowledge base sprint', 'Support', '2026-10-12', '2026-10-14'],
  ['B12', 'Support rota change', 'Support', '2026-10-15', '2026-10-16'],
  ['B13', 'Design office hours', 'Design', '2026-10-14', '2026-10-14'],
  ['B14', 'API deprecation notice', 'Platform', '2026-10-15', '2026-10-15'],
  ['B15', 'Prototype testing', 'Design', '2026-10-16', '2026-10-16'],
  ['B16', 'Chaos day', 'Platform', '2026-10-16', '2026-10-16'],
  ['B17', 'Database migration', 'Platform', '2026-10-19', '2026-10-20'],
  ['B18', 'Usability sessions', 'Design', '2026-10-20', '2026-10-22'],
  ['B19', 'Incident review', 'Support', '2026-10-21', '2026-10-21'],
  ['B20', 'Cache rollout', 'Platform', '2026-10-21', '2026-10-22'],
  ['B21', 'Macro clean-up', 'Support', '2026-10-19', '2026-10-19'],
  ['B22', 'Customer advisory call', 'Support', '2026-10-22', '2026-10-22'],
  ['B23', 'Dark mode palette', 'Design', '2026-10-23', '2026-10-23'],
  ['B24', 'Observability training', 'Platform', '2026-10-23', '2026-10-23'],
  ['B25', 'Quarterly planning', 'Platform', '2026-10-26', '2026-10-27'],
  ['B26', 'Escalation drill', 'Support', '2026-10-27', '2026-10-27'],
  ['B27', 'Style guide handoff', 'Design', '2026-10-28', '2026-10-28'],
  ['B28', 'Illustration review', 'Design', '2026-10-26', '2026-10-26'],
  ['B29', 'Customer webinar', 'Support', '2026-10-29', '2026-10-29'],
  ['B30', 'Dependency upgrades', 'Platform', '2026-10-28', '2026-10-30'],
  ['B31', 'Month-end report', 'Support', '2026-10-30', '2026-10-30'],
  ['B32', 'Retrospective', 'Platform', '2026-10-30', '2026-10-30'],
  ['B33', 'Release planning', 'Platform', '2026-09-28', '2026-09-30'],
  ['B34', 'Research readout', 'Design', '2026-09-30', '2026-09-30'],
  ['B35', 'Holiday cover plan', 'Support', '2026-09-29', '2026-09-30'],
  ['B36', 'Pricing page launch', 'Design', '2026-11-02', '2026-11-03'],
  ['B37', 'Failover rehearsal', 'Platform', '2026-11-03', '2026-11-04'],
  ['B38', 'New starter onboarding', 'Support', '2026-11-02', '2026-11-04'],
].map(([id, title, team, start, end]) => ({ id, title, team, start, end }));

const rota = [
  ['R1', 'Ana Lopez', 'Platform', '2026-09-28', '2026-10-01'],
  ['R2', 'Ben Okafor', 'Platform', '2026-10-02', '2026-10-05'],
  ['R3', 'Ana Lopez', 'Platform', '2026-10-06', '2026-10-09'],
  ['R4', 'Ben Okafor', 'Platform', '2026-10-10', '2026-10-11'],
  ['R5', 'Priya Raman', 'Platform', '2026-10-12', '2026-10-14'],
  ['R6', 'Ben Okafor', 'Platform', '2026-10-15', '2026-10-18'],
  ['R7', 'Ana Lopez', 'Platform', '2026-10-19', '2026-10-22'],
  ['R8', 'Priya Raman', 'Platform', '2026-10-23', '2026-10-26'],
  ['R9', 'Ben Okafor', 'Platform', '2026-10-27', '2026-10-30'],
  ['R10', 'Chloe Marsh', 'Design', '2026-09-28', '2026-10-02'],
  ['R11', 'Dev Patel', 'Design', '2026-10-03', '2026-10-06'],
  ['R12', 'Hana Kimura', 'Design', '2026-10-07', '2026-10-11'],
  ['R13', 'Chloe Marsh', 'Design', '2026-10-12', '2026-10-13'],
  ['R14', 'Dev Patel', 'Design', '2026-10-14', '2026-10-18'],
  ['R15', 'Hana Kimura', 'Design', '2026-10-19', '2026-10-23'],
  ['R16', 'Chloe Marsh', 'Design', '2026-10-24', '2026-10-28'],
  ['R17', 'Dev Patel', 'Design', '2026-10-29', '2026-11-02'],
  ['R18', 'Eva Lindqvist', 'Support', '2026-09-28', '2026-10-01'],
  ['R19', 'Femi Adeyemi', 'Support', '2026-10-02', '2026-10-04'],
  ['R20', 'Gus Moreno', 'Support', '2026-10-05', '2026-10-11'],
  ['R21', 'Eva Lindqvist', 'Support', '2026-10-12', '2026-10-15'],
  ['R22', 'Femi Adeyemi', 'Support', '2026-10-16', '2026-10-18'],
  ['R23', 'Gus Moreno', 'Support', '2026-10-19', '2026-10-25'],
  ['R24', 'Eva Lindqvist', 'Support', '2026-10-26', '2026-10-29'],
  ['R25', 'Femi Adeyemi', 'Support', '2026-10-30', '2026-11-01'],
].map(([id, person, team, start, end]) => ({ id, person, team, start, end }));

// SERVER TEMPLATE START
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const teams = ['Platform', 'Design', 'Support'];

const bookingRow = (r, attrs = '') =>
  `<tr data-lattice-row="${r.id}" ${attrs}><td>${esc(r.title)}</td><td>${r.team}</td><td>${r.start}</td><td>${r.end}</td></tr>`;
const rotaRow = (r, attrs = '') =>
  `<tr data-lattice-row="${r.id}" ${attrs}><td>${esc(r.person)}</td><td>${r.start}</td><td>${r.end}</td></tr>`;

/**
 * The whole view for one team: team and view buttons, a calendar bound to a table grid, and one built straight from a table.
 * `page` is the address of the page itself, which a server knows from its own route.
 */
export function calendarFragment(team = '', view = 'month', page = location.pathname) {
  const list = team ? bookings.filter((r) => r.team === team) : bookings;
  const shifts = team ? rota.filter((r) => r.team === team) : rota;
  // Team and view are server state: each button names the pair it asks for and
  // the pressed ones are in the markup, so a history snapshot carries them.
  const button = (label, t, v, pressed) =>
    `<button hx-get="/htmx-demo/calendar/bookings?team=${t}&amp;view=${v}" hx-target="#calendar-view"
      hx-push-url="${page}?team=${t}&amp;view=${v}" aria-pressed="${pressed}">${label}</button>`;
  const filters = [
    ...['', ...teams].map((t) => button(t || 'All teams', t, view, t === team)),
    ...['month', 'week'].map((v) => button(v === 'month' ? 'Month view' : 'Week view', team, v, v === view)),
  ].join('\n  ');
  const action = (kind, label) =>
    `<button class="action" hx-post="/htmx-demo/calendar/shift" hx-vals='{"kind": "${kind}", "team": "${team}"}' hx-swap="none">${label}</button>`;
  // Both calendars post a move the same way: the event carries the id and the new dates.
  const save = `hx-post="/htmx-demo/calendar/save" hx-trigger="lattice:calendar-change"
  hx-vals='js:{id: event.detail.id, start: event.detail.start, end: event.detail.end}'
  hx-target="#save-log" hx-swap="afterbegin"`;
  const options = (v, title) =>
    `{"view":"${v}","date":"2026-10-12","firstDay":1,"timeZone":"UTC","startProperty":"start","endProperty":"end","card":{"title":"${title}"}}`;
  const anchors = (prefix, ids) => ids.map((id) => `<i id="${prefix}-${id}" data-lattice-row="${id}"></i>`).join('');
  return `<div class="view"><div class="filters">${filters}</div>
<div class="panes">
<section class="pane">
<h3>Bookings: a calendar bound to a grid ${action('booking', 'Server moves one booking')}</h3>
<div data-lattice-calendar data-lattice-bind="bookings" ${save} class="bookings-calendar is-${view}">${anchors('booking', list.map((r) => r.id))}</div>
<script type="application/json" data-lattice-config>${options(view, 'title')}</script>
</section>
<section class="pane">
<table id="bookings" data-lattice-grid>
  <thead><tr><th data-field="title">Booking</th><th data-field="team">Team</th>
    <th data-field="start" data-type="date" data-edit>Start</th><th data-field="end" data-type="date" data-edit>End</th></tr></thead>
  <tbody>
  ${list.map((r) => bookingRow(r)).join('\n  ')}
  </tbody>
</table>
<h3>On-call rota: a calendar built from a table ${action('shift', 'Server moves one shift')}</h3>
<div data-lattice-calendar ${save} class="rota-calendar">
  <table>
    <thead><tr><th data-field="person">On call</th><th data-field="start" data-type="date">From</th><th data-field="end" data-type="date">To</th></tr></thead>
    <tbody>
  ${shifts.map((r) => rotaRow(r)).join('\n  ')}
    </tbody>
  </table>
  ${anchors('shift', shifts.map((r) => r.id))}
</div>
<script type="application/json" data-lattice-config>${options('week', 'person')}</script>
</section>
</div></div>`;
}

export const routes = {
  // hx-get: the whole view for one team; both calendars are rebuilt.
  'GET /htmx-demo/calendar/bookings': ({ params }) =>
    calendarFragment(teams.includes(params.team) ? params.team : '', params.view === 'week' ? 'week' : 'month'),

  // hx-post from lattice:calendar-change: the new dates arrive as ISO strings in the calendar's timeZone.
  'POST /htmx-demo/calendar/save': ({ params }) => {
    const row = [...bookings, ...rota].find((r) => r.id === params.id);
    if (!row) return { html: '', status: 404 };
    Object.assign(row, { start: params.start.slice(0, 10), end: params.end.slice(0, 10) });
    return `<li>Saved <strong>${esc(row.title || row.person)}</strong>: ${esc(row.start)} to ${esc(row.end)}</li>`;
  },

  // hx-post with hx-swap="none": one event comes back out of band and its card moves a day.
  'POST /htmx-demo/calendar/shift': ({ params }) => {
    const booking = params.kind === 'booking';
    const all = booking ? bookings : rota;
    const list = params.team ? all.filter((r) => r.team === params.team) : all;
    const row = list[Math.floor(Math.random() * list.length)];
    const day = (iso) => new Date(Date.parse(iso) + 864e5).toISOString().slice(0, 10);
    row.start = day(row.start);
    row.end = day(row.end);
    const attrs = `id="${booking ? 'booking' : 'shift'}-${row.id}" hx-swap-oob="true"`;
    return booking ? bookingRow(row, attrs) : rotaRow(row, attrs);
  },
};
// SERVER TEMPLATE END
