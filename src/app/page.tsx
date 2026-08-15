import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="flex justify-end px-4 pt-4 sm:px-6">
        <Link
          href="/staff"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
          </svg>
          Staff
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            aria-hidden
          >
            <rect x="6" y="4" width="12" height="17" rx="2" />
            <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
            <path d="m9.5 13 1.8 1.8L14.5 11" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Welcome</h1>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-slate-600 sm:text-lg">
          Please check in for your visit today. It only takes a few minutes.
        </p>

        <Link
          href="/patient"
          className="mt-8 inline-flex min-h-[56px] w-full max-w-xs items-center justify-center rounded-2xl bg-blue-600 px-8 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
        >
          Start Check-In
        </Link>
      </div>
    </div>
  );
}
