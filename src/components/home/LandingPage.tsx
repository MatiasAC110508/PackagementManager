import Link from "next/link";
import AppLogo from "../ui/AppLogo";

const serviceItems = [
  {
    title: "Project Cargo",
    description: "Oversized machinery and industrial freight with route planning.",
  },
  {
    title: "Port to Site",
    description: "Short, clear visibility from terminal pickup to final delivery.",
  },
  {
    title: "Permit Control",
    description: "Critical documents, escorts, and milestones in one quiet flow.",
  },
];

const stats = [
  { label: "Coverage", value: "Road, port, yard" },
  { label: "Loads", value: "Oversized / overweight" },
  { label: "Updates", value: "Clients stay informed" },
];

const snapshotRows = [
  { label: "Load", value: "52t transformer unit" },
  { label: "Mode", value: "Heavy haul + escort" },
  { label: "Lane", value: "Port to plant delivery" },
  { label: "Status", value: "Permit review in progress" },
];

const steps = [
  "Scope the cargo and route requirements.",
  "Align permits, escorts, and timing.",
  "Deliver with one source of truth.",
];

export default function LandingPage() {
  return (
    <section className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.32fr)_minmax(20rem,0.68fr)]">
      <section className="surface-panel relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8 lg:p-10 animate-fade-up">
        <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-[var(--accent-soft)] blur-3xl" />

        <div className="relative flex h-full flex-col gap-10">
          <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-center sm:justify-between">
            <AppLogo />
            <p className="max-w-xs text-sm leading-6 text-[color:var(--muted)]">
              A minimal client portal for heavy cargo planning, shipment visibility, and
              route-critical updates.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.48fr)] lg:items-start">
            <div className="space-y-6">
              <p className="section-label text-xs">Heavy Cargo Shipping</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] text-[color:var(--foreground)] sm:text-5xl xl:text-[4rem]">
                Oversized freight,
                <br />
                handled with less noise.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
                Plan quotes, permits, route notes, and delivery milestones from one focused
                portal built for industrial cargo teams.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex min-w-44 items-center justify-center rounded-[1.2rem] bg-[#1a1917] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(24,22,19,0.14)] hover:bg-[#2a2926]"
                >
                  Request access
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-w-44 items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-white/72 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] hover:bg-white"
                >
                  Client sign in
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.55rem] border border-[var(--line)] bg-white/72 p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {serviceItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.55rem] border border-[var(--line)] bg-white/68 p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="surface-panel-strong grid gap-5 rounded-[2.5rem] p-6 sm:p-7 animate-fade-up-delay">
        <div className="space-y-3">
          <p className="section-label text-xs">Live Snapshot</p>
          <h2 className="text-2xl font-semibold leading-tight text-[color:var(--foreground)]">
            One place for the details that usually get buried.
          </h2>
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            Keep route context clear for shippers, brokers, and on-site teams.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-5">
          <div className="space-y-3">
            {snapshotRows.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-3 last:border-b-0 last:pb-0 first:pt-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {item.label}
                </p>
                <p className="max-w-[12rem] text-right text-sm leading-6 text-[color:var(--foreground)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ol className="grid gap-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white/72 px-4 py-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
                Step {index + 1}
              </p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{step}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-[1.75rem] border border-[var(--line)] bg-[#1c1b19] px-5 py-6 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/56">
            Who It Is For
          </p>
          <p className="mt-3 text-sm leading-6 text-white/78">
            Built for teams moving equipment, steel, modules, and other heavy freight that
            cannot afford scattered updates.
          </p>
        </div>
      </aside>
    </section>
  );
}
