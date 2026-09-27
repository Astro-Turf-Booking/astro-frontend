import { LandingInteractions, ActionButton } from "./landing-interactions";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Brand() {
  return <a className="brand" href="#" aria-label="AstroZone home"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 30 26H2L16 2Z" fill="currentColor"/><path d="m16 12 7 12H9l7-12Z" fill="var(--paper)"/><path d="M16 19v11" stroke="currentColor" strokeWidth="4"/></svg>astrozone<span className="brand-dot">®</span></a>;
}

export default function Home() {
  return (
    <>
      <LandingInteractions />
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header wrap">
        <Brand />
        <nav aria-label="Main navigation"><a href="#players">For players</a><a href="#owners">For turf owners</a><a href="#how-it-works">How it works</a></nav>
        <ActionButton kind="owner" className="nav-cta">List your turf <Arrow /></ActionButton>
      </header>
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> LESS PLANNING. MORE PLAYING.</p>
            <h1 id="hero-heading">Good games<br />start with a<br /><span className="headline-last">great pitch.<svg viewBox="0 0 390 15" aria-hidden="true"><path d="M3 10Q175-4 386 8" /></svg></span></h1>
            <p className="hero-description">Your people. Your game. Your kind of pitch.<br className="desktop-break" /> Find and book a football turf, without the back-and-forth.</p>
            <div className="hero-actions"><ActionButton kind="player" className="button button-green">Find a pitch <Arrow /></ActionButton><a className="text-link" href="#owners">Own a turf? Let’s talk <Arrow /></a></div>
            <div className="hero-footnote"><span className="mini-ball" aria-hidden="true">✳</span> For the love of the game. And the people who play it.</div>
          </div>
          <div className="hero-art" role="img" aria-label="Illustrated football pitch with a ball and a match invitation">
            <div className="art-topline"><span>THE GAME IS CALLING</span><span>01 / 90</span></div>
            <div className="pitch">
              <div className="pitch-boundary"><div className="halfway-line" /><div className="center-circle" /><div className="center-spot" /><div className="penalty-area top"><i /></div><div className="penalty-area bottom"><i /></div><div className="goal top" /><div className="goal bottom" /></div>
              <span className="player-dot player-one" /><span className="player-dot player-two" /><span className="player-dot player-three" /><span className="player-dot player-four" />
              <svg className="play-path" viewBox="0 0 300 300" fill="none"><path d="M55 265C210 245 22 75 225 67" stroke="currentColor" strokeWidth="2" strokeDasharray="7 8"/><path d="m213 53 18 14-18 14" stroke="currentColor" strokeWidth="2"/></svg>
              <div className="football"><svg viewBox="0 0 100 100"><defs><radialGradient id="ballShade" cx="35%" cy="25%" r="80%"><stop stopColor="#fffef3"/><stop offset=".75" stopColor="#e7e6d9"/><stop offset="1" stopColor="#b3b5a5"/></radialGradient><clipPath id="ballClip"><circle cx="50" cy="50" r="48"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="url(#ballShade)"/><g clipPath="url(#ballClip)" stroke="#233c2c" strokeWidth="1.1"><path d="m50 29 20 14-8 24H37l-8-24Z" fill="#233c2c"/><path d="m50 29-3-22M70 43l24-6M62 67l13 22M37 67 22 86M29 43 8 33" fill="none"/><path d="m30 0 17 7 17-8M94 19v18l10 14M88 95 75 89 62 102M9 96l13-10-9-19L0 71M0 16l8 17-9 17" fill="#233c2c"/></g></svg></div>
            </div>
            <div className="match-note"><span className="note-icon" aria-hidden="true">↗</span><div>Your next game?<small>Closer than you think.</small></div><span className="note-spark" aria-hidden="true">✳</span></div>
            <div className="art-bottomline"><span>A LITTLE LESS SCROLL.<br />A LOT MORE FOOTBALL.</span><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3v42M3 24h42M9 9l30 30M9 39 30-30" stroke="currentColor" strokeWidth="5"/></svg></div>
          </div>
        </section>
        <div className="game-strip wrap"><span>More football. Less friction.</span><div><span>5-a-side</span><i /><span>7-a-side</span><i /><span>11-a-side</span></div><span>One place to make it happen. <span aria-hidden="true">↙</span></span></div>
        <section id="players" className="players-section wrap section-space" data-reveal>
          <div className="section-heading"><p className="eyebrow">01 / FOR THE PLAYERS</p><h2>The group chat has plans.<br />Make them happen.</h2></div>
          <div className="player-content"><p>No more calling around or chasing a reply. Find a pitch that fits your crew, pick your time, and get back to the good part.</p><ActionButton kind="player" className="text-link">Find your next pitch <Arrow /></ActionButton><div className="feature-pills"><span>Find your local turf</span><span>Pick your time</span><span>Bring your team</span></div></div>
        </section>
        <section id="how-it-works" className="how-section wrap" data-reveal>
          <div className="steps-label"><span className="eyebrow">FROM “WHO’S IN?” TO KICK-OFF.</span><span>Three steps. One good game.</span></div>
          <div className="steps"><article><span className="step-number">01</span><h3>Find your ground.</h3><p>Explore football turfs by location and the way you like to play.</p></article><article><span className="step-number">02</span><h3>Make it a date.</h3><p>Choose an available slot that works for you and your team.</p></article><article><span className="step-number">03</span><h3>Just bring your game.</h3><p>Pitch sorted. Team assembled. All that’s left is the football.</p></article></div>
        </section>
        <section id="owners" className="owner-section wrap" data-reveal>
          <div className="owner-copy"><p className="eyebrow">02 / FOR THE TURF OWNERS</p><h2>Your turf.<br />Their next favourite<br /><span>place to play.</span></h2><p>Fill your pitch, not your to-do list. Give your turf a home on AstroZone and keep your availability, bookings, and business in one place.</p><ActionButton kind="owner" className="button button-lime">List your turf <Arrow /></ActionButton></div>
          <div className="owner-details"><div className="owner-symbol" aria-hidden="true">↗</div><article><span>01</span><div><h3>Get on their radar.</h3><p>Help local players discover what makes your pitch worth playing on.</p></div></article><article><span>02</span><div><h3>Your schedule. Your rules.</h3><p>Set your slots and pricing, with a dedicated space for your own turf.</p></div></article><article><span>03</span><div><h3>Keep it all together.</h3><p>Less admin, fewer scattered messages. More time for your business.</p></div></article></div>
        </section>
        <section className="closing wrap" data-reveal><span className="closing-star" aria-hidden="true">✳</span><p className="eyebrow">THERE’S ALWAYS ROOM FOR ONE MORE GAME.</p><h2>See you on the pitch.</h2><ActionButton kind="player" className="button button-green">Let’s play <Arrow /></ActionButton></section>
      </main>
      <footer className="site-footer wrap"><Brand /><span>Good grounds. Great games.</span><span>© {new Date().getFullYear()} AstroZone</span><a href="#">Back to top ↑</a></footer>
    </>
  );
}
