import Image from "next/image";
import Link from "next/link";
import ImageUser from "../../public/user.png";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <header className="relative flex items-center justify-between px-4 pt-6 sm:px-8">
        <div className="animate-fade-in-up flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-slate-900">CareForm</p>
            <p className="text-xs text-slate-500">Real-time Patient Form</p>
          </div>
        </div>

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

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <span className="animate-fade-in-up inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 [animation-delay:40ms] mb-3">
          Patient Intake System
        </span>

       <h1 className="animate-fade-in-up max-w-xl text-balance text-xl font-bold leading-tight text-slate-900 [animation-delay:100ms] sm:text-2xl md:text-3xl">
          Fill It In Today, Tracked in <span className="text-blue-600">Real-time</span>
        </h1>
        <p className="animate-fade-in-up max-w-sm text-balance text-xs leading-relaxed text-slate-600 [animation-delay:160ms] sm:text-sm">
          Simple, fast intake — staff see it the instant you type.
        </p>

        <div className="animate-fade-in-up mt-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm [animation-delay:220ms] sm:p-8">
          <div className="relative flex items-end justify-center overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 to-teal-50 pt-6">
            <Image
              src={ImageUser}
              alt=""
              className="h-48 w-auto object-contain"
              priority
            />
            <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-teal-600 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M12 21s-6.7-4.35-9.3-8.2C1 10.1 1.6 6.6 4.6 5.1c2.2-1.1 4.6-.3 5.9 1.6l1.5 2 1.5-2c1.3-1.9 3.7-2.7 5.9-1.6 3 1.5 3.6 5 1.9 7.7C18.7 16.65 12 21 12 21Z" />
              </svg>
            </span>
          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-900">Patient Form</h2>
          <p className="text-sm font-medium text-slate-500">Patient intake</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Fill in health details and medical history — simple, convenient, and fast.
          </p>

          <Link
            href="/patient"
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98] active:bg-blue-800"
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
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Start Check-In
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
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
