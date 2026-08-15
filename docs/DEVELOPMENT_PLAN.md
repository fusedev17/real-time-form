# Development Plan

## Project Structure

```
real-time-form/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, fonts, metadata
│   │   ├── page.tsx                  # Landing page (choose Patient / Staff)
│   │   ├── patient/
│   │   │   └── page.tsx              # Patient intake form page
│   │   ├── staff/
│   │   │   └── page.tsx              # Staff monitoring dashboard page
│   │   └── api/
│   │       └── patients/
│   │           └── route.ts          # GET current patients / POST an update, triggers Pusher event
│   │
│   ├── components/
│   │   ├── patient-form/
│   │   │   ├── PatientForm.tsx       # Container: react-hook-form + Zod + realtime broadcast
│   │   │   ├── FormField.tsx         # Label + input + error message wrapper
│   │   │   ├── PersonalInfoSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── EmergencyContactSection.tsx
│   │   │   └── validation.ts         # Zod schema + default values
│   │   │
│   │   ├── staff-view/
│   │   │   ├── StaffDashboard.tsx    # Search/filter + live patient grid
│   │   │   ├── PatientCard.tsx       # One patient's data, rendered live
│   │   │   ├── StatusIndicator.tsx   # active / inactive / submitted badge
│   │   │   └── PatientList.tsx       # Grid + empty state
│   │   │
│   │   └── ui/                       # Reusable primitives
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── Badge.tsx
│   │
│   ├── hooks/
│   │   ├── useRealtimeSync.ts        # usePatientBroadcast (send) + useStaffRealtimeSync (receive)
│   │   ├── useDebounce.ts            # Generic value-debounce hook
│   │   └── useNow.ts                 # Ticking clock for relative timestamps
│   │
│   └── lib/
│       ├── pusher-server.ts          # Server-side Pusher client (singleton)
│       ├── pusher-client.ts          # Browser Pusher client (singleton)
│       ├── store.ts                  # Upstash Redis-backed patient store, shared across all serverless instances
│       ├── types.ts                  # PatientData / PatientStatus / PatientFormValues
│       ├── constants.ts              # Channel + event names, debounce/inactivity timings
│       ├── patient-id.ts             # Per-tab patient id via sessionStorage
│       └── format.ts                 # Relative time / age helpers
│
├── .env.local.example
├── postcss.config.mjs                # Tailwind v4 (no tailwind.config.ts needed)
├── next.config.ts
├── README.md
└── docs/
    └── DEVELOPMENT_PLAN.md
```

Notes on how this differs from the original sketch:
- Real-time transport is **Pusher Channels**, not a custom WebSocket server — this keeps the app deployable on Vercel's standard serverless functions with no server to run or scale ourselves.
- The API surface is a single `api/patients/route.ts` (`GET` for initial hydration, `POST` for both field updates and status changes) rather than a separate `trigger-event` route, since both patient field patches and status pings need the same validate-merge-broadcast logic.
- TailwindCSS v4 configures itself via `@import "tailwindcss"` in `globals.css` and `postcss.config.mjs`; there is no `tailwind.config.ts` file to maintain.

## Design

- **Mobile-first, responsive at every breakpoint**: form sections stack into a single column below `sm`, and expand into 2–3 columns above it (`sm:grid-cols-2`, `sm:grid-cols-3`). The staff patient grid follows the same pattern, expanding to 3 columns at `xl`.
- **Two audiences, two layouts**: the patient form is a narrow, single-column, distraction-free `max-w-2xl` column optimized for focused data entry. The staff dashboard is a wide `max-w-6xl` grid optimized for scanning many patients at once.
- **Status at a glance**: color-coded badges (blue pulsing = actively typing, gray = inactive, green = submitted) let staff triage without reading every field.
- **Non-blocking validation**: the patient form validates on blur (not on every keystroke) so error messages don't flash while the user is still typing; the staff view is not gated by validation at all — it shows partial/in-progress data as-is so staff see real-time progress, only trusting a record as complete once its `status` is `submitted`.

