import Link from "next/link";

export default function AppLogo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded-[1.35rem] border border-[var(--line)] bg-white/72 px-3 py-3 text-left text-sm text-[color:var(--foreground)] hover:bg-white"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[#1d1c1a] text-xs font-semibold tracking-[0.18em] text-white">
        IH
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] font-semibold tracking-[0.26em] uppercase text-[color:var(--muted)]">
          Heavy Cargo
        </span>
        <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground)]">
          IronHaul
        </span>
      </span>
    </Link>
  );
}
