import { User } from "@/types/user";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function registerUser(user: User): Promise<void> {
    // Registration stays intentionally small: check uniqueness, hash the password,
    // and store the user so the client can immediately sign in afterwards.
    const validateRegister = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (validateRegister) {
        throw new Error("An account with this email already exists");
    }

    const hashed = await hashPassword(user.password);

    await prisma.user.create({
        data: {
            email: user.email,
            password: hashed
        }
    });
}
