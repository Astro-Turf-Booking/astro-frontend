import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Sign up — TurfZone",
  description:
    "Join TurfZone to find your next football pitch or give your turf a home.",
};

export default function SignupPage() {
  return (
    <>
      <section className="auth-intro" aria-labelledby="signup-heading">
        <p className="eyebrow">YOUR PEOPLE. YOUR GAME.</p>
        <h1 id="signup-heading">
          Every great game
          <br />
          starts somewhere.
        </h1>
        <p>
          Find a pitch for your people, or bring more players to yours. There’s
          a place for you here.
        </p>
        <div className="auth-intro-note"> One community. A shared love of
          football.
        </div>
      </section>
      <section className="auth-panel" aria-labelledby="signup-form-heading">
        <h2 id="signup-form-heading">Join the game.</h2>
        <p className="auth-panel-description">
          Let’s get you started with TurfZone.
        </p>
        <AuthForm mode="signup" />
        <p className="auth-switch">
          Already part of the team? <Link href="/login">Log in</Link>
        </p>
      </section>
    </>
  );
}
