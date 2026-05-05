'use client';
import { startTransition, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Input from '../input';
import AppButton from '../ui/AppButton';
import Alert from '../ui/Alert';

type FeedbackState = {
    text: string;
    variant: "error" | "success";
} | null;

function LoginFormInner() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const created = searchParams.get("created");
        const registeredEmail = searchParams.get("email");
        if (registeredEmail) {
            setEmail(registeredEmail);
        }
        if (created === "1") {
            setFeedback({
                text: "Account created successfully. Sign in to open the dashboard.",
                variant: "success",
            });
        }
    }, [searchParams]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const normalizedPassword = password.trim();
            setFeedback(null);
            if (!normalizedEmail || !normalizedPassword) {
                throw new Error("Email and password are required");
            }
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
            });
            const data = await res.json().catch(() => ({
                message: "Unexpected response from the server",
            }));
            if (!res.ok) {
                throw new Error(data.message || "Unable to sign in");
            }
            setFeedback({
                text: "Sign-in successful. Opening the shipment dashboard...",
                variant: "success",
            });
            await Swal.fire({
                title: "Welcome back",
                text: "Opening your shipment dashboard.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
            });
            localStorage.setItem(
                "signed-in-user",
                JSON.stringify(data.user ?? { email: normalizedEmail })
            );
            if (typeof data.accessToken === "string") {
                localStorage.setItem("auth-access-token", data.accessToken);
            }
            window.setTimeout(() => {
                startTransition(() => {
                    router.replace('/dashboard', { scroll: false });
                });
            }, 500);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            setFeedback({
                text: errorMessage,
                variant: "error",
            });
            await Swal.fire({
                title: "Sign-in failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Try again",
                confirmButtonColor: "#1a1917",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="mx-auto w-full max-w-md space-y-5 text-left" onSubmit={handleSubmit}>
            <Input
                autoComplete="email"
                label="Work email"
                name="email"
                placeholder="ops@company.com"
                type="email"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
            />
            <Input
                autoComplete="current-password"
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                required
                onChange={(event) => setPassword(event.target.value)}
            />
            {feedback ? (
                <Alert variant={feedback.variant}>
                    {feedback.text}
                </Alert>
            ) : null}
            <AppButton fullWidth disabled={loading} type="submit">
                {loading ? "Opening portal..." : "Open portal"}
            </AppButton>
            <p className="text-center text-sm text-[color:var(--muted)]">
                Need access?{" "}
                <Link className="font-medium text-[color:var(--foreground)] hover:text-[var(--accent-strong)]" href="/register">
                    Request an account
                </Link>
            </p>
        </form>
    );
}

export default function LoginForm() {
    return (
        <Suspense>
            <LoginFormInner />
        </Suspense>
    );
}
