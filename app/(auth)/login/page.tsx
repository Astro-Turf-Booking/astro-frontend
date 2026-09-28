import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Log in — TurfZone",
  description: "Log in to TurfZone. Your next game starts here.",
};

export default function LoginPage() {
  return (
    <>
      <section className="auth-intro" aria-labelledby="login-heading">
        <p className="eyebrow">BACK IN THE GAME</p>
        <h1 id="login-heading">
          Good to have
          <br />
          you back.
        </h1>
        <p>
          Your next match. Your favourite ground. Pick up where you left off.
        </p>
        <div className="auth-intro-note"> There’s always room for one more
          game.
        </div>
      </section>
      <section className="auth-panel" aria-labelledby="login-form-heading">
        <h2 id="login-form-heading">Log in to TurfZone</h2>
        <p className="auth-panel-description">A little closer to kick-off.</p>
        <AuthForm mode="login" />
        <p className="auth-switch">
          New to TurfZone? <Link href="/signup">Sign up</Link>
        </p>
      </section>
    </>
  );
}
