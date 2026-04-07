# Gym Buddy

A personal gym tracking app built with Next.js 14, Prisma, and Neon (PostgreSQL).

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your database
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 3. Configure environment
```bash
cp .env.example .env
```
Paste your Neon connection string into `.env`:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/gym_buddy?sslmode=require"
```

### 4. Push the schema to your database
```bash
npm run db:push
```

### 5. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` as an environment variable in Vercel project settings
4. Deploy!

---

## Project Structure

```
gym-buddy/
├── prisma/schema.prisma       # Database schema
├── lib/
│   ├── prisma.ts              # Prisma singleton client
│   ├── types.ts               # Shared TypeScript types
│   ├── dates.ts               # Date/week helpers
│   └── stats.ts               # Weekly % and streak logic
├── app/
│   ├── dashboard/page.tsx     # Overview stats
│   ├── log/page.tsx           # Today's workout log
│   ├── plan/page.tsx          # Plan list
│   ├── plan/[id]/page.tsx     # Plan builder (day columns)
│   ├── history/page.tsx       # Past logs + progress chart
│   ├── exercises/page.tsx     # Exercise library
│   └── api/                   # REST API routes
└── components/
    ├── layout/                # Sidebar + TopBar
    ├── dashboard/             # WeeklyProgressRing, StreakCard, TodayPreview
    ├── log/                   # ExerciseLogCard, SetRow, AddSetButton
    ├── plan/                  # PlanCard, DayColumn, ExercisePicker, RestDayToggle
    ├── history/               # WeekPicker, LogSummaryCard, ExerciseProgressChart
    └── exercises/             # ExerciseTable, ExerciseFormModal
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via [Neon](https://neon.tech)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React


- **Hosting**: Vercel

this is final version deploy by durgesh 
the update for the mobile download 2
third ttest for download
fourth time previous data ...
after prism take the 
