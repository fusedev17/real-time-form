import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#f4f3ee]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00000009 1px, transparent 1px), linear-gradient(to bottom, #00000009 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative flex flex-1 flex-col items-center px-4 pt-20 pb-12 sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#faf9f5] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[#5b5a52]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c8683f]" />
          Front Desk · Registration Kiosk 2
        </span>

        <h1 className="mt-8 max-w-3xl text-center font-serif text-5xl leading-[1.1] text-[#20241f] italic sm:text-6xl">
          Two views.
          <br />
          One patient, <span className="not-italic text-[#5c7360]">zero delay.</span>
        </h1>

        <p className="mt-6 max-w-lg text-center text-[15px] leading-relaxed text-[#6b6a61]">
          The tablet at check-in and the monitor at the nurse station show the same patient, at
          the same time — no paper clipboard, no calling a name into the waiting room.
        </p>

        <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/patient"
            className="group flex flex-col rounded-2xl border border-black/10 bg-[#fbfaf7] p-7 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#5c7360]">
              Check-In
            </span>
            <span className="mt-2 font-serif text-2xl font-semibold text-[#20241f]">
              Registration Form
            </span>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6a61]">
              Hand the tablet to a patient at arrival. Name, contact, and emergency details save
              as they type, no submit-and-hope.
            </p>
            <span className="mt-6 font-mono text-sm font-medium text-[#5c7360] transition group-hover:translate-x-0.5">
              Open kiosk form →
            </span>
            <span className="mt-5 border-t border-dashed border-black/10 pt-4 font-mono text-[11px] text-[#8c8b81]">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#5c7360] align-middle" />
              Kiosk 2 idle · last used 6 min ago
            </span>
          </Link>

          <Link
            href="/staff"
            className="group flex flex-col rounded-2xl border border-black/10 bg-[#fbfaf7] p-7 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#5c7360]">
              Nurse Station
            </span>
            <span className="mt-2 font-serif text-2xl font-semibold text-[#20241f]">
              Intake Monitor
            </span>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6a61]">
              See who&apos;s mid-form, who just finished, and who&apos;s been waiting — updated as
              it happens, not on refresh.
            </p>
            <span className="mt-6 font-mono text-sm font-medium text-[#5c7360] transition group-hover:translate-x-0.5">
              Open floor view →
            </span>
            <span className="mt-5 border-t border-dashed border-black/10 pt-4 font-mono text-[11px] text-[#8c8b81]">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#c8683f] align-middle" />
              4 checked in this morning
            </span>
          </Link>
        </div>

        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.15em] text-[#9b9a90]">
          Front Desk Ops — Registration &amp; Intake
        </p>
      </div>
    </div>
  );
}
