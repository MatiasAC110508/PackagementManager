import type { ShipmentStatus } from "@/types/shipment";

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string, now: number) {
  const deltaMs = now - new Date(value).getTime();
  const deltaMinutes = Math.max(1, Math.floor(deltaMs / 60000));

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays}d ago`;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function statusPillClass(status: ShipmentStatus) {
  if (status === "DELIVERED") {
    return "border-emerald-200/70 bg-emerald-100 text-emerald-900";
  }

  if (status === "IN_TRANSIT") {
    return "border-amber-200/80 bg-amber-100 text-amber-900";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function progressWidth(status: ShipmentStatus) {
  if (status === "DELIVERED") {
    return "100%";
  }

  if (status === "IN_TRANSIT") {
    return "66%";
  }

  return "24%";
}

export async function readJson(response: Response) {
  return response.json().catch(() => ({
    message: "Unexpected response from the server",
  }));
}
