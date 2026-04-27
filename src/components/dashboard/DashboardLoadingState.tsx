export default function DashboardLoadingState() {
  return (
    <section className="surface-panel flex w-full items-center justify-center rounded-[2.4rem] px-6 py-16">
      <div className="text-center">
        <p className="section-label text-xs">Dashboard</p>
        <h1 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)]">
          Preparing shipment control
        </h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          Checking your session and loading the live shipment workspace.
        </p>
      </div>
    </section>
  );
}
