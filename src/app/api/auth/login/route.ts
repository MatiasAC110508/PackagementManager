import { LoginUser } from "@/services/loginUser";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Route handlers only normalize and validate request data.
        // The actual credential check lives in the auth service.
        const { email, password } = await req.json();
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const normalizedPassword = typeof password === "string" ? password.trim() : "";

        if (!normalizedEmail || !normalizedPassword) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }
        const user = await LoginUser({ email: normalizedEmail, password: normalizedPassword });

        // The access token goes back to the client while the refresh token stays
        // in an HTTP-only cookie for future token refresh requests.
        const res = NextResponse.json({
            message: "Sign-in successful",
            accessToken: user.accessToken,
            user: user.user
        });

        res.cookies.set("refreshToken", user.refreshToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return res;

    } catch (error: unknown) {

        const message = error instanceof Error ? error.message : "Unexpected error";
        const statusCode =
            message === "No account was found for this email" ||
            message === "The password is incorrect"
                ? 401
                : 500;

        return NextResponse.json(
            { message },
            { status: statusCode }
        );
    }
}
