import Link from "next/link";
import { Brand } from "../components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <a href="#auth-main" className="skip-link">Skip to content</a>
      <header className="site-header wrap auth-header">
        <Brand href="/home" />
        <Link className="text-link" href="/home">Back to home</Link>
      </header>
      <main id="auth-main" className="auth-main wrap">{children}</main>
    </div>
  );
}
