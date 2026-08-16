export function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-linear-to-b from-blue-50 via-white to-slate-50"
    >
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute -bottom-16 left-1/4 h-64 w-64 rounded-full bg-teal-100/40 blur-3xl" />

      <div className="absolute right-8 top-20 h-14 w-14 rounded-full border-4 border-blue-200/70 sm:right-16 sm:top-24" />

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="absolute left-8 top-1/2 h-6 w-6 text-blue-300/60 sm:left-16"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="absolute right-[15%] bottom-24 h-5 w-5 text-indigo-300/50"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>

      <div
        className="absolute bottom-6 left-6 h-28 w-28 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
    </div>
  );
}
