# TurfZone

A minimal landing page for a football pitch booking and turf management platform, built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Development

```sh
bun install
bun dev
```

Open http://localhost:3000. Use `bun run build` for a production build, `bun run start` to serve it, and `bun run lint` to run ESLint.

## Page structure

- `app/page.tsx`: server-rendered landing page and pitch illustration.
- `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx`: `/login` and `/signup` pages.
- `app/(auth)/auth-form.tsx`: accessible login/signup forms with player and turf-owner options. Authentication is not connected; submissions show a launch notice and do not save credentials.
- `app/landing-interactions.tsx`: player and owner dialogs, local listing-draft download, and scroll reveals.
- `app/globals.css`: responsive layout, colors, illustration styles, and reduced-motion support.
- `app/layout.tsx`: metadata and self-hosted Zodiak Bold / Plus Jakarta Sans Regular fonts.
- `app/icon.svg`: TurfZone favicon.

The pitch finder currently shows a pre-launch message; it does not query live inventory. Owners can download a readable listing draft to their device. There is no backend, authentication, booking, payment, or publishing integration yet. Form values are not sent to a server.
