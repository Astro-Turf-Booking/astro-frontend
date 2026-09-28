import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="TurfZone home">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 2 30 26H2L16 2Z" fill="currentColor" />
        <path d="m16 12 7 12H9l7-12Z" fill="var(--paper)" />
        <path d="M16 19v11" stroke="currentColor" strokeWidth="4" />
      </svg>
      turfzone<span className="brand-dot">®</span>
    </Link>
  );
}
