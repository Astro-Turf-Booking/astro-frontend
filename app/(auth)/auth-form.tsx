"use client";

import { useState, type FormEvent } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      isSignup
        ? "Sign-ups aren’t open just yet. Please check back at launch to create your account. Your details haven’t been saved."
        : "Log in will be available when TurfZone launches. Your details haven’t been sent.",
    );
  }

  return (
    <form
      className="auth-form"
      method="post"
      onSubmit={handleSubmit}
      onChange={() => setMessage("")}
    >
      {isSignup && (
        <>
          <fieldset className="auth-role">
            <legend>I’m here as a</legend>
            <div className="auth-role-options">
              <label>
                <input type="radio" name="role" value="player" defaultChecked />
                Player
              </label>
              <label>
                <input type="radio" name="role" value="owner" />
                Turf owner
              </label>
            </div>
          </fieldset>
          <div className="auth-field">
            <label htmlFor="full-name">Full name</label>
            <input
              id="full-name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              required
              pattern=".*\S.*"
              maxLength={100}
            />
          </div>
        </>
      )}
      <div className="auth-field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={254}
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>
      <div className="auth-field">
        <label htmlFor="password">Password</label>
        <div className="auth-password">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={isSignup ? 8 : undefined}
            aria-describedby={isSignup ? "password-hint" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls="password"
            aria-pressed={showPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {isSignup && (
          <small id="password-hint">Use at least 8 characters.</small>
        )}
      </div>
      <button type="submit" className="button button-green auth-submit">
        {isSignup ? "Create account" : "Log in"}
      </button>
      {/* <p className="auth-availability">
        {isSignup ? "Account registration" : "Account access"} will be available
        at launch.
      </p> */}
      {/* <p className="auth-message" role="status" aria-live="polite">
        {message}
      </p> */}
    </form>
  );
}
