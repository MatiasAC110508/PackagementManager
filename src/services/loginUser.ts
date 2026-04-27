import { User } from "@/types/user";
import prisma from "@/lib/db";
import { compareHashed } from "@/lib/hash";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function LoginUser(user: User) {
    // The auth service validates credentials directly against Prisma so every
    // successful login returns a fresh access token and refresh token pair.
    const validateUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (!validateUser) {
        throw new Error("No account was found for this email");
    }

    const validateHash = await compareHashed(user.password, validateUser.password);
    if (!validateHash) {
        throw new Error("The password is incorrect");
    }

    const payload = {
        id: validateUser.id,
        email: validateUser.email,
        role: validateUser.role
    };

    return {
        accessToken: await generateAccessToken(payload),
        refreshToken: await generateRefreshToken(payload),
        user: {
            id: validateUser.id,
            email: validateUser.email,
            role: validateUser.role
        }
    };
}
