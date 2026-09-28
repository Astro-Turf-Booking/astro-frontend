import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: "../public/fonts/plus-jakarta-sans-regular.woff2",
  variable: "--font-jakarta",
  weight: "400",
  display: "swap",
});

const zodiak = localFont({
  src: "../public/fonts/zodiak-bold.woff2",
  variable: "--font-zodiak",
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TurfZone — Good grounds. Great games.",
  description: "Find your next football pitch. TurfZone connects players with local turfs and helps turf owners manage their pitches, availability, and bookings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${zodiak.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
