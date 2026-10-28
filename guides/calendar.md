---
id: calendar
title: Task Calendar
blocks-html: page
blocks-css: base
blocks-js: dates, tasks, holidays, themes, ui, go
goals: Work with dates without the time-zone bug that moves tasks a day; Draw a month grid and move between months; Write repeat rules (daily, weekdays, weekly, monthly) and check off one day of a series; Calculate US holidays from their rules, including Easter and observed days; Theme the page with CSS custom properties; Export to other calendars with .ics files and Google Calendar links
prereqs: HTML, CSS and JavaScript basics (functions, arrays, objects); Template literals and array map, filter and sort; Forms and click events
---

## Session: Dates and a month grid

## Step: Dates you can trust
time: 15

Welcome! In this guide you'll rebuild my [Task Calendar](https://theoyanvno.github.io/task-calendar/): a to-do list and a calendar in one, with repeating tasks, drag-and-drop rescheduling, US holidays, a theme for every month, and buttons that send tasks to your phone's calendar or to Google for email reminders.

A calendar app lives or dies by its dates, and JavaScript dates have a famous trap:

```svg new Date("2026-10-28") is midnight UTC, which is still October 27 in the Americas
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 150" font-family="sans-serif"><rect x="10" y="15" width="200" height="56" rx="6" fill="#fde2e1" stroke="#b91c1c"/><text x="110" y="35" text-anchor="middle" font-size="11">new Date('2026-10-28')</text><text x="110" y="51" text-anchor="middle" font-size="11">= midnight UTC</text><text x="110" y="65" text-anchor="middle" font-size="11" fill="#b91c1c">= Oct 27, 8 PM in Florida</text><rect x="220" y="15" width="200" height="56" rx="6" fill="#bbf7d0" stroke="#15803d"/><text x="320" y="35" text-anchor="middle" font-size="11">new Date(2026, 9, 28)</text><text x="320" y="51" text-anchor="middle" font-size="11">= midnight where you are</text><text x="320" y="65" text-anchor="middle" font-size="11" fill="#15803d">= Oct 28, always</text><text x="215" y="100" text-anchor="middle" font-size="12">store the day as text: '2026-10-28'</text><text x="215" y="118" text-anchor="middle" font-size="11" fill="#475569">and only turn it into a Date with the local (year, month, day) form</text><text x="215" y="136" text-anchor="middle" font-size="11" fill="#475569">keys also sort and compare correctly as plain strings</text></svg>
```

`new Date('2026-10-28')` treats the text as **midnight UTC**. In Florida that's 8 PM on October 27, so a task saved for the 28th shows up on the 27th. The fix used throughout this app:

- Store every day as a **key**, a string like `'2026-10-28'`.
- Turn a key into a `Date` only with `new Date(year, month - 1, day)`, which is **local** midnight. (Months count from 0 in this form, hence `m - 1`.)
- Turn a `Date` back into a key with `toKey()`, using the local `getFullYear()`, `getMonth()` and `getDate()`.

Keys have a bonus: because the year comes first and the parts are zero-padded, they **sort and compare as plain strings**. `'2026-10-09' < '2026-10-10'` is true, so "is this before today?" is just `<`.

| Helper | Example | Result |
|---|---|---|
| `toKey(new Date(2026, 9, 28))` | a Date | `'2026-10-28'` |
| `fromKey('2026-10-28')` | a key | local midnight, Oct 28 |
| `addDays('2026-12-30', 3)` | key + days | `'2027-01-02'` |
| `daysBetween('2026-03-07', '2026-03-09')` | two keys | `2` |

`addDays` lets `setDate()` do the hard part: setting day 33 of December rolls into January by itself. `daysBetween` divides milliseconds by the length of a day and **rounds**, because the day the clocks change is 23 or 25 hours long.

### Try it

The page shows today's date, and the console shows the three examples from the `go` block.

check: js | dates become keys | /const\s+toKey\s*=/
check: js | keys become local dates | /new\s+Date\(\s*y\s*,\s*m\s*-\s*1\s*,\s*d\s*\)/ | return new Date(y, m - 1, d);
check: js | add days to a key | /const\s+addDays\s*=/
check: js | days between two keys, rounded | /Math\.round\(.*\/\s*86400000\s*\)/

quiz: Why store days as "2026-10-28" strings instead of Date objects?
- [ ] Strings use less memory
- [x] A string has no time or time zone, so it can never slide to the day before, and it sorts as text
- [ ] Date objects can't be saved
why: The day stays the day; only display code turns it into a local Date.
quiz: Why does daysBetween() round the result?
- [x] To handle the 23- or 25-hour day when daylight saving time changes
- [ ] Because dates are random
- [ ] To make weeks start on Sunday
why: Without rounding, March 7 to March 9 could come out as 1.958 days.

```html page
<header class="top">
  <div class="brand"><h1>Task Calendar</h1> <span id="themeBadge" class="theme-badge" hidden></span></div>
  <div class="top-actions">
    <button id="seasonal" aria-label="Monthly holiday theme" aria-pressed="true">🎨</button>
    <button id="export">Export .ics</button>
  </div>
</header>

<main class="layout">
  <section class="calendar" aria-label="Calendar">
    <div class="cal-head">
      <button id="prevMonth" aria-label="Previous month">‹</button>
      <h2 id="monthLabel"></h2>
      <button id="nextMonth" aria-label="Next month">›</button>
      <button id="today">Today</button>
    </div>
    <div class="weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
    <div id="grid" class="grid"></div>
    <p class="hint">Tip: drag a task onto another day to reschedule it. Shaded days are federal holidays.</p>
  </section>

  <aside class="side">
    <section class="panel">
      <h2 id="dayLabel"></h2>
      <p id="dayHoliday" class="day-holiday" hidden></p>
      <form id="addForm" class="add">
        <input id="title" placeholder="Add a task…" required autocomplete="off" aria-label="Task title">
        <input id="location" placeholder="📍 Location (optional)" autocomplete="off" maxlength="200" aria-label="Location (optional)">
        <div class="row">
          <input id="time" type="time" aria-label="Time (optional)">
          <select id="priority" aria-label="Priority">
            <option value="high">High</option><option value="medium" selected>Medium</option><option value="low">Low</option>
          </select>
          <select id="repeat" aria-label="Repeat">
            <option value="none">Once</option><option value="daily">Daily</option><option value="weekdays">Weekdays</option>
            <option value="weekly">Weekly</option><option value="monthly">Monthly</option>
          </select>
          <button class="primary">Add</button>
        </div>
      </form>
      <ul id="dayTasks" class="tasks"></ul>
    </section>

    <section class="panel" aria-labelledby="monthTitle">
      <h2 id="monthTitle">This month</h2>
      <div id="overdueAlert"></div>
      <ul id="monthList" class="highlights"></ul>
    </section>
  </aside>
</main>
```

```css base
* { box-sizing: border-box; }
:root { --accent: #2563eb; --tint: #e8eefc; --bg: #f6f7fb; --panel: #fff; --text: #1c2430; --muted: #6b7280; --line: #e2e6ee; }
/* The monthly theme: JavaScript sets --theme-accent, --theme-tint and --theme-pattern, and adds the .seasonal class */
:root.seasonal { --accent: var(--theme-accent); --tint: var(--theme-tint); }
:root.seasonal .calendar { background-color: var(--tint); background-image: var(--theme-pattern); }
body { margin: 0; font: 15px/1.4 system-ui, sans-serif; background: var(--bg); color: var(--text); }
button, input, select { font: inherit; }
[hidden] { display: none !important; }

.top { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--accent); color: #fff; }
.top h1 { margin: 0; font-size: 1.25rem; display: inline; }
.theme-badge { margin-left: 8px; font-size: 13px; background: rgba(255, 255, 255, .22); border-radius: 999px; padding: 2px 8px; }
.top button { background: rgba(255, 255, 255, .15); color: #fff; border: 1px solid rgba(255, 255, 255, .45); border-radius: 8px; padding: 6px 10px; cursor: pointer; }

.layout { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 16px; padding: 16px; max-width: 1200px; margin: 0 auto; }
@media (max-width: 800px) { .layout { grid-template-columns: 1fr; } }
.calendar, .panel { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 12px; }
.cal-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.cal-head h2 { flex: 1; margin: 0; font-size: 1.1rem; }
.cal-head button, .panel button { border: 1px solid var(--line); background: var(--panel); border-radius: 8px; padding: 4px 10px; cursor: pointer; }

/* 7 equal columns: minmax(0, 1fr) lets long task names shrink instead of stretching the grid */
.weekdays, .grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }
.weekdays span { text-align: center; font-size: 12px; color: var(--muted); }
.day { min-height: 82px; display: flex; flex-direction: column; gap: 2px; padding: 4px; text-align: left; border: 1px solid var(--line);
       border-radius: 8px; background: rgba(255, 255, 255, .9); cursor: pointer; overflow: hidden; color: var(--text); }
.day .num { font-weight: 600; font-size: 13px; align-self: flex-start; }
.day.other { opacity: .45; }
.day.today .num { background: var(--accent); color: #fff; border-radius: 999px; padding: 0 6px; }
.day.selected { outline: 2px solid var(--accent); }
.day.dayoff { background: #eef2f7; }
.day.drop { outline: 2px dashed var(--accent); }
.holiday { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip { font-size: 11px; border-radius: 4px; padding: 1px 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff; }
.chip.high { background: #dc2626; } .chip.medium { background: #b45309; } .chip.low { background: #15803d; }
.chip.done { opacity: .45; text-decoration: line-through; }
.chip[draggable="true"] { cursor: grab; }
.more { font-size: 11px; color: var(--muted); }
.hint { color: var(--muted); font-size: 13px; margin: 8px 0 0; }

.side { display: grid; gap: 16px; align-content: start; }
.panel h2 { margin: 0 0 8px; font-size: 1.05rem; }
.day-holiday { margin: 0 0 8px; font-size: 13px; }
.add { display: grid; gap: 6px; margin-bottom: 10px; }
.add input, .add select { padding: 6px 8px; border: 1px solid var(--line); border-radius: 8px; }
.add .row { display: flex; flex-wrap: wrap; gap: 6px; }
.panel .primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.tasks, .highlights { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.task { display: flex; align-items: flex-start; gap: 8px; padding: 6px 8px; border-left: 4px solid var(--line); background: var(--bg); border-radius: 6px; }
.task.high { border-color: #dc2626; } .task.medium { border-color: #b45309; } .task.low { border-color: #15803d; }
.task.completed .t-title { text-decoration: line-through; opacity: .55; }
.t-body { flex: 1; display: grid; min-width: 0; }
.t-meta, .t-loc { font-size: 12px; color: var(--muted); }
.mail { font-size: 12px; white-space: nowrap; color: var(--accent); }
.del { border: 0 !important; background: none !important; color: var(--muted); }
.empty { color: var(--muted); font-size: 14px; }
.overdue { margin-bottom: 8px; color: #b91c1c; }
.hl { width: 100%; display: flex; gap: 10px; text-align: left; align-items: center; }
.hl-date { display: grid; text-align: center; font-size: 11px; color: var(--muted); min-width: 34px; }
.hl-date b { font-size: 16px; color: var(--text); }
.hl-body { display: grid; }
.hl-meta { font-size: 12px; color: var(--muted); }
.hl.past { opacity: .55; }
```

