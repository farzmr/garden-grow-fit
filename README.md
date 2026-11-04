# 🌸 Bloom — My Gym Garden

<p align="center">
  <strong>A mindful, gamified fitness companion that grows a living garden with every workout.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack-Start%20%26%20Router-FF4154?logo=tanstack&logoColor=white" alt="TanStack" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Capacitor-iOS%208-119EFF?logo=capacitor&logoColor=white" alt="Capacitor iOS" />
  <img src="https://img.shields.io/badge/Offline--First-Enabled-success" alt="Offline First" />
  <img src="https://img.shields.io/badge/Built_with-Lovable-7C3AED" alt="Lovable" />
</p>

---

## 📖 Overview

**Bloom (My Gym Garden)** turns fitness consistency into an interactive, visual journey. Instead of cold numbers and impersonal dashboards, every workout session you complete plants a unique, hand-crafted flower in your personal botanical sanctuary.

Built as an **offline-first** progressive web and native iOS app, Bloom keeps your device as the source of truth with zero network latency, while offering seamless cloud backup powered by Supabase.

---

## ✨ Key Features

### 🌸 Living Botanical Garden
- **Three Bespoke Environments**: Choose between **Wild Meadow**, **Moon Orchard**, or **Glasshouse** as your home sanctuary.
- **15 Collectible Flowers**: Bloom a Tulip, Sakura, Sunflower, Rose, Daisy, Lavender, Hibiscus, Orchid, Lotus, Hyacinth, Poppy, Daffodil, Peony, Iris, or Marigold for each finished session.
- **Interactive Garden Lawn**: Tap on any planted bloom to view the exact exercises, intensity, and date of that session.

### 🏋️ Flexible Workout & Routine Logging
- **Reusable Workout Routines**: Create named routines with customizable exercises, set targets, reps, and weights, categorized by difficulty (*Beginner*, *Intermediate*, *Advanced*).
- **Multi-Activity Support**: Track traditional weight training alongside Yoga, Pilates, Spin, Cardio, Dance, Stretching, Swimming, and custom sports.
- **Live Active Session Tracker**: Set-by-set completion logging, rest cues, and persistent state so you never lose your progress if interrupted.
- **Post-Workout Reflection**: Log session duration, gym location, mood emojis, intensity level (*Gentle*, *Moderate*, *Intense*), and personal notes.

### 📚 Exercise Library & Strength Analytics
- **Curated Movement Library**: Includes exercises across Chest, Back, Shoulders, Legs, Arms, Core, and Cardio with execution tips and common mistakes to avoid.
- **MyoAtlas Integration**: Quick links to muscle targeting guides and anatomy diagrams.
- **Progress Tracking**: Interactive weight trend charts powered by Recharts to visualize strength growth over time.

### 📅 Inline History & Calendar
- **Interactive Calendar**: View monthly activity patterns at a glance with flower markers on active days.
- **Inline Drilldown**: Inspect full session summaries directly below the calendar without disruptive modal overlays.

### 📱 Offline-First & Mobile-Optimized
- **Zero-Latency Offline Store**: Local device storage is the source of truth. Work out in basements, flight mode, or areas with poor cellular reception without missing a beat.
- **Native iOS Experience**: Powered by Capacitor 8 with native haptic feedback, status bar styling, and smooth touch interactions.
- **Cloud Backup & Restore**: Optional user authentication via Supabase enables background backups and cross-device restoration.

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Routing & SSR**: [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Mobile Runtime**: [Capacitor 8](https://capacitorjs.com/) (`@capacitor/ios`, `@capacitor/haptics`, `@capacitor/status-bar`)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
- **Tooling & Build**: [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)
- *(Optional for iOS)* macOS with Xcode 16+

### 1. Clone the repository
```sh
git clone https://github.com/farzmr/garden-grow-fit.git
cd garden-grow-fit
```

### 2. Install dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL="your-supabase-project-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Start the Development Server
```sh
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 iOS Native App Build

Bloom is configured to build as an offline-first iOS Single Page Application (SPA) using Capacitor.

1. **Build the static web bundle and sync to iOS project**:
   ```sh
   npm run cap:sync
   ```
   *(This triggers `BUILD_TARGET=ios vite build` outputting to `dist/client` and runs `npx cap sync ios`)*

2. **Open the project in Xcode**:
   ```sh
   npm run cap:open
   ```

3. **Deploy to device**:
   - In Xcode, select the `App` target under **Signing & Capabilities** and choose your Apple Developer Team.
   - Connect your iPhone (with Developer Mode enabled) and click **Run** (▶).

For full details on App Store submission requirements and asset configurations, see [`IOS_BUILD.md`](./IOS_BUILD.md).

---

## 📂 Project Structure

```text
gym-garden/
├── ios/                      # Native iOS Capacitor Xcode project
├── public/                   # Static assets & web icons
├── src/
│   ├── assets/               # Botanical illustrations, exercise photography & garden art
│   ├── components/           # Reusable UI controls, modals, and charts
│   │   ├── ui/               # Radix UI primitives & shared component styles
│   │   ├── FlowerIcon.tsx    # SVG flower rendering catalog
│   │   ├── Garden.tsx        # Garden landscape visualizer
│   │   ├── ExerciseTrend.tsx # Recharts progression chart
│   │   └── TabBar.tsx        # Mobile-first navigation bar
│   ├── lib/                  # State management, data persistence, and sync
│   │   ├── store.ts          # Versioned local store (EXERCISE_LIBRARY, sessions, plans)
│   │   ├── sync.ts           # Supabase background backup & synchronization
│   │   └── auth.ts           # Auth helpers & session listener
│   ├── routes/               # TanStack Router route definitions
│   │   ├── __root.tsx        # Root layout, navigation bar, and metadata
│   │   ├── index.tsx         # Home screen: garden view & quick start
│   │   ├── workout.tsx       # Live active session logger
│   │   ├── plan.tsx          # Routine manager & workout plans
│   │   ├── history.tsx       # Calendar & inline session drilldown
│   │   ├── exercises.tsx     # Exercise library & search
│   │   ├── exercise.$name.tsx# Individual exercise details & weight trend
│   │   └── gardens.tsx       # Garden landscape selector
│   └── styles.css            # Global CSS & Tailwind design tokens
├── capacitor.config.ts       # Capacitor native bridge configuration
├── vite.config.ts            # Vite configuration with TanStack Start plugin
└── package.json
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Vite development server on `localhost:5173` |
| `npm run build` | Builds the web application for production with TanStack Start |
| `npm run preview` | Previews the production build locally |
| `npm run test` | Executes unit and component tests with Vitest |
| `npm run lint` | Runs ESLint to check code formatting and quality |
| `npm run format` | Formats all codebase files using Prettier |
| `npm run build:ios` | Creates a static standalone SPA build inside `dist/client` |
| `npm run cap:sync` | Builds the iOS bundle and synchronizes Capacitor native plugins |
| `npm run cap:open` | Opens the iOS project inside Xcode |

---

## 🤝 Lovable Integration

This project is connected with [Lovable](https://lovable.dev).

- Changes pushed to the connected branch automatically sync back to the Lovable editor.
- In keeping with Lovable guidelines, avoid rewriting published git history (force pushes, interactive rebases, or squashes on published commits).

---

## 📄 License

This project is private and proprietary. All rights reserved.
