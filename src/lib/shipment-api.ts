import { NextResponse } from "next/server";

export function getUserIdFromRequest(request: Request) {
  // The proxy injects the authenticated user id into the request headers.
  // Every protected shipment route reads it through this helper.
  const userId = Number(request.headers.get("x-user-id"));

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export function handleShipmentApiError(error: unknown) {
  // Keeping API error mapping in one helper makes all shipment routes return
  // the same HTTP semantics for auth, validation, and not-found states.
  const message = error instanceof Error ? error.message : "Unexpected error";

  if (message === "Unauthorized") {
    return NextResponse.json({ message }, { status: 401 });
  }

  if (message === "Shipment not found") {
    return NextResponse.json({ message }, { status: 404 });
  }

  if (
    message.includes("required") ||
    message === "Invalid shipment payload" ||
    message === "Invalid shipment status"
  ) {
    return NextResponse.json({ message }, { status: 400 });
  }

  return NextResponse.json({ message }, { status: 500 });
}