```js dates
// Days are stored as 'YYYY-MM-DD' strings in LOCAL time ("keys").
const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);               // the (year, month, day) form is local time; months count from 0
};

const addDays = (key, n) => {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);                 // setDate rolls over months and years by itself
  return toKey(d);
};

// Rounded, because the day daylight saving time changes is 23 or 25 hours long.
const daysBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86400000);
```

```js ui
const $ = (id) => document.getElementById(id);
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);

$('dayLabel').textContent = `Today, ${fmtDay(todayKey)}`;
```

```js go
console.log(addDays('2026-12-30', 3));                 // 2027-01-02: rolls into the next year
console.log(daysBetween('2026-03-07', '2026-03-09'));   // 2, even across the daylight saving change
console.log('2026-10-09' < '2026-10-10');               // true: keys sort as plain text
```

## Step: A month on the screen
time: 15

A month view always shows **6 rows of 7 days**, starting on a Sunday. Most months need only 5 rows, but always using 42 squares means the calendar never changes height when you go to the next month.

```svg October 2026 starts on a Thursday, so the grid begins on Sunday, September 27
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160" font-family="sans-serif"><text x="36" y="14" text-anchor="middle" font-size="10" fill="#475569">S</text><text x="68" y="14" text-anchor="middle" font-size="10" fill="#475569">M</text><text x="100" y="14" text-anchor="middle" font-size="10" fill="#475569">T</text><text x="132" y="14" text-anchor="middle" font-size="10" fill="#475569">W</text><text x="164" y="14" text-anchor="middle" font-size="10" fill="#475569">T</text><text x="196" y="14" text-anchor="middle" font-size="10" fill="#475569">F</text><text x="228" y="14" text-anchor="middle" font-size="10" fill="#475569">S</text><rect x="20" y="20" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="35" y="34" text-anchor="middle" font-size="10" fill="#94a3b8">27</text><rect x="52" y="20" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="67" y="34" text-anchor="middle" font-size="10" fill="#94a3b8">28</text><rect x="84" y="20" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="99" y="34" text-anchor="middle" font-size="10" fill="#94a3b8">29</text><rect x="116" y="20" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="131" y="34" text-anchor="middle" font-size="10" fill="#94a3b8">30</text><rect x="148" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="163" y="34" text-anchor="middle" font-size="10" fill="#1c2430">1</text><rect x="180" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="34" text-anchor="middle" font-size="10" fill="#1c2430">2</text><rect x="212" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="34" text-anchor="middle" font-size="10" fill="#1c2430">3</text><rect x="20" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="56" text-anchor="middle" font-size="10" fill="#1c2430">4</text><rect x="52" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="56" text-anchor="middle" font-size="10" fill="#1c2430">5</text><rect x="84" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="56" text-anchor="middle" font-size="10" fill="#1c2430">6</text><rect x="116" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="56" text-anchor="middle" font-size="10" fill="#1c2430">7</text><rect x="148" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="163" y="56" text-anchor="middle" font-size="10" fill="#1c2430">8</text><rect x="180" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="56" text-anchor="middle" font-size="10" fill="#1c2430">9</text><rect x="212" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="56" text-anchor="middle" font-size="10" fill="#1c2430">10</text><rect x="20" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="78" text-anchor="middle" font-size="10" fill="#1c2430">11</text><rect x="52" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="78" text-anchor="middle" font-size="10" fill="#1c2430">12</text><rect x="84" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="78" text-anchor="middle" font-size="10" fill="#1c2430">13</text><rect x="116" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="78" text-anchor="middle" font-size="10" fill="#1c2430">14</text><rect x="148" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="163" y="78" text-anchor="middle" font-size="10" fill="#1c2430">15</text><rect x="180" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="78" text-anchor="middle" font-size="10" fill="#1c2430">16</text><rect x="212" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="78" text-anchor="middle" font-size="10" fill="#1c2430">17</text><rect x="20" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="100" text-anchor="middle" font-size="10" fill="#1c2430">18</text><rect x="52" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="100" text-anchor="middle" font-size="10" fill="#1c2430">19</text><rect x="84" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="100" text-anchor="middle" font-size="10" fill="#1c2430">20</text><rect x="116" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="100" text-anchor="middle" font-size="10" fill="#1c2430">21</text><rect x="148" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="163" y="100" text-anchor="middle" font-size="10" fill="#1c2430">22</text><rect x="180" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="100" text-anchor="middle" font-size="10" fill="#1c2430">23</text><rect x="212" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="100" text-anchor="middle" font-size="10" fill="#1c2430">24</text><rect x="20" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="122" text-anchor="middle" font-size="10" fill="#1c2430">25</text><rect x="52" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="122" text-anchor="middle" font-size="10" fill="#1c2430">26</text><rect x="84" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="122" text-anchor="middle" font-size="10" fill="#1c2430">27</text><rect x="116" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="122" text-anchor="middle" font-size="10" fill="#1c2430">28</text><rect x="148" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="163" y="122" text-anchor="middle" font-size="10" fill="#1c2430">29</text><rect x="180" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="122" text-anchor="middle" font-size="10" fill="#1c2430">30</text><rect x="212" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="122" text-anchor="middle" font-size="10" fill="#1c2430">31</text><rect x="20" y="130" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="35" y="144" text-anchor="middle" font-size="10" fill="#94a3b8">1</text><rect x="52" y="130" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="67" y="144" text-anchor="middle" font-size="10" fill="#94a3b8">2</text><rect x="84" y="130" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="99" y="144" text-anchor="middle" font-size="10" fill="#94a3b8">3</text><rect x="116" y="130" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="131" y="144" text-anchor="middle" font-size="10" fill="#94a3b8">4</text><rect x="148" y="130" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="163" y="144" text-anchor="middle" font-size="10" fill="#94a3b8">5</text><rect x="180" y="130" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="195" y="144" text-anchor="middle" font-size="10" fill="#94a3b8">6</text><rect x="212" y="130" width="30" height="20" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><text x="227" y="144" text-anchor="middle" font-size="10" fill="#94a3b8">7</text><text x="260" y="40" font-size="11">October 2026</text><text x="260" y="58" font-size="11" fill="#475569">the 1st is a Thursday,</text><text x="260" y="72" font-size="11" fill="#475569">so the grid starts on</text><text x="260" y="86" font-size="11" fill="#475569">Sunday, September 27</text><text x="260" y="114" font-size="11" fill="#475569">always 6 rows x 7 = 42 days,</text><text x="260" y="128" font-size="11" fill="#475569">so the page never jumps</text><text x="260" y="142" font-size="11" fill="#475569">between months</text></svg>
```

`monthGrid(year, month)` finds the first of the month, and `getDay()` says which weekday it is (0 = Sunday). Going back that many days gives the Sunday the grid starts on: `new Date(year, month, 1 - first.getDay())`. Day numbers below 1 roll back into the previous month, just like day 33 rolls forward. Then `Array.from({ length: 42 }, …)` makes the 42 keys.

`renderCalendar()` turns each key into a `<button>` with classes:

| Class | When |
|---|---|
| `other` | the day belongs to the month before or after (shown faded) |
| `today` | it's today (the number gets a colored circle) |
| `selected` | it's the day you clicked |

The ‹ and › buttons change `viewMonth`, wrapping from 0 (January) to 11 (December) and changing the year. Clicking a faded day selects it and jumps to its month. **Today** comes back to the present.

### Try it

Go forward to a month that starts on a Saturday: the grid still has 42 days. Click a faded day.

