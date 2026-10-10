# htmx calendar from a server-rendered table

**Live demo:** https://toclocoinc.github.io/lattice-grid-demo-htmx-calendar/

The server renders a bookings table and an on-call rota as plain `<table>`s. [Lattice Grid](https://www.latticegrid.dev/htmx/) turns the first into a calendar bound to its table grid and the second into a calendar of its own, with no mount code on the page: only markup, [htmx](https://htmx.org/) and the Lattice htmx module.

The bookings are a team calendar with 38 bookings across three teams, shown as a month or a week; the rota is a week view of who is on call. The page shows five things:

1. **Built on load.** The bookings were a server-rendered table grid and the first calendar is bound to it; the on-call rota was a plain table inside the second calendar, which replaced it on load. With JavaScript off both are still readable tables.
2. **Move an event.** Dragging a booking in the first calendar, or a shift in the second, raises a bubbling `lattice:calendar-change` event with the event's id and its new start and end; `hx-trigger="lattice:calendar-change"` posts it with `hx-post`, and the server's reply appears under the calendars.
3. **Out of band.** "Server moves one booking" and "Server moves one shift" each return one `<tr data-lattice-row>` with `hx-swap-oob`, and only that event's card moves a day, in the grid and the calendar.
4. **Swap.** Picking a team, or the Week view, runs an `hx-get`; the old calendars are torn down and both are rebuilt from the new tables.
5. **Back.** The team and the view are pressed buttons in the markup the server sends, so htmx's history snapshot carries them. Back shows the calendars you left, populated.

## The stand-in server

GitHub Pages is static, so `src/mock-server.js` answers htmx's requests to `/htmx-demo/` in the browser, from the route handlers in `src/server.js`, after a short delay so each swap is visible. Nothing leaves the page. Those handlers are exactly what a real server would do: return the team's HTML for `GET /htmx-demo/calendar/bookings`, store the new dates and reply with a line of HTML for `POST /htmx-demo/calendar/save`, and return one row out of band for `POST /htmx-demo/calendar/shift`. Port them to your own backend (Django, Rails, Laravel, Go, anything that renders HTML) and delete the stand-in.

## Run it

```
npm ci
npm run serve        # http://localhost:8000/
npm run verify       # headless Chrome check of the steps (needs Chrome)
```

The calendar and the grid load from the published `@toclocoinc/lattice-grid` package on jsDelivr; change the version in `index.html` and `package.json` to move to a newer release. On `localhost` no licence key is needed; the key in `main.js` is the public one for `toclocoinc.github.io`.

## Files

- `index.html`: the page, with the server-rendered bookings and rota already in it.
- `main.js`: installs the stand-in server, loads the Lattice htmx module and htmx.
- `src/server.js`: the demo data, the HTML template and the route handlers.
- `src/mock-server.js`: the in-browser stand-in for a backend.

Licence: MIT for this demo's code. Lattice Grid itself is commercially licensed; see [latticegrid.dev/pricing](https://www.latticegrid.dev/pricing/).
