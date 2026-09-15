<div align="center">

# Thi Ca Anh Thịnh
<p><strong>Contemporary East Asian Poetry Platform · Wind Poetic Sanctuary</strong></p>

<p>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 15" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://motion.dev/"><img src="https://img.shields.io/badge/Motion_12-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"><img src="https://img.shields.io/badge/Web_Audio_API-E34F26?style=flat-square&logo=html5&logoColor=white" alt="Web Audio API" /></a>
  <a href="https://turbo.build/pack"><img src="https://img.shields.io/badge/Turbopack-000000?style=flat-square&logo=vercel&logoColor=white" alt="Turbopack" /></a>
</p>

<p>
  A contemporary digital poetry sanctuary that harmonizes East Asian aesthetics with modern web engineering. <br/>
  Featuring a physics-driven 3D page-flip book, a dynamic four-season atmospheric ecosystem, an interactive multi-tier bookshelf, and a zero-asset procedural nature audio engine.
</p>

<p>
  <a href="#core-experiences--product-features">Core Experiences</a> •
  <a href="#technology-stack--architecture">Architecture</a> •
  <a href="#directory-structure">Directory Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#design-principles--craftsmanship">Design Principles</a>
</p>

</div>

---

## Core Experiences & Product Features

### 1. Interactive 3D Physics Book Reader
- **Perspective Page Flip**: Recreates the tactile weight and curvature of fine-art parchment with drag-and-drop mouse physics, keyboard navigation, and mobile touch gestures.
- **Four Seasons Book Affordances**:
  - *Spring*: Fragrant peach petals settle delicately upon the book spine, fluttering into flight upon page turn.
  - *Summer*: Warm golden sunlight beams slice across the text accompanied by drifting sun motes.
  - *Autumn*: Crisp Momiji and yellow chrysanthemums catch along the book edge, swept aloft by page-flip gusts.
  - *Winter*: Frosted condensation rings the book perimeter, melting away upon touch with micro-crystal fractures.
- **Poetic Navigation**: Seamless jump across collections, interactive table of contents, customizable typography scales, and bookmarking.

### 2. Four-Season Dynamic Atmosphere & Natural Physics
- **Corner Botanical Branches (Sora Lattice Aesthetic)**:
  - Modeled according to Leonardo da Vinci's rule of botanical branching with natural organic tapering.
  - Fine bark textures, weathered nodes, calyxes, and bud clusters tailored to each season.
  - Dynamic seasonal transitions: Soft peach blossoms & tender buds (Spring), blooming lotuses & lush canopies (Summer), crimson Momiji & golden Ginkgo foliage (Autumn), and weathered gnarled branches bearing hoarfrost crystals (Winter).
- **Botanical Grass Fringe & Ground Dynamics**:
  - A persistent poetic grass bed anchors the lower viewport, providing a natural resting ground for fallen leaves.
  - In Autumn, fallen foliage accumulates into four distinct mounds; probabilistic gusts of wind sweep the leaves into multi-directional scatter trajectories before they gracefully settle back down.
  - In Winter, frozen leaves rimmed with rime frost adhere firmly to the ground, triggering subtle crystal crunch acoustics when clicked.
- **Adaptive Contrast Overlays**: Season-specific ambient vignettes calibrated for both Light and Dark modes while strictly preserving WCAG AAA reading contrast.

### 3. Curated Multi-Tier Bookshelf
- Multi-tier natural wood shelf layout categorized by poetry collections and thematic anthologies.
- 3D spine inspection, pull-out interactions, and one-click transitions into focused full-screen reading.

### 4. Zero-Asset Procedural Audio Engine
- Built entirely on the native Web Audio API (Oscillators, Bandpass Filters, Exponential Gain Curves, and White/Pink Noise Buffers), eliminating external audio asset overhead:
  - Organic wind whirlwinds and rustling dry leaves.
  - Sub-millisecond frost fracture acoustics.
  - Tactile paper page turn resonance.

### 5. Editorial & Administration Workspace
- End-to-end editorial pipeline for poems, prose, collections, and author credentials.
- Instant toggle between published and draft states with real-time UI synchronization.
- Dual-layer data resilience: Direct synchronization with Supabase, seamlessly falling back to a local JSON data store when running standalone.

---

