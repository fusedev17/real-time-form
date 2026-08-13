# Real-Time Patient Form

A responsive, real-time patient intake form and staff monitoring dashboard, built with Next.js, TailwindCSS, and Pusher Channels.

- **Patient Form** (`/patient`) — patients fill in their personal, contact, and emergency contact details, with inline validation.
- **Staff View** (`/staff`) — a live dashboard that mirrors every patient's form data as they type, showing whether each patient is actively filling in, idle, or has submitted.

The two views synchronize instantly: every keystroke (debounced) is pushed from the patient's browser to the staff dashboard over Pusher Channels, no manual refresh required.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS v4
- **Real-Time**: [Pusher Channels](https://pusher.com/channels/) (`pusher` on the server, `pusher-js` on the client)
- **Forms & Validation**: react-hook-form + Zod
- **Hosting**: Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Pusher app

1. Sign up at [pusher.com](https://pusher.com) and create a new **Channels** app (any cluster).
2. From the app's "App Keys" page, copy the `app_id`, `key`, `secret`, and `cluster`.

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your Pusher credentials:

```bash
cp .env.local.example .env.local
```

```
PUSHER_APP_ID=your-app-id
NEXT_PUBLIC_PUSHER_KEY=your-key
PUSHER_SECRET=your-secret
NEXT_PUBLIC_PUSHER_CLUSTER=your-cluster
```

The key and cluster are prefixed with `NEXT_PUBLIC_` because the staff dashboard subscribes to updates directly from the browser; the app ID and secret stay server-side and are only used to trigger events from the API route.

### 4. Run the dev server

```bash
npm run dev
```

Open two browser windows:

- [http://localhost:3000/patient](http://localhost:3000/patient) — fill in the form
- [http://localhost:3000/staff](http://localhost:3000/staff) — watch it update live

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the four environment variables from `.env.local.example` in the Vercel project settings.
4. Deploy.

No custom server is required — real-time sync is handled entirely by Pusher, so the app runs on Vercel's standard serverless functions.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                # Landing page (choose patient/staff)
│   ├── patient/page.tsx        # Patient intake form page
│   ├── staff/page.tsx          # Staff monitoring dashboard page
│   └── api/patients/route.ts   # GET current patients / POST an update (triggers Pusher event)
├── components/
│   ├── patient-form/           # Form container, sections, field wrapper, Zod schema
│   ├── staff-view/             # Dashboard, patient list/card, status badge
│   └── ui/                     # Reusable Input, Select, Badge primitives
├── hooks/
│   ├── useRealtimeSync.ts      # usePatientBroadcast (patient side) + useStaffRealtimeSync (staff side)
│   ├── useDebounce.ts          # Generic debounce hook
│   └── useNow.ts               # Ticking clock for "updated Xs ago" labels
└── lib/
    ├── pusher-server.ts        # Server Pusher client (singleton)
    ├── pusher-client.ts        # Browser Pusher client (singleton)
    ├── store.ts                # In-memory patient store used by the API route
    ├── types.ts                # Shared PatientData / PatientStatus types
    ├── constants.ts            # Channel/event names, timing constants
    ├── patient-id.ts           # Per-tab patient session id (sessionStorage)
    └── format.ts                # Relative time / age formatting helpers
```

## Real-Time Synchronization Flow

1. On mount, the patient form generates (or reuses, via `sessionStorage`) a unique `patientId` for that browser tab.
2. As the patient types, `react-hook-form`'s `watch()` feeds the current values into `usePatientBroadcast`, which debounces changes (500ms) and `POST`s them to `/api/patients` with `status: "active"`.
3. `/api/patients` merges the patch into an in-memory store, then calls `pusherServer.trigger()` to broadcast a `patient-update` event on the shared `patients-channel`.
4. The staff dashboard subscribes to `patients-channel` via `pusher-js` and merges each incoming event into its local patient map — no polling.
5. If the patient stops typing for 6 seconds, the form sends `status: "inactive"`. On submit, it sends `status: "submitted"` after server-side Zod validation passes; the staff card badge updates accordingly (blue "Filling in" → gray "Inactive" / green "Submitted").
6. On tab close, `navigator.sendBeacon` best-effort notifies the server the patient went inactive.
7. When the staff dashboard first loads, it also `GET`s `/api/patients` to hydrate with anyone already mid-form, then relies on Pusher for live updates from that point on.

### Known limitation

The patient store (`src/lib/store.ts`) is in-memory, scoped to a single server process. This keeps the demo dependency-free, but on serverless platforms with multiple concurrent instances, `GET /api/patients` may not reflect state written to a different instance until Pusher's live event catches it up. For a production deployment, swap `store.ts` for a shared store (e.g. Redis, Vercel KV, or a database).

## Design Decisions

- **Responsive layout**: form sections and the patient card grid use Tailwind's responsive utilities (`sm:`, `xl:`) to go from a single column on mobile to a 2–3 column grid on desktop.
- **Debounced sync**: field updates are debounced client-side (500ms) rather than sent on every keystroke, to keep the Pusher event volume and API load reasonable.
- **Status indicators**: `active` (patient typed in the last 6s) is shown with a pulsing blue dot, `inactive` with a gray dot, `submitted` with a green dot — giving staff an at-a-glance read on every patient without opening their record.
- **Lenient mid-typing validation**: partial/invalid field values are still broadcast while typing (so staff see progress in real time), but the server enforces full Zod validation before accepting a `submitted` status.
