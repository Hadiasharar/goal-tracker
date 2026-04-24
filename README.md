# 🚀 GoalFlow – Goal Tracker Dashboard

A full-featured, multi-page goal tracking web application built with React + Vite + MUI.

---

## ✅ Features Checklist

### Pages / Routes
- [x] `/` – Dashboard with summary stats, active goals, recently completed
- [x] `/goals` – All goals list with tabs, search, and sort
- [x] `/goals/new` – Create new goal form (with validation)
- [x] `/goals/:id` – Goal detail page with progress history
- [x] `/goals/:id/edit` – Edit existing goal
- [x] `/categories` – Categories overview with bar chart
- [x] `/settings` – Language + Theme toggle
- [x] `*` – 404 Not Found page

### CRUD
- [x] Create goal
- [x] Read / list goals
- [x] Update / edit goal
- [x] Delete goal (with confirmation dialog)

### Progress Tracking
- [x] Log progress entries per goal
- [x] Auto-calculate progress percentage
- [x] Auto-complete when target is reached
- [x] Progress history log with dates

### Gamification
- [x] Streak system (resets on missed days for daily goals)
- [x] XP system (+20 per log, +100 on completion)
- [x] Level system (Level up every 500 XP)
- [x] XP + streak shown in navbar

### Languages
- [x] English 🇬🇧
- [x] German 🇩🇪
- [x] Turkish 🇹🇷
- [x] All UI text fully translated
- [x] Language persists via localStorage


### UI / UX
- [x] Responsive (mobile + desktop)
- [x] Dark / Light theme toggle (MUI theming)
- [x] Progress bars
- [x] Goal cards with color accents
- [x] Empty states for all sections
- [x] Category badge chips
- [x] Recharts bar chart in Categories page

### Data Persistence
- [x] All goals saved to **localStorage**
- [x] User stats (XP, streak, completedCount) saved to **localStorage**
- [x] Language preference saved to **localStorage**
- [x] Theme preference saved to **localStorage**

### Bonus Features
- [x] Recharts bar chart for category overview
- [x] Restore completed goals back to active
- [x] Color picker for goal customization
- [x] XP level progress bar in dashboard
- [x] Smooth theme transition animations

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Multi-page routing |
| MUI v5 | UI component library |
| Recharts | Category bar chart |
| localStorage | Data persistence |

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5173
```

---

## 🌍 Language  Explanation

The app supports **3 languages**:

| Language | Code | Direction |
|----------|------|-----------|
| English  | `en` | LTR |
| German   | `de` | LTR |
| Turkish  | `tr` | LTR |

### How it works:
1. Each locale file (`en.js`, `de.js`, `tr.js`) has a `dir` property (`'ltr'` or `'rtl'`)
2. When the language changes, `LanguageContext` applies `document.documentElement.dir = t.dir`
3. MUI components automatically respect the document direction
4. To add an RTL language (e.g., Arabic), simply create `ar.js` with `dir: 'rtl'` — the entire layout switches automatically

---

## 🔥 Streak & XP Rules

### XP System
- **+20 XP** for each progress log entry
- **+100 XP bonus** when a goal is fully completed
- **Level up** every 500 XP (Level = floor(XP / 500) + 1)

### Streak System
- Streak tracks **consecutive days** of logging progress
- If you logged yesterday → streak increases by 1
- If you missed a day → streak resets to 1 on next log
- Streak is displayed in the navbar and dashboard

---

## 📁 Project Structure

```
src/
├── components/
│   ├── GoalCard.jsx       # Reusable goal card with actions
│   └── NavBar.jsx         # Top navigation bar with mobile drawer
├── context/
│   ├── GoalsContext.jsx   # All goal state + CRUD + XP/streak logic
│   ├── LanguageContext.jsx # i18n + RTL/LTR switching
│   └── ThemeContext.jsx   # MUI dark/light theme
├── locales/
│   ├── en.js              # English translations
│   ├── de.js              # German translations
│   └── tr.js              # Turkish translations
├── pages/
│   ├── Dashboard.jsx      # / route
│   ├── GoalsList.jsx      # /goals route
│   ├── NewGoal.jsx        # /goals/new + /goals/:id/edit
│   ├── GoalDetail.jsx     # /goals/:id route
│   ├── Categories.jsx     # /categories route
│   ├── Settings.jsx       # /settings route
│   └── NotFound.jsx       # * 404 route
├── utils/
│   └── categoryConfig.js  # Category colors, emoji, helpers
├── App.jsx                # Router setup
├── main.jsx               # Entry point
└── index.css              # Global styles
```

---

## 📊 Data Model

### Goal
```js
{
  id: string,
  title: string,
  category: 'health' | 'study' | 'work' | 'personal' | 'fitness' | 'finance' | 'creative' | 'social',
  type: 'daily' | 'count' | 'time',
  target: number,
  progress: number,
  status: 'active' | 'paused' | 'completed',
  color: string,
  startDate: string,
  endDate?: string,
  notes?: string,
  logs: Array<{ date: string, amount: number }>,
  createdAt: string,
  updatedAt: string
}
```

### UserStats
```js
{
  xpTotal: number,
  streak: number,
  completedCount: number,
  lastLogDate: string | null,
  level: number   // computed: floor(xpTotal / 500) + 1
}
```