## Technology Stack & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 15 (App Router)                   │
│         React 19 Server Components & Turbopack Engine        │
├──────────────────────────────┬──────────────────────────────┤
│ Interface & Typography       │ Motion & Vector Mathematics  │
│ • Tailwind CSS v4            │ • Lenis Inertial Scroll      │
│ • Typography: EB Garamond,   │ • Motion (Framer Motion v12) │
│   Be Vietnam Pro, Lora       │ • SVG Vector Calculus        │
│ • Radix UI Primitives        │ • GPU-Accelerated Keyframes  │
├──────────────────────────────┼──────────────────────────────┤
│ Data Layer & Persistence     │ Acoustics & Accessibility    │
│ • Supabase SSR & Database    │ • Web Audio API Synthesis    │
│ • Local JSON Fallback Store  │ • Reading Zone Hysteresis    │
│ • Next.js Route Handlers     │ • Reduced Motion Safe Mode   │
└──────────────────────────────┴──────────────────────────────┘
```

---

## Directory Structure

```
.
├── public/
│   ├── floral/               # Seasonal botanicals, leaves & crystal assets
│   └── fonts/                # Web-optimized literary typefaces
├── scripts/
│   ├── generate_seasonal_floral.py  # Algorithmic seasonal asset generator
│   └── seed.mjs              # Supabase database seeder
├── src/
│   ├── app/
│   │   ├── (admin)/          # Editorial curation workspace
│   │   ├── (public)/         # Public poetry showcase & reader views
│   │   │   ├── collections/  # Collection catalogs and archive views
│   │   │   ├── poems/        # Dedicated poem reader routes
│   │   │   └── page.tsx      # Platform landing experience
│   │   ├── api/              # Server Route Handlers (CRUD, Auth, Sync)
│   │   ├── globals.css       # Design tokens, keyframes & animations
│   │   └── layout.tsx        # Root layout, providers & font configuration
│   ├── components/
│   │   ├── book/             # 3D book canvas, page turn & season physics
│   │   ├── bookshelf/        # Multi-tier interactive bookshelf
│   │   ├── effects/          # 4-season atmosphere, branches, grass, snow
│   │   ├── layout/           # SiteHeader, SiteFooter, Theme/Season switchers
│   │   └── reader/           # Floating reading bar, notes, share utilities
│   ├── context/
│   │   └── SeasonContext.tsx # Central season state & atmospheric coordinator
│   ├── data/
│   │   ├── local-collections.json  # Offline collections fallback dataset
│   │   └── local-poems.json        # Offline poems fallback dataset
│   ├── hooks/
│   │   └── useReadingZone.ts # Scroll hysteresis boundary controller
│   ├── lib/
│   │   ├── data-service.ts   # Unified data access layer (Supabase + Local)
│   │   ├── nature-audio.ts   # Procedural Web Audio API sound synthesizers
│   │   └── poem-genre.ts     # Poetry categorization & meter classification
│   └── types/
│       └── database.ts       # Database schema & TypeScript definitions
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- Package manager: `npm`, `pnpm`, or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd anhthinh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for Supabase cloud sync):
   Create a `.env.local` file at the root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_PASSWORD=your_secure_admin_password
   ```
   *Note: If no Supabase credentials are provided, the platform automatically defaults to the offline local JSON store.*

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. Validate codebase & production build:
   ```bash
   # Type check verification
   npx tsc --noEmit

   # Create production build
   npm run build

   # Start production server
   npm run start
   ```

---

## Design Principles & Craftsmanship

1. **Sora Lattice & Contemporary East Asian Aesthetics**: Every branch curve, petal texture, and lattice framing draws from classical ink wash paintings and pressed flower craft—cultivating restraint, balance, and poise.
2. **Text-First Reading Sanctity**:
   - The central reading viewport remains pristine with uncompromising typographic clarity.
   - Atmospheric effects are weighted toward viewport margins and perimeter zones to evoke poetic ambiance without visual clutter.
3. **Restraint & Organic Motion**:
   - Transitions leverage custom cubic-bezier easing curves with microscopic translational offsets.
   - Full compliance with `prefers-reduced-motion` for motion-sensitive readers.
4. **Performance Integrity**: Native 60fps performance achieved via hardware-accelerated CSS transforms, GPU layering, and procedural synthesis over network round-trips.

---

## License & Intellectual Property

Poetry, literary texts, and artistic visual assets are copyright of **Thi Ca Anh Thịnh**.  
Platform architecture and engineering developed under internal license by **ThinkAI Studio**.
