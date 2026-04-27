'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Input from '../input';
import AppButton from '../ui/AppButton';
import Alert from '../ui/Alert';

type FeedbackState = {
    text: string;
    variant: "error" | "success";
} | null;

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        try {
            // Registration and auto-login share the same normalized credentials
            // so the new account can move into the dashboard without extra typing.
            const normalizedEmail = email.trim().toLowerCase();
            const normalizedPassword = password.trim();

            setFeedback(null);

            if (!normalizedEmail || !normalizedPassword) {
                throw new Error("Email and password are required");
            }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
            });

            const data = await res.json().catch(() => ({
                message: "Unexpected response from the server",
            }));

            if (!res.ok) {
                throw new Error(data.message || "error");
            }

            // Keeping a lightweight marker helps the login page prefill the email
            // if the automatic sign-in step ever needs to fall back.
            localStorage.setItem("registered-user", JSON.stringify({ email: normalizedEmail }));

            setFeedback({
                text: "Account created successfully. Signing you in now...",
                variant: "success",
            });

            await Swal.fire({
                title: "Account created",
                text: "Your portal access is ready. Signing you in now.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
            });

            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
            });

            const loginData = await loginRes.json().catch(() => ({
                message: "Unexpected response from the server",
            }));

            if (loginRes.ok) {
                setFeedback({
                    text: "Sign-in successful. Opening the dashboard...",
                    variant: "success",
                });

                // The new account is stored locally only for the dashboard shell.
                // Protected shipment actions still rely on the access token.
                localStorage.setItem(
                    "signed-in-user",
                    JSON.stringify(loginData.user ?? { email: normalizedEmail })
                );

                if (typeof loginData.accessToken === "string") {
                    localStorage.setItem("auth-access-token", loginData.accessToken);
                }

                router.replace('/dashboard', { scroll: false });

                return;
            }

            const loginError =
                typeof loginData.message === "string" && loginData.message.length > 0
                    ? loginData.message
                    : "The account was created, but automatic sign-in failed";

            setFeedback({
                text: `${loginError}. Please sign in manually.`,
                variant: "error",
            });

            await Swal.fire({
                title: "Sign-in required",
                text: `${loginError}. You can sign in manually now.`,
                icon: "warning",
                confirmButtonText: "Go to sign in",
                confirmButtonColor: "#1a1917",
            });

            router.replace(`/login?created=1&email=${encodeURIComponent(normalizedEmail)}`);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            setFeedback({
                text: errorMessage,
                variant: "error",
            });

            await Swal.fire({
                title: "Registration failed",
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
        autoComplete="new-password"
        label="Password"
        name="password"
        placeholder="Create a password"
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
        {loading ? "Creating access..." : "Create account"}
      </AppButton>

      <p className="text-center text-sm text-[color:var(--muted)]">
        Already approved?{" "}
        <Link className="font-medium text-[color:var(--foreground)] hover:text-[var(--accent-strong)]" href="/login">
          Sign in
        </Link>
      </p>
    </form>
    );
}
