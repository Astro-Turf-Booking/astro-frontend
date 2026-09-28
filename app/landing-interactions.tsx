"use client";

import { useEffect, useRef, useState, type ReactNode, type FormEvent } from "react";

export function ActionButton({ kind, className, children }: { kind: "player" | "owner"; className?: string; children: ReactNode }) {
  return <button className={className} onClick={() => window.dispatchEvent(new CustomEvent("turfzone:open", { detail: kind }))}>{children}</button>;
}

export function LandingInteractions() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<"player" | "owner">("player");
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const open = (event: Event) => {
      setKind((event as CustomEvent<"player" | "owner">).detail);
      setSubmitted(false);
      setLocation("");
      dialog.current?.showModal();
    };
    window.addEventListener("turfzone:open", open);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(element => {
      element.classList.add("reveal-ready");
      observer.observe(element);
    });
    return () => { window.removeEventListener("turfzone:open", open); observer.disconnect(); };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (kind === "owner") {
      const draft = `TURFZONE — YOUR TURF LISTING DRAFT\n\nTurf: ${data.get("name")}\nLocation: ${data.get("location")}\nGame format: ${data.get("format")}\n\nThis is a draft for your records. Your turf has not been published.\n`;
      const url = URL.createObjectURL(new Blob([draft], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "turfzone-turf-draft.txt";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    setSubmitted(true);
  }

  return <dialog ref={dialog} className="action-dialog" aria-labelledby="action-dialog-title" onClick={event => {
    if (event.target !== dialog.current) return;
    const bounds = dialog.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close();
  }}>
    <button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close dialog">×</button>
    <span className="eyebrow">{kind === "player" ? "YOUR NEXT GAME STARTS HERE" : "LET’S GET YOU ON THE MAP"}</span>
    <h2 id="action-dialog-title">{submitted ? (kind === "player" ? "Good games are coming." : "A great start for your turf.") : (kind === "player" ? "Where do you play?" : "Make room for more football.")}</h2>
    {submitted ? <div role="status"><p>{kind === "player" ? `Live pitch listings in ${location} aren’t available yet. We’re getting the grounds ready — check back soon to find your next game.` : "Your listing draft has been downloaded. Keep it for launch — your turf hasn’t been published, and no details have been sent."}</p><button className="button button-green" onClick={() => setSubmitted(false)}>{kind === "player" ? "Try another location" : "Edit your draft"} <span aria-hidden="true">↗</span></button></div> : <p>{kind === "player" ? "Find a little space for the beautiful game." : "Start with the basics. Save a draft of your listing for when TurfZone launches."}</p>}
    <form onSubmit={submit} hidden={submitted}>
      {kind === "owner" && <label>Turf name<input name="name" placeholder="Your turf’s name" required maxLength={100} /></label>}
      <label>City or neighbourhood<input name="location" placeholder="Where’s your home ground?" value={location} onChange={event => setLocation(event.target.value)} required pattern=".*\S.*" maxLength={100} /></label>
      <label>Game format<select name="format" defaultValue="5-a-side"><option>5-a-side</option><option>7-a-side</option><option>11-a-side</option></select></label>
      <button type="submit" className="button button-green">{kind === "player" ? "Explore pitches" : "Save listing draft"}<span aria-hidden="true">↗</span></button>
      <small className="form-note">{kind === "player" ? "TurfZone is warming up. Live bookings are coming soon." : "Saved to your device. Publishing will be available at launch."}</small>
    </form>
  </dialog>;
}
