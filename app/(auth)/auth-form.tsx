"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, register } from "../lib/auth";
import { toast } from "../lib/toast";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = mode === "signup";

  // Form field state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isSignup) {
        const result = await register({
          email: email.trim(),
          full_name: fullName.trim(),
          password,
          phone_number: phoneNumber.trim() || undefined,
        });

        if (!result.ok) {
          setErrorMessage(result.error);
          toast.error(result.error);
          setIsLoading(false);
          return;
        }

        const displayName =
          result.data?.user?.full_name || fullName.trim() || "player";
        const welcomeText = `Welcome to TurfZone, ${displayName}!`;
        setSuccessMessage("Account created successfully! Taking you to the game...");
        toast.success(welcomeText);

        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 700);
      } else {
        const result = await login({
          email: email.trim(),
          password,
        });

        if (!result.ok) {
          setErrorMessage(result.error);
          toast.error(result.error);
          setIsLoading(false);
          return;
        }

        const welcomeText = result.data.user?.full_name
          ? `Welcome back, ${result.data.user.full_name}!`
          : "Welcome back!";
        setSuccessMessage("Signed in successfully! Heading to your pitch...");
        toast.success(welcomeText);

        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 600);
      }
    } catch {
      const fallbackErr = "An unexpected error occurred. Please try again.";
      setErrorMessage(fallbackErr);
      toast.error(fallbackErr);
      setIsLoading(false);
    }
  }

  return (
    <form
      className="auth-form"
      method="post"
      onSubmit={handleSubmit}
      onChange={() => {
        if (errorMessage) setErrorMessage("");
      }}
    >
      {isSignup && (
        <>
          <div className="auth-field">
            <label htmlFor="full-name">Full name</label>
            <input
              id="full-name"
              name="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              placeholder="Your full name"
              required
              pattern=".*\S.*"
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="phone-number">Phone number</label>
            <input
              id="phone-number"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="tel"
              placeholder="+233 24 123 4567"
              maxLength={20}
              disabled={isLoading}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={254}
          autoCapitalize="none"
          spellCheck={false}
          disabled={isLoading}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Password</label>
        <div className="auth-password">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={isSignup ? 8 : undefined}
            aria-describedby={isSignup ? "password-hint" : undefined}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls="password"
            aria-pressed={showPassword}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {isSignup && (
          <small id="password-hint">Use at least 8 characters.</small>
        )}
      </div>

      <button
        type="submit"
        className="button button-green auth-submit"
        disabled={isLoading}
      >
        {isLoading
          ? isSignup
            ? "Creating account..."
            : "Signing in..."
          : isSignup
          ? "Create account"
          : "Log in"}
      </button>

      {errorMessage && (
        <p className="auth-message auth-error" role="alert" aria-live="assertive">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="auth-message" role="status" aria-live="polite">
          {successMessage}
        </p>
      )}
    </form>
  );
}
