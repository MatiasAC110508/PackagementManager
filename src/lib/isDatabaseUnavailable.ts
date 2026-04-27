export function isDatabaseUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : "";

  return (
    code === "ETIMEDOUT" ||
    code === "ENETUNREACH" ||
    code === "ECONNREFUSED" ||
    code === "P1001" ||
    message.includes("ETIMEDOUT") ||
    message.includes("ENETUNREACH") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Can't reach database server") ||
    message.includes("Unable to connect to the database")
  );
}
