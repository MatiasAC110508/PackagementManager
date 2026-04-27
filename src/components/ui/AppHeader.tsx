import AppLogo from "./AppLogo";

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <AppLogo />
      <p className="hidden text-right text-xs uppercase tracking-[0.22em] text-[color:var(--muted)] md:block">
        Client freight portal
      </p>
    </header>
  );
}
