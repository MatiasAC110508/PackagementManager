import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Request portal access"
      description="Create a client account for quotes, route coordination, and shipment updates."
      footer="New accounts are reviewed before activation."
    >
      <RegisterForm />
    </AuthShell>
  );
}
