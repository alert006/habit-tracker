# Sprout 🌱 — Habit Tracker

A fast, calm, offline-first habit tracker. Build streaks, watch a year of consistency
grow on a calendar heatmap, and unlock achievements as momentum builds — all stored
locally on your device, with no account and no server required.

![Dashboard screenshot placeholder](./docs/screenshots/dashboard.png)
<!-- Replace the images in docs/screenshots with real screenshots before publishing. -->

## Features

- **Dashboard** — greeting, motivation card, today's progress, completion %,
  current streak, longest streak, and a 20-week activity heatmap
- **Habit CRUD** — create, edit, archive and delete habits with a validated form
- **Search & filter** — find habits instantly by name or category
- **Categories** — Health, Fitness, Study, Work, Reading, Meditation, Water,
  Sleep and Custom, each with its own color and icon
- **Flexible scheduling** — daily, weekly (N times per week), or specific days of
  the week
- **Calendar** — a monthly grid showing completed vs. missed days plus a
  20-week GitHub-style contribution heatmap
- **Statistics** — 14-day chart, 6-month chart, category breakdown, and a streak
  leaderboard
- **Progress rings** — visual weekly-goal progress per habit
- **Achievements & confetti** — 11 unlockable badges, plus a confetti burst both
  when a badge unlocks and when every habit for the day is complete
- **Import / export** — back up or restore all your data as a single JSON file
- **Dark mode** — system-aware by default, toggle any time, persisted locally
- **Offline support** — a service worker caches the app shell so it keeps working
  without a connection
- **Responsive** — a desktop sidebar and a mobile bottom navigation bar
- **Accessible** — visible keyboard focus, ARIA labels and roles, focus-trapped
  modals, reduced-motion support, and keyboard shortcuts (`/` to search, `n` for a
  new habit on the Habits page)
- **Empty, loading and error states** everywhere data can be missing or slow

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · React Router · Framer Motion ·
React Hook Form · Zod · Lucide React · Recharts · date-fns · react-hot-toast

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) in your browser.

### Other scripts

```bash
npm run build     # type-check and build a production bundle into dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Project structure

```
src/
├── assets/            static assets
├── components/
│   ├── ui/            generic primitives (Button, Modal, ProgressRing, …)
│   ├── layout/         Sidebar, MobileNav, Header
│   ├── habit/          HabitCard, HabitForm, HabitList, SearchBar, CategoryFilter
│   ├── calendar/        CalendarHeatmap, MonthlyCalendar
│   ├── stats/           StatsOverview, WeeklyChart, MonthlyChart, CategoryBreakdown
│   ├── achievements/    AchievementBadge, AchievementGrid
│   └── dashboard/       MotivationCard
├── contexts/           ThemeContext, HabitContext (app state + persistence)
├── data/               static reference data (categories, achievements, nav, quotes)
├── hooks/              useMediaQuery, useOnlineStatus, useKeyboardShortcut
├── layouts/            MainLayout (sidebar + mobile nav + outlet)
├── pages/              Dashboard, Habits, Calendar, Statistics, Achievements, Settings
├── services/           localStorage persistence layer
├── styles/             Tailwind entry point
├── types/              shared TypeScript types
├── utils/              date/streak math, import/export, validation schemas
├── App.tsx
└── main.tsx
```

## Data & privacy

Sprout stores everything in your browser's `localStorage` — habits, completion
history and unlocked achievements never leave your device. Use **Settings → Export
JSON** to create a backup you can move to another browser or restore later with
**Import JSON**.

## Browser support

Any modern evergreen browser (Chrome, Firefox, Safari, Edge). The service worker
that enables offline use requires a secure context (`https://` or `localhost`).

## License

MIT — see [LICENSE](./LICENSE).
