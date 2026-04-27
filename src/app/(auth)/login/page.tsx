import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Client sign in"
      description="Access shipment visibility, route notes, and heavy cargo delivery updates."
      footer="Secure portal for approved heavy cargo clients."
    >
      <LoginForm />
    </AuthShell>
  );
}
