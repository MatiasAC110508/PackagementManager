import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ message: "Session closed" });

    res.cookies.set("refreshToken", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0)
    });

    return res;
}