## Component Architecture

| Component | Purpose |
|---|---|
| `PatientForm` | Owns form state (`react-hook-form` + Zod resolver), assigns a per-tab `patientId`, wires `usePatientBroadcast`, renders the post-submit success state. |
| `PersonalInfoSection` / `ContactSection` / `EmergencyContactSection` | Presentational field groups; take `register`/`errors` from the parent form and render nothing else. |
| `FormField` | Label, optional-badge, error message — shared chrome around every input. |
| `StaffDashboard` | Owns search text + status filter state, subscribes via `useStaffRealtimeSync`, renders the connection indicator and filtered `PatientList`. |
| `PatientCard` | Renders one patient's full record plus a relative "updated Xs ago" timestamp; re-renders live as new Pusher events arrive for that id. |
| `StatusIndicator` | Maps `PatientStatus` to a `Badge` tone/label (wraps the generic `ui/Badge`). |
| `ui/Input`, `ui/Select`, `ui/Badge` | Stateless, styling-only primitives reused across both patient and staff surfaces. |

## Real-Time Synchronization Flow

1. On mount, the patient form gets/creates a `patientId` (UUID) stored in `sessionStorage`, so a page refresh keeps identity but a new tab is treated as a new patient.
2. `react-hook-form`'s `watch()` streams live field values into `usePatientBroadcast`, which debounces them (500ms, `SYNC_DEBOUNCE_MS`) before sending.
3. Each debounced change is `POST`ed to `/api/patients` as `{ id, status: "active", patch }`.
4. The API route merges `patch` into the record for that `id`, stamps `updatedAt`, and writes it back via `patientStore.setUnlessSubmitted()`, then calls `pusherServer.trigger("patients-channel", "patient-update", record)`.
5. The staff dashboard's `pusher-js` client is subscribed to `patients-channel`; on every `patient-update` event it upserts that patient into local state — no polling, no refresh.
6. If the patient stops typing for 6 seconds (`INACTIVITY_TIMEOUT_MS`), a `status: "inactive"` patch is sent automatically. Closing/refreshing the tab fires a best-effort `navigator.sendBeacon` with the same inactive signal.
7. On submit, the form sends `status: "submitted"` with the full value set; the API re-validates the merged record against the same Zod schema server-side and only accepts the status change if it passes, closing the loop between client and server validation.
8. When the staff dashboard first mounts, it `GET`s `/api/patients` once to hydrate any patients already mid-form, then relies solely on Pusher events afterward.

### Store: Upstash Redis, with an atomic "submitted is terminal" guard

The patient store (`src/lib/store.ts`) is backed by Upstash Redis rather than an in-memory `Map`, because Vercel's serverless functions don't share process memory — two nearly-simultaneous requests for the same patient (e.g. a debounced "still typing" draft and the final "submitted" request) can be handled by two different instances that have never seen each other's writes.

That creates a real race: if a draft request that was sent *before* Submit happens to be *processed* after it, a plain "read the record, then write" would let it silently overwrite the submitted record back into a draft state — even though the submission itself succeeded and the patient already saw the confirmation screen.

`setUnlessSubmitted()` closes this with a small Lua script executed atomically inside Redis: it checks the currently-stored status and only writes if the existing record isn't already `"submitted"` (or the incoming write is itself a submission). Because Redis executes each script as a single atomic operation regardless of how many callers invoke it concurrently, this check-then-write can't be split by a race the way a separate GET-then-SET from Node could be — verified with 20 trials of 50 truly concurrent writes racing a single "submitted" write in random order; the store landed on the correct final state every time. `deleteUnlessSubmitted()` applies the same protection to record deletion (used when a patient abandons a blank form, or via the tab-close beacon), so a stray delete can't erase an already-submitted record either.
