# AstroZone

A minimal landing page for a football pitch booking and turf management platform, built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Development

```sh
bun install
bun dev
```

Open http://localhost:3000. Use `bun run build` for a production build, `bun run start` to serve it, and `bun run lint` to run ESLint.

## Page structure

- `app/page.tsx`: server-rendered landing page and pitch illustration.
- `app/landing-interactions.tsx`: player and owner dialogs, local listing-draft download, and scroll reveals.
- `app/globals.css`: responsive layout, colors, illustration styles, and reduced-motion support.
- `app/layout.tsx`: metadata and self-hosted Zodiak Bold / Plus Jakarta Sans Regular fonts.
- `app/icon.svg`: AstroZone favicon.

The pitch finder currently shows a pre-launch message; it does not query live inventory. Owners can download a readable listing draft to their device. There is no backend, authentication, booking, payment, or publishing integration yet. Form values are not sent to a server.