check: js | a monthGrid() function | /function\s+monthGrid\s*\(/
check: js | always 42 days | /length:\s*42/
check: js | days outside the month are marked | /d\.getMonth\(\)\s*!==\s*viewMonth/
check: js | the previous-month button | /\$\(\s*['"]prevMonth['"]\s*\)\.onclick/

quiz: Why always draw 42 days, even for a month that fits in 35?
- [x] Six rows always fit any month, and the calendar keeps the same height from month to month
- [ ] Browsers need 42 buttons
- [ ] To show more holidays
why: A month can span up to 6 weeks; a fixed grid avoids the page jumping.
quiz: What does new Date(2026, 9, 1 - 4) give, if October 1 is a Thursday (getDay() = 4)?
- [ ] October 4
- [x] Sunday, September 27
- [ ] An error
why: Day -3 of October rolls back into September: the 30th minus 3 is the 27th.

```js dates
// Days are stored as 'YYYY-MM-DD' strings in LOCAL time ("keys").
const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);               // the (year, month, day) form is local time; months count from 0
};

const addDays = (key, n) => {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);                 // setDate rolls over months and years by itself
  return toKey(d);
};

// Rounded, because the day daylight saving time changes is 23 or 25 hours long.
const daysBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86400000);

// The 42 days (6 weeks x 7) shown for a month, starting on the Sunday on or before the 1st.
function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => toKey(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)));
}
```

```js ui
const $ = (id) => document.getElementById(id);
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);
let selected = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();

function renderCalendar() {
  $('monthLabel').textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  $('grid').innerHTML = monthGrid(viewYear, viewMonth).map((key) => {
    const d = fromKey(key);
    const cls = ['day', d.getMonth() !== viewMonth && 'other', key === todayKey && 'today', key === selected && 'selected'].filter(Boolean).join(' ');
    return `<button class="${cls}" data-key="${key}" aria-label="${fmtDay(key)}"><span class="num">${d.getDate()}</span></button>`;
  }).join('');
}

function renderDay() {
  $('dayLabel').textContent = selected === todayKey ? `Today, ${fmtDay(selected, { month: 'long', day: 'numeric' })}` : fmtDay(selected);
}

function render() { renderCalendar(); renderDay(); }

// Clicking a day selects it (and moves to its month if it's one of the grey days)
$('grid').addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  selected = day.dataset.key;
  const d = fromKey(selected);
  if (d.getMonth() !== viewMonth) { viewMonth = d.getMonth(); viewYear = d.getFullYear(); }
  render();
});
$('prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
$('nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
$('today').onclick = () => { selected = todayKey; viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); render(); };
```

```js go
render();
```

## Step: Tasks on the calendar
time: 20

A task is a plain object made by `newTask()`, which checks its input: a task needs a title and a date in key form (`/^\d{4}-\d{2}-\d{2}$/`), and the title is trimmed. Every task gets a random id.

| Field | Example |
|---|---|
| `title` | `'Call the dentist'` |
| `date` | `'2026-10-28'` |
| `time` | `'09:30'` or `''` |
| `priority` | `'high'`, `'medium'` or `'low'` |
| `repeat` | `'none'` (for now) |

`tasksOn(tasks, key)` returns the tasks on one day, **sorted**: by time first (tasks without a time get `'99'`, so they go last), then by priority. The `||` in the sort means "if the times are equal, compare priorities".

The calendar shows up to three colored **chips** per day (red, amber, green for priority) and "+2 more" after that. The side panel lists the selected day's tasks, and the form adds a task to that day.

**Escaping.** Task titles are typed by people and go into HTML, so `esc()` replaces `<`, `>`, `&` and `"` with their HTML codes. Without it, a task called `<img src=x onerror=alert(1)>` would run code. Every bit of user text goes through `esc()`.

### Try it

Click a day, add a few tasks with different times and priorities, and watch them sort. Add a task called `<b>bold?</b>`: it shows the tags as text instead of making anything bold.

check: js | a newTask() function | /function\s+newTask\s*\(/
check: js | a task needs a title | /throw\s+new\s+Error\(\s*['"]A task needs a title['"]/
check: js | tasks on a day, sorted | /function\s+tasksOn\s*\(/
check: js | user text is escaped | /const\s+esc\s*=/
check: js | the add form | /\$\(\s*['"]addForm['"]\s*\)\.addEventListener\(\s*['"]submit['"]/

quiz: Why do tasks without a time sort as "99"?
- [x] "99" comes after every real time like "09:30" or "23:00", so untimed tasks go to the end of the day
- [ ] 99 means high priority
- [ ] Times are stored as numbers
why: Comparing strings, "99" is larger than any "HH:MM" time.
quiz: What would happen without esc() if someone named a task <img src=x onerror=alert(1)>?
- [ ] Nothing, it's just text
- [x] The browser would make it a real image tag and run the onerror code
- [ ] The task would be deleted
why: innerHTML turns text into elements; escaping keeps it as text.

```js tasks
// Task logic: plain functions on plain objects, no page code.
function newTask({ title, date, time = '', priority = 'medium', repeat = 'none' }) {
  if (!title?.trim()) throw new Error('A task needs a title');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('A task needs a date');
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return { id, title: title.trim(), date, time, priority, repeat, done: false, doneDates: [] };
}

// For now a task is on exactly one day. Repeats come next session.
const occursOn = (task, key) => key === task.date;

// All tasks on one day: by time (tasks without one last), then priority.
function tasksOn(tasks, key) {
  const rank = { high: 0, medium: 1, low: 2 };
  return tasks
    .filter((t) => occursOn(t, key))
    .sort((a, b) => (a.time || '99').localeCompare(b.time || '99') || rank[a.priority] - rank[b.priority]);
}
```

```js ui
const $ = (id) => document.getElementById(id);
// Task titles are typed by people, so escape them before they go into HTML.
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);
let selected = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
const fmtTime = (t) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '');

// A few example tasks so the calendar isn't empty
let tasks = [
  newTask({ title: 'Welcome! Click a day to add tasks', date: todayKey, priority: 'high' }),
  newTask({ title: 'Morning workout', date: todayKey, time: '06:30', priority: 'low' }),
  newTask({ title: 'Review the week', date: addDays(todayKey, 2) }),
];

function renderCalendar() {
  $('monthLabel').textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  $('grid').innerHTML = monthGrid(viewYear, viewMonth).map((key) => {
    const d = fromKey(key);
    const list = tasksOn(tasks, key);
    const cls = ['day', d.getMonth() !== viewMonth && 'other', key === todayKey && 'today', key === selected && 'selected'].filter(Boolean).join(' ');
    const chips = list.slice(0, 3).map((t) => `<span class="chip ${t.priority}" data-id="${t.id}">${esc(t.title)}</span>`).join('');
    const more = list.length > 3 ? `<span class="more">+${list.length - 3} more</span>` : '';
    return `<button class="${cls}" data-key="${key}" aria-label="${fmtDay(key)}, ${list.length} tasks"><span class="num">${d.getDate()}</span>${chips}${more}</button>`;
  }).join('');
}

const taskItem = (t, key) => `
  <li class="task ${t.priority}">
    <span class="t-body">
      <span class="t-title">${esc(t.title)}</span>
      <span class="t-meta">${[fmtTime(t.time)].filter(Boolean).join(' · ')}</span>
    </span>
  </li>`;

function renderDay() {
  $('dayLabel').textContent = selected === todayKey ? `Today, ${fmtDay(selected, { month: 'long', day: 'numeric' })}` : fmtDay(selected);
  $('dayTasks').innerHTML = tasksOn(tasks, selected).map((t) => taskItem(t, selected)).join('')
    || '<li class="empty">No tasks. Enjoy the free time, or add one above.</li>';
}

function render() { renderCalendar(); renderDay(); }

// Clicking a day selects it (and moves to its month if it's one of the grey days)
$('grid').addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  selected = day.dataset.key;
  const d = fromKey(selected);
  if (d.getMonth() !== viewMonth) { viewMonth = d.getMonth(); viewYear = d.getFullYear(); }
  render();
});
$('prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
$('nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
$('today').onclick = () => { selected = todayKey; viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); render(); };

$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push(newTask({ title: $('title').value, date: selected, time: $('time').value, priority: $('priority').value }));
  $('title').value = ''; $('time').value = '';
  render();
});
```

## Session: Repeats and checking off

## Step: Repeating tasks
time: 20

A repeating task is stored **once**, with its first date and a rule. `occursOn(task, key)` answers "is it on this day?" for any day, so nothing has to be copied for every week of the year:

| Rule | On this day if… |
|---|---|
| `daily` | the day is on or after the start |
| `weekdays` | `getDay()` is 1-5 (Monday to Friday) |
| `weekly` | the days since the start divide by 7: `daysBetween(start, key) % 7 === 0` |
| `monthly` | the day of the month matches the start's |
| `none` | it's exactly the task's date |

Every rule starts with `if (key < task.date) return false`: nothing repeats backward in time. That works because keys compare as strings.

**The 31st.** A monthly task started on January 31 has no 31st in February, April, June, September or November. So the rule compares with `Math.min(start day, last day of this month)`, and the task lands on the last day of short months:

```svg A monthly task on the 31st lands on the last day of shorter months
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 130" font-family="sans-serif"><rect x="15" y="20" width="92" height="56" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="61" y="40" text-anchor="middle" font-size="12" font-weight="700">Jan</text><text x="61" y="58" text-anchor="middle" font-size="11">the 31st</text><rect x="117" y="20" width="92" height="56" rx="6" fill="#fef9c3" stroke="#475569"/><text x="163" y="40" text-anchor="middle" font-size="12" font-weight="700">Feb</text><text x="163" y="58" text-anchor="middle" font-size="11">the 28th (last day)</text><rect x="219" y="20" width="92" height="56" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="265" y="40" text-anchor="middle" font-size="12" font-weight="700">Mar</text><text x="265" y="58" text-anchor="middle" font-size="11">the 31st</text><rect x="321" y="20" width="92" height="56" rx="6" fill="#fef9c3" stroke="#475569"/><text x="367" y="40" text-anchor="middle" font-size="12" font-weight="700">Apr</text><text x="367" y="58" text-anchor="middle" font-size="11">the 30th (last day)</text><text x="215" y="100" text-anchor="middle" font-size="12">a monthly task started on January 31</text><text x="215" y="118" text-anchor="middle" font-size="11" fill="#475569">Math.min(start day, last day of this month) keeps it in every month</text></svg>
```

`new Date(year, month + 1, 0)` is the trick for "last day of this month": day 0 of next month is the day before its 1st.

The form's Repeat menu now sets the rule, and the task list shows "Every week", "Weekdays" and so on.

### Try it

Add a weekly task: it appears on the same weekday every week as you click ›. Add a monthly task on the 31st and go to November.

check: js | weekdays only | /case\s+['"]weekdays['"]/
check: js | every 7 days | /daysBetween\(\s*task\.date\s*,\s*key\s*\)\s*%\s*7\s*===\s*0/
check: js | the 31st fits short months | /Math\.min\(\s*start\.getDate\(\)\s*,\s*lastDay\s*\)/
check: js | the form sets the repeat rule | /repeat:\s*\$\(\s*['"]repeat['"]\s*\)\.value/

quiz: Why is a repeating task stored once with a rule, instead of a copy for every day?
- [x] A daily task would need endless copies; a rule answers for any day, past or future
- [ ] Copies can't be sorted
- [ ] Rules are faster to type
why: occursOn() works out each day on demand, so a series never runs out.
quiz: What is new Date(2026, 2, 0)?
- [ ] March 1
- [x] February 28, 2026: day 0 of March is the last day of February
- [ ] An invalid date
why: Day 0 rolls back one day from the 1st, which gives the last day of the month before.

```js tasks
// Task logic: plain functions on plain objects, no page code.
function newTask({ title, date, time = '', priority = 'medium', repeat = 'none' }) {
  if (!title?.trim()) throw new Error('A task needs a title');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('A task needs a date');
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return { id, title: title.trim(), date, time, priority, repeat, done: false, doneDates: [] };
}

// Does a (possibly repeating) task fall on this day? Keys compare correctly as strings.
function occursOn(task, key) {
  if (key < task.date) return false;
  switch (task.repeat) {
    case 'daily': return true;
    case 'weekdays': {
      const day = fromKey(key).getDay();
      return day > 0 && day < 6;
    }
    case 'weekly': return daysBetween(task.date, key) % 7 === 0;
    case 'monthly': {
      const start = fromKey(task.date);
      const d = fromKey(key);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();   // day 0 of next month = last day of this one
      return d.getDate() === Math.min(start.getDate(), lastDay);                  // the 31st becomes the 30th or 28th in short months
    }
    default: return key === task.date;
  }
}

// All tasks on one day: by time (tasks without one last), then priority.
function tasksOn(tasks, key) {
  const rank = { high: 0, medium: 1, low: 2 };
  return tasks
    .filter((t) => occursOn(t, key))
    .sort((a, b) => (a.time || '99').localeCompare(b.time || '99') || rank[a.priority] - rank[b.priority]);
}
```

```js ui
const $ = (id) => document.getElementById(id);
// Task titles are typed by people, so escape them before they go into HTML.
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);
let selected = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
const fmtTime = (t) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '');
const repeatLabel = { daily: 'Every day', weekdays: 'Weekdays', weekly: 'Every week', monthly: 'Every month' };

// A few example tasks so the calendar isn't empty
let tasks = [
  newTask({ title: 'Welcome! Click a day to add tasks', date: todayKey, priority: 'high' }),
  newTask({ title: 'Morning workout', date: todayKey, time: '06:30', repeat: 'weekdays', priority: 'low' }),
  newTask({ title: 'Review the week', date: addDays(todayKey, 2), repeat: 'weekly' }),
];

function renderCalendar() {
  $('monthLabel').textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  $('grid').innerHTML = monthGrid(viewYear, viewMonth).map((key) => {
    const d = fromKey(key);
    const list = tasksOn(tasks, key);
    const cls = ['day', d.getMonth() !== viewMonth && 'other', key === todayKey && 'today', key === selected && 'selected'].filter(Boolean).join(' ');
    const chips = list.slice(0, 3).map((t) => `<span class="chip ${t.priority}" data-id="${t.id}">${esc(t.title)}</span>`).join('');
    const more = list.length > 3 ? `<span class="more">+${list.length - 3} more</span>` : '';
    return `<button class="${cls}" data-key="${key}" aria-label="${fmtDay(key)}, ${list.length} tasks"><span class="num">${d.getDate()}</span>${chips}${more}</button>`;
  }).join('');
}

const taskItem = (t, key) => `
  <li class="task ${t.priority}">
    <span class="t-body">
      <span class="t-title">${esc(t.title)}</span>
      <span class="t-meta">${[fmtTime(t.time), repeatLabel[t.repeat]].filter(Boolean).join(' · ')}</span>
    </span>
  </li>`;

function renderDay() {
  $('dayLabel').textContent = selected === todayKey ? `Today, ${fmtDay(selected, { month: 'long', day: 'numeric' })}` : fmtDay(selected);
  $('dayTasks').innerHTML = tasksOn(tasks, selected).map((t) => taskItem(t, selected)).join('')
    || '<li class="empty">No tasks. Enjoy the free time, or add one above.</li>';
}

function render() { renderCalendar(); renderDay(); }

// Clicking a day selects it (and moves to its month if it's one of the grey days)
$('grid').addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  selected = day.dataset.key;
  const d = fromKey(selected);
  if (d.getMonth() !== viewMonth) { viewMonth = d.getMonth(); viewYear = d.getFullYear(); }
  render();
});
$('prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
$('nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
$('today').onclick = () => { selected = todayKey; viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); render(); };

$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push(newTask({ title: $('title').value, date: selected, time: $('time').value, priority: $('priority').value, repeat: $('repeat').value }));
  $('title').value = ''; $('time').value = ''; $('repeat').value = 'none';
  render();
});
```

## Step: Done, one day at a time
time: 15

Checking off a one-time task is easy: flip `done`. But checking off today's workout shouldn't check off tomorrow's. So repeating tasks keep a list of **done days** instead:

| Task | Stored as done | `isDone(task, key)` |
|---|---|---|
| one-time | `done: true` | `task.done` |
| repeating | `doneDates: ['2026-10-26', '2026-10-27']` | `task.doneDates.includes(key)` |

`toggle(task, key)` adds or removes that day using a `Set` (so a day can't be listed twice), then turns it back into a sorted array. `tasksOn()` now adds `completed` to each task for that day and sorts unfinished tasks first.

Each task in the list gets a checkbox and a ✕. Instead of a listener on every one, a single `change` listener and a single `click` listener on the whole `document` read `data-toggle` and `data-del` from whatever was clicked. Deleting a repeating task removes the whole series, so it asks first.

**Overdue.** `overdue()` finds unfinished one-time tasks from before today. They show at the top of the "This month" panel in a `<details>` box that can be folded away.

### Try it

Check off today's workout, then click tomorrow: it's not done there. Add a task for last week and leave it unchecked: it's overdue.

check: js | a toggle() function | /function\s+toggle\s*\(/
check: js | one day of a series at a time | /set\.has\(\s*key\s*\)\s*\?\s*set\.delete\(\s*key\s*\)\s*:\s*set\.add\(\s*key\s*\)/
check: js | overdue tasks | /const\s+overdue\s*=/
check: js | checkboxes in the task list | /data-toggle=/

quiz: Why does a repeating task keep doneDates instead of a single done flag?
- [x] So checking off one day doesn't check off every other day of the series
- [ ] Flags can't be saved
- [ ] To count how many times it repeats
why: Each day of a series is done or not on its own.
quiz: Why use one change listener on the document instead of one per checkbox?
- [x] The list is redrawn after every change, and one listener keeps working for every new checkbox
- [ ] Checkboxes can't have listeners
- [ ] It's required by <details>
why: That's event delegation: the listener reads data-toggle from whatever element changed.

```js tasks
// Task logic: plain functions on plain objects, no page code.
function newTask({ title, date, time = '', priority = 'medium', repeat = 'none' }) {
  if (!title?.trim()) throw new Error('A task needs a title');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('A task needs a date');
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return { id, title: title.trim(), date, time, priority, repeat, done: false, doneDates: [] };
}

// Does a (possibly repeating) task fall on this day? Keys compare correctly as strings.
function occursOn(task, key) {
  if (key < task.date) return false;
  switch (task.repeat) {
    case 'daily': return true;
    case 'weekdays': {
      const day = fromKey(key).getDay();
      return day > 0 && day < 6;
    }
    case 'weekly': return daysBetween(task.date, key) % 7 === 0;
    case 'monthly': {
      const start = fromKey(task.date);
      const d = fromKey(key);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();   // day 0 of next month = last day of this one
      return d.getDate() === Math.min(start.getDate(), lastDay);                  // the 31st becomes the 30th or 28th in short months
    }
    default: return key === task.date;
  }
}

// A repeating task is done one day at a time, so it keeps a list of done days.
const isDone = (task, key) => (task.repeat !== 'none' ? task.doneDates.includes(key) : task.done);

// All tasks on one day, each marked completed or not: unfinished first, then by time, then priority.
function tasksOn(tasks, key) {
  const rank = { high: 0, medium: 1, low: 2 };
  return tasks
    .filter((t) => occursOn(t, key))
    .map((t) => ({ ...t, completed: isDone(t, key) }))
    .sort((a, b) => a.completed - b.completed || (a.time || '99').localeCompare(b.time || '99') || rank[a.priority] - rank[b.priority]);
}

// Checks a task off (or back on). A repeating task changes only the day you clicked.
function toggle(task, key) {
  if (task.repeat !== 'none') {
    const set = new Set(task.doneDates);
    set.has(key) ? set.delete(key) : set.add(key);
    return { ...task, doneDates: [...set].sort() };
  }
  return { ...task, done: !task.done };
}

// Unfinished one-time tasks from before today, oldest first.
const overdue = (tasks, today) =>
  tasks.filter((t) => t.repeat === 'none' && !t.done && t.date < today).sort((a, b) => a.date.localeCompare(b.date));
```

```js ui
const $ = (id) => document.getElementById(id);
// Task titles are typed by people, so escape them before they go into HTML.
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);
let selected = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
const fmtTime = (t) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '');
const repeatLabel = { daily: 'Every day', weekdays: 'Weekdays', weekly: 'Every week', monthly: 'Every month' };

// A few example tasks so the calendar isn't empty
let tasks = [
  newTask({ title: 'Welcome! Click a day to add tasks', date: todayKey, priority: 'high' }),
  newTask({ title: 'Morning workout', date: todayKey, time: '06:30', repeat: 'weekdays', priority: 'low' }),
  newTask({ title: 'Review the week', date: addDays(todayKey, 2), repeat: 'weekly' }),
];

function renderCalendar() {
  $('monthLabel').textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  $('grid').innerHTML = monthGrid(viewYear, viewMonth).map((key) => {
    const d = fromKey(key);
    const list = tasksOn(tasks, key);
    const cls = ['day', d.getMonth() !== viewMonth && 'other', key === todayKey && 'today', key === selected && 'selected'].filter(Boolean).join(' ');
    const chips = list.slice(0, 3).map((t) => `<span class="chip ${t.priority}${t.completed ? ' done' : ''}" data-id="${t.id}">${esc(t.title)}</span>`).join('');
    const more = list.length > 3 ? `<span class="more">+${list.length - 3} more</span>` : '';
    return `<button class="${cls}" data-key="${key}" aria-label="${fmtDay(key)}, ${list.length} tasks"><span class="num">${d.getDate()}</span>${chips}${more}</button>`;
  }).join('');
}

const taskItem = (t, key, showDate = false) => `
  <li class="task ${t.priority}${t.completed ? ' completed' : ''}">
    <input type="checkbox" ${t.completed ? 'checked' : ''} data-toggle="${t.id}" data-key="${key}" aria-label="Done: ${esc(t.title)}">
    <span class="t-body">
      <span class="t-title">${esc(t.title)}</span>
      <span class="t-meta">${[showDate && fmtDay(key, { weekday: 'short', month: 'short', day: 'numeric' }), fmtTime(t.time), repeatLabel[t.repeat]].filter(Boolean).join(' · ')}</span>
    </span>
    <button class="del" data-del="${t.id}" aria-label="Delete ${esc(t.title)}">✕</button>
  </li>`;

function renderDay() {
  $('dayLabel').textContent = selected === todayKey ? `Today, ${fmtDay(selected, { month: 'long', day: 'numeric' })}` : fmtDay(selected);
  $('dayTasks').innerHTML = tasksOn(tasks, selected).map((t) => taskItem(t, selected)).join('')
    || '<li class="empty">No tasks. Enjoy the free time, or add one above.</li>';
}

function renderMonth() {
  const late = overdue(tasks, todayKey);
  $('overdueAlert').innerHTML = late.length ? `<details class="overdue" open>
    <summary>⚠️ ${late.length} overdue task${late.length > 1 ? 's' : ''}</summary>
    <ul class="tasks">${late.map((t) => taskItem({ ...t, completed: false }, t.date, true)).join('')}</ul></details>` : '';
}

function render() { renderCalendar(); renderDay(); renderMonth(); }

// Clicking a day selects it (and moves to its month if it's one of the grey days)
$('grid').addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  selected = day.dataset.key;
  const d = fromKey(selected);
  if (d.getMonth() !== viewMonth) { viewMonth = d.getMonth(); viewYear = d.getFullYear(); }
  render();
});
$('prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
$('nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
$('today').onclick = () => { selected = todayKey; viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); render(); };

$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push(newTask({ title: $('title').value, date: selected, time: $('time').value, priority: $('priority').value, repeat: $('repeat').value }));
  $('title').value = ''; $('time').value = ''; $('repeat').value = 'none';
  render();
});

// One listener for every checkbox and ✕, wherever they are on the page
document.addEventListener('change', (e) => {
  const id = e.target.dataset.toggle;
  if (!id) return;
  tasks = tasks.map((t) => (t.id === id ? toggle(t, e.target.dataset.key) : t));
  render();
});
document.addEventListener('click', (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  const task = tasks.find((t) => t.id === id);
  if (task.repeat !== 'none' && !confirm(`"${task.title}" repeats. Delete every occurrence?`)) return;
  tasks = tasks.filter((t) => t.id !== id);
  render();
});
```

## Step: Drag a task to another day
time: 15

Rescheduling should be as easy as moving a sticky note. The browser's **Drag and Drop API** does most of the work:

| Event | On | What the app does |
|---|---|---|
| `dragstart` | the chip | remember the task's id |
| `dragover` | a day | `preventDefault()` to say "you may drop here", and highlight the day |
| `dragleave` | a day | remove the highlight |
| `drop` | a day | change the task's `date` to that day's key and redraw |

Only **one-time** tasks get `draggable="true"`. Dragging one day of a weekly series would raise questions the app can't answer well ("move just this one, or every week?"), so repeating tasks stay put.

All four listeners sit on the grid, not on the chips and days, because the grid's contents are redrawn constantly. `e.target.closest('.day')` finds the day under the pointer, whatever part of it the event started on.

The move itself is one line: `tasks.map((t) => (t.id === dragId ? { ...t, date: day.dataset.key } : t))`, a new array with a changed copy of one task.

### Try it

Drag a one-time task's chip to another day. Try to drag the weekly task: it won't move.

check: js | dragging starts | /addEventListener\(\s*['"]dragstart['"]/
check: js | days accept drops | /addEventListener\(\s*['"]dragover['"]/
check: js | dropping moves the task | /addEventListener\(\s*['"]drop['"]/
check: js | only one-time tasks can be dragged | /draggable="true"/

quiz: Why must the dragover handler call preventDefault()?
- [ ] To stop the page scrolling
- [x] By default, elements refuse drops; preventDefault() marks the day as a drop target
- [ ] To delete the task
why: It feels backward, but that's how the Drag and Drop API works.
quiz: Why can't repeating tasks be dragged?
- [x] It's unclear whether to move one day or the whole series, so the app avoids guessing
- [ ] Repeating tasks have no id
- [ ] Drag and drop only works on Mondays
why: Keeping it to one-time tasks makes drag-and-drop always mean one thing.

```js ui
const $ = (id) => document.getElementById(id);
// Task titles are typed by people, so escape them before they go into HTML.
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);
let selected = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
const fmtTime = (t) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '');
const repeatLabel = { daily: 'Every day', weekdays: 'Weekdays', weekly: 'Every week', monthly: 'Every month' };

// A few example tasks so the calendar isn't empty
let tasks = [
  newTask({ title: 'Welcome! Click a day to add tasks', date: todayKey, priority: 'high' }),
  newTask({ title: 'Morning workout', date: todayKey, time: '06:30', repeat: 'weekdays', priority: 'low' }),
  newTask({ title: 'Review the week', date: addDays(todayKey, 2), repeat: 'weekly' }),
];

function renderCalendar() {
  $('monthLabel').textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  $('grid').innerHTML = monthGrid(viewYear, viewMonth).map((key) => {
    const d = fromKey(key);
    const list = tasksOn(tasks, key);
    const cls = ['day', d.getMonth() !== viewMonth && 'other', key === todayKey && 'today', key === selected && 'selected'].filter(Boolean).join(' ');
    const chips = list.slice(0, 3).map((t) => `<span class="chip ${t.priority}${t.completed ? ' done' : ''}"${t.repeat === 'none' ? ' draggable="true"' : ''} data-id="${t.id}">${esc(t.title)}</span>`).join('');
    const more = list.length > 3 ? `<span class="more">+${list.length - 3} more</span>` : '';
    return `<button class="${cls}" data-key="${key}" aria-label="${fmtDay(key)}, ${list.length} tasks"><span class="num">${d.getDate()}</span>${chips}${more}</button>`;
  }).join('');
}

const taskItem = (t, key, showDate = false) => `
  <li class="task ${t.priority}${t.completed ? ' completed' : ''}">
    <input type="checkbox" ${t.completed ? 'checked' : ''} data-toggle="${t.id}" data-key="${key}" aria-label="Done: ${esc(t.title)}">
    <span class="t-body">
      <span class="t-title">${esc(t.title)}</span>
      <span class="t-meta">${[showDate && fmtDay(key, { weekday: 'short', month: 'short', day: 'numeric' }), fmtTime(t.time), repeatLabel[t.repeat]].filter(Boolean).join(' · ')}</span>
    </span>
    <button class="del" data-del="${t.id}" aria-label="Delete ${esc(t.title)}">✕</button>
  </li>`;

function renderDay() {
  $('dayLabel').textContent = selected === todayKey ? `Today, ${fmtDay(selected, { month: 'long', day: 'numeric' })}` : fmtDay(selected);
  $('dayTasks').innerHTML = tasksOn(tasks, selected).map((t) => taskItem(t, selected)).join('')
    || '<li class="empty">No tasks. Enjoy the free time, or add one above.</li>';
}

function renderMonth() {
  const late = overdue(tasks, todayKey);
  $('overdueAlert').innerHTML = late.length ? `<details class="overdue" open>
    <summary>⚠️ ${late.length} overdue task${late.length > 1 ? 's' : ''}</summary>
    <ul class="tasks">${late.map((t) => taskItem({ ...t, completed: false }, t.date, true)).join('')}</ul></details>` : '';
}

function render() { renderCalendar(); renderDay(); renderMonth(); }

// Clicking a day selects it (and moves to its month if it's one of the grey days)
$('grid').addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  selected = day.dataset.key;
  const d = fromKey(selected);
  if (d.getMonth() !== viewMonth) { viewMonth = d.getMonth(); viewYear = d.getFullYear(); }
  render();
});
$('prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
$('nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
$('today').onclick = () => { selected = todayKey; viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); render(); };

$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push(newTask({ title: $('title').value, date: selected, time: $('time').value, priority: $('priority').value, repeat: $('repeat').value }));
  $('title').value = ''; $('time').value = ''; $('repeat').value = 'none';
  render();
});

// One listener for every checkbox and ✕, wherever they are on the page
document.addEventListener('change', (e) => {
  const id = e.target.dataset.toggle;
  if (!id) return;
  tasks = tasks.map((t) => (t.id === id ? toggle(t, e.target.dataset.key) : t));
  render();
});
document.addEventListener('click', (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  const task = tasks.find((t) => t.id === id);
  if (task.repeat !== 'none' && !confirm(`"${task.title}" repeats. Delete every occurrence?`)) return;
  tasks = tasks.filter((t) => t.id !== id);
  render();
});

// Drag and drop a one-time task onto another day to reschedule it
let dragId = null;
$('grid').addEventListener('dragstart', (e) => { dragId = e.target.dataset.id; e.dataTransfer.effectAllowed = 'move'; });
$('grid').addEventListener('dragover', (e) => {
  const day = e.target.closest('.day');
  if (day && dragId) { e.preventDefault(); day.classList.add('drop'); }   // preventDefault = "you may drop here"
});
$('grid').addEventListener('dragleave', (e) => e.target.closest('.day')?.classList.remove('drop'));
$('grid').addEventListener('drop', (e) => {
  const day = e.target.closest('.day');
  if (!day || !dragId) return;
  e.preventDefault();
  tasks = tasks.map((t) => (t.id === dragId ? { ...t, date: day.dataset.key } : t));
  dragId = null;
  render();
});
```

## Session: Holidays and themes

## Step: US holidays from their rules
time: 20

The calendar knows every US holiday for **any year**, without a list that would need updating. Each holiday is a rule:

| Kind | Examples | How |
|---|---|---|
| fixed date | Independence Day, Halloween, Christmas | `new Date(year, 6, 4)` |
| nth weekday | MLK Day (3rd Monday of January), Thanksgiving (4th Thursday of November) | `nthWeekday(year, month, weekday, n)` |
| last weekday | Memorial Day (last Monday of May) | `nthWeekday(…, -1)` |
| computed | Easter | the "anonymous Gregorian" algorithm |

```svg Thanksgiving 2026: the first Thursday is the 5th, so the fourth is the 26th
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 140" font-family="sans-serif"><text x="36" y="14" text-anchor="middle" font-size="10" fill="#475569">S</text><text x="68" y="14" text-anchor="middle" font-size="10" fill="#475569">M</text><text x="100" y="14" text-anchor="middle" font-size="10" fill="#475569">T</text><text x="132" y="14" text-anchor="middle" font-size="10" fill="#475569">W</text><text x="164" y="14" text-anchor="middle" font-size="10" fill="#475569">T</text><text x="196" y="14" text-anchor="middle" font-size="10" fill="#475569">F</text><text x="228" y="14" text-anchor="middle" font-size="10" fill="#475569">S</text><rect x="20" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="34" text-anchor="middle" font-size="10">1</text><rect x="52" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="34" text-anchor="middle" font-size="10">2</text><rect x="84" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="34" text-anchor="middle" font-size="10">3</text><rect x="116" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="34" text-anchor="middle" font-size="10">4</text><rect x="148" y="20" width="30" height="20" rx="3" fill="#ffedd5" stroke="#cbd5e1"/><text x="163" y="34" text-anchor="middle" font-size="10">5</text><rect x="180" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="34" text-anchor="middle" font-size="10">6</text><rect x="212" y="20" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="34" text-anchor="middle" font-size="10">7</text><rect x="20" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="56" text-anchor="middle" font-size="10">8</text><rect x="52" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="56" text-anchor="middle" font-size="10">9</text><rect x="84" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="56" text-anchor="middle" font-size="10">10</text><rect x="116" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="56" text-anchor="middle" font-size="10">11</text><rect x="148" y="42" width="30" height="20" rx="3" fill="#ffedd5" stroke="#cbd5e1"/><text x="163" y="56" text-anchor="middle" font-size="10">12</text><rect x="180" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="56" text-anchor="middle" font-size="10">13</text><rect x="212" y="42" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="56" text-anchor="middle" font-size="10">14</text><rect x="20" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="78" text-anchor="middle" font-size="10">15</text><rect x="52" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="78" text-anchor="middle" font-size="10">16</text><rect x="84" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="78" text-anchor="middle" font-size="10">17</text><rect x="116" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="78" text-anchor="middle" font-size="10">18</text><rect x="148" y="64" width="30" height="20" rx="3" fill="#ffedd5" stroke="#cbd5e1"/><text x="163" y="78" text-anchor="middle" font-size="10">19</text><rect x="180" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="78" text-anchor="middle" font-size="10">20</text><rect x="212" y="64" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="78" text-anchor="middle" font-size="10">21</text><rect x="20" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="100" text-anchor="middle" font-size="10">22</text><rect x="52" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="100" text-anchor="middle" font-size="10">23</text><rect x="84" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="99" y="100" text-anchor="middle" font-size="10">24</text><rect x="116" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="131" y="100" text-anchor="middle" font-size="10">25</text><rect x="148" y="86" width="30" height="20" rx="3" fill="#fb923c" stroke="#cbd5e1"/><text x="163" y="100" text-anchor="middle" font-size="10">26</text><rect x="180" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="195" y="100" text-anchor="middle" font-size="10">27</text><rect x="212" y="86" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="227" y="100" text-anchor="middle" font-size="10">28</text><rect x="20" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="35" y="122" text-anchor="middle" font-size="10">29</text><rect x="52" y="108" width="30" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1"/><text x="67" y="122" text-anchor="middle" font-size="10">30</text><text x="260" y="40" font-size="11">Thanksgiving: the 4th</text><text x="260" y="54" font-size="11">Thursday of November</text><text x="260" y="80" font-size="10" fill="#475569">first Thursday = 1 + (4 - 0 + 7) % 7</text><text x="260" y="94" font-size="10" fill="#475569">= the 5th</text><text x="260" y="112" font-size="10" fill="#475569">4th = 5 + 3 x 7 = the 26th</text></svg>
```

**`nthWeekday`.** The first matching weekday is `1 + (weekday - firstDay + 7) % 7`; the `+ 7` keeps the result positive. Each later one is 7 days on. For "last", it starts from the month's last day and steps back.

**Easter** falls on the first Sunday after the first full moon on or after March 21, which depends on the moon's cycle. The algorithm is a well-known formula of divisions and remainders that works for any year in the Gregorian calendar (2026: April 5).

**Observed days.** When a federal holiday falls on a Saturday, offices close on Friday; on a Sunday, on Monday. `fixedFederal()` adds the "(observed)" day too. July 4, 2026 is a Saturday, so Friday July 3 is shaded. One odd case: when New Year's Day is a Saturday, it's observed on December 31 of the year before.

`holidaysOn(key)` works out a whole year once and keeps it in a `Map` by day, so drawing 42 days doesn't recalculate 42 times. Days with a federal holiday get the `dayoff` class and are shaded, and the day panel names the holiday.

### Try it

Go to November: Thanksgiving is on the 26th, Veterans Day on the 11th. Go to July 2026: the 3rd is "Independence Day (observed)".

check: js | the nth weekday of a month | /function\s+nthWeekday\s*\(/
check: js | Easter for any year | /function\s+easter\s*\(/
check: js | weekend holidays move to Friday or Monday | /function\s+observed\s*\(/
check: js | each year is worked out once | /holidayCache\.has\(\s*year\s*\)/

quiz: November 1 is a Sunday (getDay() = 0). What date is the first Thursday (weekday 4)?
- [ ] November 4
- [x] November 5
- [ ] November 7
why: 1 + (4 - 0 + 7) % 7 = 1 + 4 = 5.
quiz: Christmas falls on a Saturday. Which day is the federal holiday observed?
- [x] Friday, December 24
- [ ] Monday, December 27
- [ ] It isn't observed
why: Saturday holidays move to the Friday before; Sunday ones to the Monday after.

```js holidays
// US holidays for any year, worked out from their rules (no list to keep up to date).
const day = (y, m, d) => new Date(y, m, d);

// The nth weekday of a month (weekday 0 = Sunday). n = -1 means the last one.
function nthWeekday(year, month, weekday, n) {
  if (n > 0) {
    const first = day(year, month, 1);
    return day(year, month, 1 + ((weekday - first.getDay() + 7) % 7) + (n - 1) * 7);
  }
  const last = day(year, month + 1, 0);
  return day(year, month, last.getDate() - ((last.getDay() - weekday + 7) % 7));
}

// Easter Sunday (Western), with the anonymous Gregorian algorithm.
function easter(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), date = ((h + l - 7 * m + 114) % 31) + 1;
  return day(year, month - 1, date);
}

// A Saturday holiday is observed on Friday, a Sunday one on Monday.
function observed(date) {
  const wd = date.getDay();
  if (wd === 6) return day(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  if (wd === 0) return day(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return null;
}

// Every holiday in a year: { date, name, emoji, federal }, sorted by date.
function holidaysFor(year) {
  const list = [];
  const add = (date, name, emoji, federal = false) => list.push({ date: toKey(date), name, emoji, federal });
  const fixedFederal = (month, d, name, emoji) => {
    const date = day(year, month, d);
    add(date, name, emoji, true);
    const obs = observed(date);
    if (obs && obs.getFullYear() === year) add(obs, `${name} (observed)`, emoji, true);
  };

  fixedFederal(0, 1, "New Year's Day", '🎆');
  add(nthWeekday(year, 0, 1, 3), 'Martin Luther King Jr. Day', '✊', true);
  add(day(year, 1, 14), "Valentine's Day", '❤️');
  add(nthWeekday(year, 1, 1, 3), "Presidents' Day", '🇺🇸', true);
  add(day(year, 2, 17), "St. Patrick's Day", '☘️');
  add(easter(year), 'Easter', '🐣');
  add(nthWeekday(year, 4, 0, 2), "Mother's Day", '💐');
  add(nthWeekday(year, 4, 1, -1), 'Memorial Day', '🎖️', true);
  add(nthWeekday(year, 5, 0, 3), "Father's Day", '👔');
  if (year >= 2021) fixedFederal(5, 19, 'Juneteenth', '✊🏾');
  fixedFederal(6, 4, 'Independence Day', '🎇');
  add(nthWeekday(year, 8, 1, 1), 'Labor Day', '🛠️', true);
  add(nthWeekday(year, 9, 1, 2), "Columbus Day / Indigenous Peoples' Day", '🧭', true);
  add(day(year, 9, 31), 'Halloween', '🎃');
  fixedFederal(10, 11, 'Veterans Day', '🎖️');
  add(nthWeekday(year, 10, 4, 4), 'Thanksgiving', '🦃', true);
  add(day(year, 11, 24), 'Christmas Eve', '🎄');
  fixedFederal(11, 25, 'Christmas Day', '🎄');
  add(day(year, 11, 31), "New Year's Eve", '🥂');
  // next year's New Year's Day on a Saturday is observed on Friday, December 31 of this year
  if (day(year + 1, 0, 1).getDay() === 6) add(day(year, 11, 31), "New Year's Day (observed)", '🎆', true);
  return list.sort((a, b) => a.date.localeCompare(b.date) || b.federal - a.federal);
}

// Holidays on one day. Each year is worked out once and kept in a Map.
const holidayCache = new Map();
function holidaysOn(key) {
  const year = Number(key.slice(0, 4));
  if (!holidayCache.has(year)) {
    const byDay = new Map();
    for (const h of holidaysFor(year)) byDay.set(h.date, [...(byDay.get(h.date) ?? []), h]);
    holidayCache.set(year, byDay);
  }
  return holidayCache.get(year).get(key) ?? [];
}
```

```js ui
const $ = (id) => document.getElementById(id);
// Task titles are typed by people, so escape them before they go into HTML.
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);
let selected = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
const fmtTime = (t) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '');
const repeatLabel = { daily: 'Every day', weekdays: 'Weekdays', weekly: 'Every week', monthly: 'Every month' };

// A few example tasks so the calendar isn't empty
let tasks = [
  newTask({ title: 'Welcome! Click a day to add tasks', date: todayKey, priority: 'high' }),
  newTask({ title: 'Morning workout', date: todayKey, time: '06:30', repeat: 'weekdays', priority: 'low' }),
  newTask({ title: 'Review the week', date: addDays(todayKey, 2), repeat: 'weekly' }),
];

function renderCalendar() {
  $('monthLabel').textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  $('grid').innerHTML = monthGrid(viewYear, viewMonth).map((key) => {
    const d = fromKey(key);
    const list = tasksOn(tasks, key);
    const hols = holidaysOn(key);
    const cls = ['day', d.getMonth() !== viewMonth && 'other', key === todayKey && 'today', key === selected && 'selected', hols.some((h) => h.federal) && 'dayoff'].filter(Boolean).join(' ');
    const holiday = hols.length ? `<span class="holiday" title="${esc(hols.map((h) => h.name).join(', '))}">${hols[0].emoji} ${esc(hols[0].name)}</span>` : '';
    const chips = list.slice(0, 3).map((t) => `<span class="chip ${t.priority}${t.completed ? ' done' : ''}"${t.repeat === 'none' ? ' draggable="true"' : ''} data-id="${t.id}">${esc(t.title)}</span>`).join('');
    const more = list.length > 3 ? `<span class="more">+${list.length - 3} more</span>` : '';
    return `<button class="${cls}" data-key="${key}" aria-label="${fmtDay(key)}, ${list.length} tasks"><span class="num">${d.getDate()}</span>${holiday}${chips}${more}</button>`;
  }).join('');
}

const taskItem = (t, key, showDate = false) => `
  <li class="task ${t.priority}${t.completed ? ' completed' : ''}">
    <input type="checkbox" ${t.completed ? 'checked' : ''} data-toggle="${t.id}" data-key="${key}" aria-label="Done: ${esc(t.title)}">
    <span class="t-body">
      <span class="t-title">${esc(t.title)}</span>
      <span class="t-meta">${[showDate && fmtDay(key, { weekday: 'short', month: 'short', day: 'numeric' }), fmtTime(t.time), repeatLabel[t.repeat]].filter(Boolean).join(' · ')}</span>
    </span>
    <button class="del" data-del="${t.id}" aria-label="Delete ${esc(t.title)}">✕</button>
  </li>`;

function renderDay() {
  $('dayLabel').textContent = selected === todayKey ? `Today, ${fmtDay(selected, { month: 'long', day: 'numeric' })}` : fmtDay(selected);
  const hols = holidaysOn(selected);
  $('dayHoliday').hidden = !hols.length;
  $('dayHoliday').textContent = hols.map((h) => `${h.emoji} ${h.name}${h.federal ? ' · federal holiday' : ''}`).join('  ·  ');
  $('dayTasks').innerHTML = tasksOn(tasks, selected).map((t) => taskItem(t, selected)).join('')
    || '<li class="empty">No tasks. Enjoy the free time, or add one above.</li>';
}

function renderMonth() {
  const late = overdue(tasks, todayKey);
  $('overdueAlert').innerHTML = late.length ? `<details class="overdue" open>
    <summary>⚠️ ${late.length} overdue task${late.length > 1 ? 's' : ''}</summary>
    <ul class="tasks">${late.map((t) => taskItem({ ...t, completed: false }, t.date, true)).join('')}</ul></details>` : '';
}

function render() { renderCalendar(); renderDay(); renderMonth(); }

// Clicking a day selects it (and moves to its month if it's one of the grey days)
$('grid').addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  selected = day.dataset.key;
  const d = fromKey(selected);
  if (d.getMonth() !== viewMonth) { viewMonth = d.getMonth(); viewYear = d.getFullYear(); }
  render();
});
$('prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
$('nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
$('today').onclick = () => { selected = todayKey; viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); render(); };

$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push(newTask({ title: $('title').value, date: selected, time: $('time').value, priority: $('priority').value, repeat: $('repeat').value }));
  $('title').value = ''; $('time').value = ''; $('repeat').value = 'none';
  render();
});

// One listener for every checkbox and ✕, wherever they are on the page
document.addEventListener('change', (e) => {
  const id = e.target.dataset.toggle;
  if (!id) return;
  tasks = tasks.map((t) => (t.id === id ? toggle(t, e.target.dataset.key) : t));
  render();
});
document.addEventListener('click', (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  const task = tasks.find((t) => t.id === id);
  if (task.repeat !== 'none' && !confirm(`"${task.title}" repeats. Delete every occurrence?`)) return;
  tasks = tasks.filter((t) => t.id !== id);
  render();
});

// Drag and drop a one-time task onto another day to reschedule it
let dragId = null;
$('grid').addEventListener('dragstart', (e) => { dragId = e.target.dataset.id; e.dataTransfer.effectAllowed = 'move'; });
$('grid').addEventListener('dragover', (e) => {
  const day = e.target.closest('.day');
  if (day && dragId) { e.preventDefault(); day.classList.add('drop'); }   // preventDefault = "you may drop here"
});
$('grid').addEventListener('dragleave', (e) => e.target.closest('.day')?.classList.remove('drop'));
$('grid').addEventListener('drop', (e) => {
  const day = e.target.closest('.day');
  if (!day || !dragId) return;
  e.preventDefault();
  tasks = tasks.map((t) => (t.id === dragId ? { ...t, date: day.dataset.key } : t));
  dragId = null;
  render();
});
```

## Step: A theme for every month, and "This month"
time: 20

Each month gets a theme from its best-known holiday: fireworks in January, hearts in February, a shamrock in March, a pumpkin in October, a turkey in November. A theme is just data:

| Field | Example (October) | Used for |
|---|---|---|
| `emoji` | 🎃 | the badge and the wallpaper |
| `accent` | `#c2410c` | the header and buttons |
| `tint` | `#ffedd5` | the calendar's background wash |

**CSS custom properties do the theming.** The stylesheet uses `var(--accent)` and `var(--tint)` everywhere. When the `.seasonal` class is on the page, those point at `--theme-accent` and `--theme-tint`, which `applySeasonal()` sets with `style.setProperty()`. Changing three variables recolors the whole page; no element is restyled one by one. The 🎨 button turns the theme off and on.

**Emoji wallpaper.** `emojiTile()` builds a tiny SVG image with the emoji twice and turns it into a `data:` URL, which CSS repeats as `background-image` behind the days. The theme follows the month you're **looking at**, not today's month.

**This month.** `monthHighlights()` collects the month's holidays and its **high-priority** tasks in date order. A repeating task is listed once, on its first day in the month, with "4 times this month". Clicking one selects that day.

### Try it

Click › through the year and watch the colors and emoji change. Mark a weekly task High: it appears in This month with its count.

check: js | twelve themes | /const\s+THEMES\s*=/
check: js | the page's colors come from the theme | /setProperty\(\s*['"]--theme-accent['"]/
check: js | an emoji wallpaper | /function\s+emojiTile\s*\(/
check: js | the This month list | /function\s+monthHighlights\s*\(/

quiz: How does applySeasonal() recolor the whole page?
- [x] It changes a few CSS custom properties, and every rule that uses var(--accent) updates
- [ ] It rewrites every element's style
- [ ] It loads a new stylesheet
why: Custom properties are variables for CSS: change the value once, it changes everywhere.
quiz: A weekly High task comes up 4 times in a month. How does This month show it?
- [ ] Four separate rows
- [x] Once, on its first day, with "4 times this month"
- [ ] Not at all
why: monthHighlights() counts repeats in a Map by task id instead of listing each one.

```js themes
// A color theme for each month, from its best-known holiday (or season, for August).
const THEMES = [
  { month: 'January', holiday: "New Year's", emoji: '🎆', accent: '#1d4ed8', tint: '#e0e7ff' },
  { month: 'February', holiday: "Valentine's Day", emoji: '❤️', accent: '#be123c', tint: '#ffe4e6' },
  { month: 'March', holiday: "St. Patrick's Day", emoji: '☘️', accent: '#15803d', tint: '#dcfce7' },
  { month: 'April', holiday: 'Easter', emoji: '🐣', accent: '#7c3aed', tint: '#f3e8ff' },
  { month: 'May', holiday: "Mother's Day", emoji: '💐', accent: '#a21caf', tint: '#fae8ff' },
  { month: 'June', holiday: 'Juneteenth', emoji: '✊🏾', accent: '#a16207', tint: '#fef9c3' },
  { month: 'July', holiday: 'Independence Day', emoji: '🎇', accent: '#b91c1c', tint: '#dbeafe' },
  { month: 'August', holiday: 'Summer break', emoji: '🏖️', accent: '#0e7490', tint: '#cffafe' },
  { month: 'September', holiday: 'Labor Day', emoji: '🛠️', accent: '#0369a1', tint: '#e0f2fe' },
  { month: 'October', holiday: 'Halloween', emoji: '🎃', accent: '#c2410c', tint: '#ffedd5' },
  { month: 'November', holiday: 'Thanksgiving', emoji: '🦃', accent: '#92400e', tint: '#fef3c7' },
  { month: 'December', holiday: 'Christmas', emoji: '🎄', accent: '#b91c1c', tint: '#dcfce7' },
];
const themeFor = (month) => THEMES[((month % 12) + 12) % 12];

// "This month": holidays plus high-priority tasks, in date order. A repeating task is listed once,
// on its first day in the month, with how many times it comes up.
function monthHighlights(tasks, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const holidays = holidaysFor(year)
    .filter((h) => h.date.startsWith(prefix))
    .map((h) => ({ key: h.date, type: 'holiday', name: h.name, emoji: h.emoji, federal: h.federal }));
  const seen = new Map();
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const key = toKey(new Date(year, month, d));
    for (const t of tasksOn(tasks, key)) {
      if (t.priority !== 'high') continue;
      if (seen.has(t.id)) seen.get(t.id).times++;
      else seen.set(t.id, { key, type: 'task', task: t, times: 1 });
    }
  }
  return [...holidays, ...seen.values()]
    .sort((a, b) => a.key.localeCompare(b.key) || (a.type === b.type ? 0 : a.type === 'holiday' ? -1 : 1));
}
```

```js ui
const $ = (id) => document.getElementById(id);
// Task titles are typed by people, so escape them before they go into HTML.
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const todayKey = toKey(new Date());
const fmtDay = (key, opts = { weekday: 'long', month: 'long', day: 'numeric' }) => fromKey(key).toLocaleDateString(undefined, opts);
let selected = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
const fmtTime = (t) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '');
const repeatLabel = { daily: 'Every day', weekdays: 'Weekdays', weekly: 'Every week', monthly: 'Every month' };

// A few example tasks so the calendar isn't empty
let tasks = [
  newTask({ title: 'Welcome! Click a day to add tasks', date: todayKey, priority: 'high' }),
  newTask({ title: 'Morning workout', date: todayKey, time: '06:30', repeat: 'weekdays', priority: 'low' }),
  newTask({ title: 'Review the week', date: addDays(todayKey, 2), repeat: 'weekly' }),
];

// The monthly theme: colors and an emoji wallpaper that follow the month on screen.
let seasonal = true;
function applySeasonal() {
  const t = themeFor(viewMonth);
  const root = document.documentElement;
  root.classList.toggle('seasonal', seasonal);
  root.style.setProperty('--theme-accent', t.accent);
  root.style.setProperty('--theme-tint', t.tint);
  root.style.setProperty('--theme-pattern', `url("${emojiTile(t.emoji)}")`);
  $('themeBadge').hidden = !seasonal;
  $('themeBadge').textContent = `${t.emoji} ${t.holiday}`;
  $('seasonal').setAttribute('aria-pressed', String(seasonal));
}

// A small SVG with the emoji twice, offset like wallpaper, as a data: URL for the CSS background.
function emojiTile(emoji) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">'
    + `<text x="18" y="44" font-size="30" opacity="0.35">${emoji}</text><text x="78" y="104" font-size="30" opacity="0.35">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function renderCalendar() {
  applySeasonal();
  $('monthLabel').textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  $('grid').innerHTML = monthGrid(viewYear, viewMonth).map((key) => {
    const d = fromKey(key);
    const list = tasksOn(tasks, key);
    const hols = holidaysOn(key);
    const cls = ['day', d.getMonth() !== viewMonth && 'other', key === todayKey && 'today', key === selected && 'selected', hols.some((h) => h.federal) && 'dayoff'].filter(Boolean).join(' ');
    const holiday = hols.length ? `<span class="holiday" title="${esc(hols.map((h) => h.name).join(', '))}">${hols[0].emoji} ${esc(hols[0].name)}</span>` : '';
    const chips = list.slice(0, 3).map((t) => `<span class="chip ${t.priority}${t.completed ? ' done' : ''}"${t.repeat === 'none' ? ' draggable="true"' : ''} data-id="${t.id}">${esc(t.title)}</span>`).join('');
    const more = list.length > 3 ? `<span class="more">+${list.length - 3} more</span>` : '';
    return `<button class="${cls}" data-key="${key}" aria-label="${fmtDay(key)}, ${list.length} tasks"><span class="num">${d.getDate()}</span>${holiday}${chips}${more}</button>`;
  }).join('');
}

const taskItem = (t, key, showDate = false) => `
  <li class="task ${t.priority}${t.completed ? ' completed' : ''}">
    <input type="checkbox" ${t.completed ? 'checked' : ''} data-toggle="${t.id}" data-key="${key}" aria-label="Done: ${esc(t.title)}">
    <span class="t-body">
      <span class="t-title">${esc(t.title)}</span>
      <span class="t-meta">${[showDate && fmtDay(key, { weekday: 'short', month: 'short', day: 'numeric' }), fmtTime(t.time), repeatLabel[t.repeat]].filter(Boolean).join(' · ')}</span>
    </span>
    <button class="del" data-del="${t.id}" aria-label="Delete ${esc(t.title)}">✕</button>
  </li>`;

function renderDay() {
  $('dayLabel').textContent = selected === todayKey ? `Today, ${fmtDay(selected, { month: 'long', day: 'numeric' })}` : fmtDay(selected);
  const hols = holidaysOn(selected);
  $('dayHoliday').hidden = !hols.length;
  $('dayHoliday').textContent = hols.map((h) => `${h.emoji} ${h.name}${h.federal ? ' · federal holiday' : ''}`).join('  ·  ');
  $('dayTasks').innerHTML = tasksOn(tasks, selected).map((t) => taskItem(t, selected)).join('')
    || '<li class="empty">No tasks. Enjoy the free time, or add one above.</li>';
}

function renderMonth() {
  const late = overdue(tasks, todayKey);
  $('overdueAlert').innerHTML = late.length ? `<details class="overdue" open>
    <summary>⚠️ ${late.length} overdue task${late.length > 1 ? 's' : ''}</summary>
    <ul class="tasks">${late.map((t) => taskItem({ ...t, completed: false }, t.date, true)).join('')}</ul></details>` : '';
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long' });
  $('monthTitle').textContent = `This month: ${monthName}`;
  $('monthList').innerHTML = monthHighlights(tasks, viewYear, viewMonth).map((x) => {
    const d = fromKey(x.key);
    const past = x.key < todayKey ? ' past' : '';
    const date = `<span class="hl-date"><b>${d.getDate()}</b>${d.toLocaleDateString(undefined, { weekday: 'short' })}</span>`;
    const title = x.type === 'holiday' ? `${x.emoji} ${esc(x.name)}` : `⭐ ${esc(x.task.title)}`;
    const meta = x.type === 'holiday' ? (x.federal ? 'Federal holiday' : 'Holiday')
      : [fmtTime(x.task.time), x.times > 1 ? `${x.times} times this month` : ''].filter(Boolean).join(' · ');
    return `<li><button class="hl${past}" data-goto="${x.key}">${date}<span class="hl-body"><span class="hl-title">${title}</span>`
      + `${meta ? `<span class="hl-meta">${meta}</span>` : ''}</span></button></li>`;
  }).join('') || '<li class="empty">Nothing important yet this month. Mark a task High to see it here.</li>';
}

function render() { renderCalendar(); renderDay(); renderMonth(); }

// Clicking a day selects it (and moves to its month if it's one of the grey days)
$('grid').addEventListener('click', (e) => {
  const day = e.target.closest('.day');
  if (!day) return;
  selected = day.dataset.key;
  const d = fromKey(selected);
  if (d.getMonth() !== viewMonth) { viewMonth = d.getMonth(); viewYear = d.getFullYear(); }
  render();
});
$('prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
$('nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
$('today').onclick = () => { selected = todayKey; viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); render(); };

$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push(newTask({ title: $('title').value, date: selected, time: $('time').value, priority: $('priority').value, repeat: $('repeat').value }));
  $('title').value = ''; $('time').value = ''; $('repeat').value = 'none';
  render();
});

// One listener for every checkbox and ✕, wherever they are on the page
document.addEventListener('change', (e) => {
  const id = e.target.dataset.toggle;
  if (!id) return;
  tasks = tasks.map((t) => (t.id === id ? toggle(t, e.target.dataset.key) : t));
  render();
});
document.addEventListener('click', (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  const task = tasks.find((t) => t.id === id);
  if (task.repeat !== 'none' && !confirm(`"${task.title}" repeats. Delete every occurrence?`)) return;
  tasks = tasks.filter((t) => t.id !== id);
  render();
});

// Drag and drop a one-time task onto another day to reschedule it
let dragId = null;
$('grid').addEventListener('dragstart', (e) => { dragId = e.target.dataset.id; e.dataTransfer.effectAllowed = 'move'; });
$('grid').addEventListener('dragover', (e) => {
  const day = e.target.closest('.day');
  if (day && dragId) { e.preventDefault(); day.classList.add('drop'); }   // preventDefault = "you may drop here"
});
$('grid').addEventListener('dragleave', (e) => e.target.closest('.day')?.classList.remove('drop'));
$('grid').addEventListener('drop', (e) => {
  const day = e.target.closest('.day');
  if (!day || !dragId) return;
  e.preventDefault();
  tasks = tasks.map((t) => (t.id === dragId ? { ...t, date: day.dataset.key } : t));
  dragId = null;
  render();
});

$('seasonal').onclick = () => { seasonal = !seasonal; applySeasonal(); };
$('monthList').addEventListener('click', (e) => {
  const b = e.target.closest('[data-goto]');
  if (!b) return;
  selected = b.dataset.goto;
  render();
});
```

## Finish

### What you learned

- Date keys that never shift a day, and why `new Date('2026-10-28')` does
- A fixed 6 x 7 month grid and moving between months
- Repeat rules worked out on demand, including the 31st in short months
- Completing one day of a series with a set of done days
- The Drag and Drop API and event delegation
- Holidays from rules: nth weekdays, Easter, and observed days
- Theming a whole page with CSS custom properties and an SVG data URL
- Saving that survives blocked storage, `.ics` export with a Blob, and Google Calendar and Maps links built with `URLSearchParams`

### Challenges

1. **Dark mode:** add a 🌙 button that toggles a `.dark` class with darker values for the custom properties, and remember the choice.
2. **Repeat until:** add an "until" date to repeating tasks and stop `occursOn()` after it.
3. **Next 7 days:** a panel listing every day in the next week that has tasks (hint: `addDays` and `tasksOn` in a loop).
4. **Keyboard:** move the selected day with the arrow keys (±1 day, ±7 days).
5. **Contrast check:** write `contrast(a, b)` from the WCAG luminance formula and test every theme's accent against white.

Compare your calendar with the [live version](https://theoyanvno.github.io/task-calendar/) and the [source code](https://github.com/TheoYanvno/task-calendar).
