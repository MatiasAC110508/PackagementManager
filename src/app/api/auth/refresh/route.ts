import { NextResponse } from "next/server";
import { validateRefreshToken, generateAccessToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ message: "No refresh token was provided" }, { status: 401 });
        }

        const decoded = await validateRefreshToken(refreshToken);

        if (!decoded) {
            return NextResponse.json({ message: "Refresh token is invalid or expired" }, { status: 403 });
        }

        const newPayload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        const newAccessToken = await generateAccessToken(newPayload);

        return NextResponse.json({
            accessToken: newAccessToken
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";

        return NextResponse.json({ message: "Unable to refresh the token", error: errorMessage }, { status: 500 });
    }
}
