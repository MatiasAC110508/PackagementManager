import { registerUser } from "@/services/registerUser";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // The register endpoint keeps the contract simple so the form can show
        // predictable feedback for required fields and duplicate accounts.
        const { email, password } = await req.json();
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const normalizedPassword = typeof password === "string" ? password.trim() : "";

        if (!normalizedEmail || !normalizedPassword) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await registerUser({ email: normalizedEmail, password: normalizedPassword });
        return NextResponse.json(
            { message: "Account created" },
            { status: 201 }
        );

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unexpected error";

        const statusCode = message.includes("already exists") ? 409 : 500;

        return NextResponse.json(
            { message },
            { status: statusCode }
        );
    }
}
