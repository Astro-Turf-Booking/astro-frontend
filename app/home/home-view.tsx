"use client";

import {
  useState,
  useId,
  useMemo,
  useRef,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "../components/brand";
import { logout } from "../lib/auth";
import { toast } from "../lib/toast";

interface Pitch {
  id: string;
  name: string;
  location: string;
  city: string;
  distance: string;
  format: ("5-a-side" | "7-a-side" | "11-a-side")[];
  surface: "4G Astro" | "3G Turf" | "Indoor Arena" | "Hybrid Pro";
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  slots: string[];
}

interface Booking {
  id: string;
  pitchId: string;
  pitchName: string;
  location: string;
  date: string;
  slot: string;
  matchName: string;
  captain: string;
  price: number;
  format: string;
  createdAt: string;
}

interface PickupGame {
  id: string;
  title: string;
  venue: string;
  format: string;
  time: string;
  needed: string;
  cost: string;
  captain: string;
}

const PITCHES: Pitch[] = [
  {
    id: "astros-dzorwulu",
    name: "Astros Football Arena",
    location: "Dzorwulu, Accra",
    city: "Accra",
    distance: "1.2 km away",
    format: ["5-a-side", "7-a-side"],
    surface: "4G Astro",
    pricePerHour: 280,
    rating: 4.9,
    reviewCount: 164,
    description:
      "Accra's premier floodlit 4G community turf. High-grade shock-absorption infill, clean changing facilities, chilled drinks lounge, and pro match balls.",
    amenities: [
      "LED Floodlights",
      "Chilled Lounge",
      "Free Bibs & Balls",
      "Secure Parking",
      "Changing Rooms",
    ],
    slots: ["18:00", "19:30", "21:00"],
  },
  {
    id: "underbridge-legon",
    name: "Underbridge Turf Arena",
    location: "East Legon, Accra",
    city: "Accra",
    distance: "2.4 km away",
    format: ["5-a-side", "7-a-side"],
    surface: "4G Astro",
    pricePerHour: 320,
    rating: 4.9,
    reviewCount: 240,
    description:
      "Vibrant East Legon evening hotspot. FIFA-standard turf, rooftop spectator viewing terrace, smoothie & grill bar, and automated match highlight cams.",
    amenities: [
      "Spectator Terrace",
      "Match Cameras",
      "Grill & Drinks Bar",
      "Floodlights",
      "Sound System",
    ],
    slots: ["18:30", "20:00", "21:30"],
  },
  {
    id: "kotobabi-wembley",
    name: "Kotobabi Wembley Arena",
    location: "Kotobabi, New Town, Accra",
    city: "Accra",
    distance: "3.1 km away",
    format: ["7-a-side", "11-a-side"],
    surface: "Hybrid Pro",
    pricePerHour: 350,
    rating: 4.8,
    reviewCount: 310,
    description:
      "Historic football hub in Accra with covered spectator stands, stadium lighting, digital scoreboard, and lively community atmosphere.",
    amenities: [
      "Stadium Stands",
      "Digital Scoreboard",
      "Night Floodlights",
      "Team Benches",
      "Secure Parking",
    ],
    slots: ["17:30", "19:00", "20:30"],
  },
  {
    id: "pitch-cantonments",
    name: "The Cantonments Pitch Club",
    location: "Cantonments / Osu, Accra",
    city: "Accra",
    distance: "2.8 km away",
    format: ["5-a-side", "7-a-side"],
    surface: "4G Astro",
    pricePerHour: 300,
    rating: 4.9,
    reviewCount: 118,
    description:
      "Well-maintained boutique turf nestled in quiet Cantonments. High-grade synthetic grass, private lockers, and referee booking services.",
    amenities: [
      "Private Lockers",
      "Floodlights",
      "Water Station",
      "Referee On Call",
      "Showers",
    ],
    slots: ["18:00", "19:30", "21:00"],
  },
  {
    id: "tema-harbour-turf",
    name: "Tema Harbour Astro Arena",
    location: "Community 1, Tema",
    city: "Tema",
    distance: "5.5 km away",
    format: ["7-a-side", "11-a-side"],
    surface: "3G Turf",
    pricePerHour: 250,
    rating: 4.7,
    reviewCount: 185,
    description:
      "Spacious all-weather community turf in Tema with sea-breeze evening matches, match officials, and excellent perimeter lighting.",
    amenities: [
      "Floodlights",
      "Perimeter Fencing",
      "Free Bibs",
      "Changing Facilities",
      "Parking",
    ],
    slots: ["18:00", "19:30", "21:00"],
  },
  {
    id: "asokwa-kumasi",
    name: "Asokwa Sports Ground Astro",
    location: "Asokwa, Kumasi",
    city: "Kumasi",
    distance: "4.8 km away",
    format: ["7-a-side", "11-a-side"],
    surface: "Hybrid Pro",
    pricePerHour: 220,
    rating: 4.8,
    reviewCount: 142,
    description:
      "Kumasi's top recreational football destination. Regulation 7s and full 11s configuration with bright floodlights and lively local atmosphere.",
    amenities: [
      "Floodlights",
      "Team Dugouts",
      "Spectator Stand",
      "Free Parking",
      "Ball Boys",
    ],
    slots: ["19:00", "20:30"],
  },
];

const PICKUP_GAMES: PickupGame[] = [
  {
    id: "pickup-1",
    title: "East Legon Midweek 5s",
    venue: "Underbridge Turf Arena",
    format: "5-a-side",
    time: "Tonight • 20:00",
    needed: "Need 1 Goalkeeper",
    cost: "Free for GK",
    captain: "Kwame A.",
  },
  {
    id: "pickup-2",
    title: "Dzorwulu Casuals 7v7",
    venue: "Astros Football Arena",
    format: "7-a-side",
    time: "Tonight • 19:30",
    needed: "Need 2 Midfielders",
    cost: "GH₵30 / player",
    captain: "Kofi Mensah",
  },
  {
    id: "pickup-3",
    title: "Kotobabi Friday Night Scrimmage",
    venue: "Kotobabi Wembley Arena",
    format: "7-a-side",
    time: "Tomorrow • 20:00",
    needed: "Need 1 Striker",
    cost: "GH₵35 / player",
    captain: "Yaw Boateng",
  },
];

const emptyBookings: Booking[] = [];

function generateBookingId(): string {
  const code = Date.now().toString().slice(-4);
  return `TZ-${code}`;
}

function subscribeBookings(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("turfzone:bookings-update", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("turfzone:bookings-update", callback);
  };
}

let cachedRaw: string | null = null;
let cachedParsed: Booking[] = emptyBookings;

function getBookingsSnapshot(): Booking[] {
  if (typeof window === "undefined") return emptyBookings;
  try {
    const raw = localStorage.getItem("turfzone_bookings");
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    cachedParsed = raw ? JSON.parse(raw) : emptyBookings;
    return cachedParsed;
  } catch {
    return emptyBookings;
  }
}

function getBookingsServerSnapshot(): Booking[] {
  return emptyBookings;
}

export function HomeView() {
  const searchInputId = useId();
  const formatSelectId = useId();
  const surfaceSelectId = useId();
  const priceSelectId = useId();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [surfaceFilter, setSurfaceFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [eveningOnly, setEveningOnly] = useState<boolean>(false);

  // Selected slots per pitch card: { [pitchId]: slotString }
  const [selectedSlots, setSelectedSlots] = useState<{
    [pitchId: string]: string;
  }>({
    "astros-dzorwulu": "19:30",
    "underbridge-legon": "20:00",
    "kotobabi-wembley": "19:00",
    "pitch-cantonments": "19:30",
    "tema-harbour-turf": "19:30",
    "asokwa-kumasi": "19:00",
  });

  // Booking Modal State
  const bookingDialog = useRef<HTMLDialogElement>(null);
  const [activePitchForBooking, setActivePitchForBooking] =
    useState<Pitch | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("Tonight");
  const [bookingSlot, setBookingSlot] = useState<string>("");
  const [matchName, setMatchName] = useState<string>("");
  const [captainName, setCaptainName] = useState<string>("");
  const [squadSize, setSquadSize] = useState<number>(10);
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);

  // My Bookings Drawer
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.info("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  const myBookings = useSyncExternalStore(
    subscribeBookings,
    getBookingsSnapshot,
    getBookingsServerSnapshot,
  );
  const [showBookingsDrawer, setShowBookingsDrawer] = useState<boolean>(false);

  // Toast Notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function saveBooking(newBooking: Booking) {
    try {
      const current = getBookingsSnapshot();
      const updated = [newBooking, ...current];
      localStorage.setItem("turfzone_bookings", JSON.stringify(updated));
      window.dispatchEvent(new Event("turfzone:bookings-update"));
    } catch {
      // ignore
    }
  }

  function removeBooking(id: string) {
    try {
      const current = getBookingsSnapshot();
      const updated = current.filter((b) => b.id !== id);
      localStorage.setItem("turfzone_bookings", JSON.stringify(updated));
      window.dispatchEvent(new Event("turfzone:bookings-update"));
    } catch {
      // ignore
    }
    showToast("Booking cancelled successfully.");
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  function selectSlot(pitchId: string, slot: string) {
    setSelectedSlots((prev) => ({ ...prev, [pitchId]: slot }));
  }

  function openBookingModal(pitch: Pitch) {
    setActivePitchForBooking(pitch);
    const chosenSlot = selectedSlots[pitch.id] || pitch.slots[0] || "19:00";
    setBookingSlot(chosenSlot);
    setBookingDate("Tonight");
    setMatchName(`${pitch.format[0]} Match`);
    setCaptainName("");
    setSquadSize(
      pitch.format.includes("11-a-side")
        ? 22
        : pitch.format.includes("7-a-side")
          ? 14
          : 10,
    );
    setBookingSuccess(null);
    bookingDialog.current?.showModal();
  }

  function handleBookingSubmit(e: FormEvent) {
    e.preventDefault();
    if (!activePitchForBooking) return;

    const newBooking: Booking = {
      id: generateBookingId(),
      pitchId: activePitchForBooking.id,
      pitchName: activePitchForBooking.name,
      location: activePitchForBooking.location,
      date: bookingDate,
      slot: bookingSlot,
      matchName: matchName.trim() || `${activePitchForBooking.name} Match`,
      captain: captainName.trim() || "Squad Captain",
      price: activePitchForBooking.pricePerHour,
      format: activePitchForBooking.format[0],
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    saveBooking(newBooking);
    setBookingSuccess(newBooking);
    showToast(
      `Pitch reserved: ${activePitchForBooking.name} at ${bookingSlot}!`,
    );
  }

  function copyMatchInvite(booking: Booking) {
    const inviteText = `⚽ TURFZONE MATCH INVITATION\n\nGame: ${booking.matchName}\nGround: ${booking.pitchName} (${booking.location})\nWhen: ${booking.date} at ${booking.slot}\nRef: ${booking.id}\nCost: GH₵${booking.price} total (~GH₵${(booking.price / squadSize).toFixed(2)}/player)\n\nOrganised via TurfZone Ghana. See you on the pitch!`;
    navigator.clipboard?.writeText(inviteText);
    showToast("Match invite copied to clipboard for your WhatsApp squad!");
  }

  function handleJoinPickup(game: PickupGame) {
    showToast(`Request sent to captain ${game.captain} for "${game.title}"!`);
  }

  // Filtered pitches list
  const filteredPitches = useMemo(() => {
    return PITCHES.filter((pitch) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pitch.name.toLowerCase().includes(q);
        const matchesLoc = pitch.location.toLowerCase().includes(q);
        const matchesCity = pitch.city.toLowerCase().includes(q);
        const matchesSurface = pitch.surface.toLowerCase().includes(q);
        const matchesAmenities = pitch.amenities.some((a) =>
          a.toLowerCase().includes(q),
        );
        if (
          !matchesName &&
          !matchesLoc &&
          !matchesCity &&
          !matchesSurface &&
          !matchesAmenities
        ) {
          return false;
        }
      }

      // Format filter
      if (formatFilter !== "all") {
        if (
          !pitch.format.includes(
            formatFilter as "5-a-side" | "7-a-side" | "11-a-side",
          )
        ) {
          return false;
        }
      }

      // Surface filter
      if (surfaceFilter !== "all" && pitch.surface !== surfaceFilter) {
        return false;
      }

      // Price filter in GH₵
      if (priceFilter === "under-250" && pitch.pricePerHour >= 250)
        return false;
      if (
        priceFilter === "250-320" &&
        (pitch.pricePerHour < 250 || pitch.pricePerHour > 320)
      )
        return false;
      if (priceFilter === "320-plus" && pitch.pricePerHour <= 320) return false;

      // Evening only filter (slots >= 18:00)
      if (eveningOnly) {
        const hasEveningSlot = pitch.slots.some((s) => {
          const hour = parseInt(s.split(":")[0], 10);
          return hour >= 18;
        });
        if (!hasEveningSlot) return false;
      }

      return true;
    });
  }, [searchQuery, formatFilter, surfaceFilter, priceFilter, eveningOnly]);

  return (
    <>
      <a href="#home-content" className="skip-link">
        Skip to pitches
      </a>

      {/* Site Header */}
      <header className="site-header wrap">
        <Brand href="/home" />
        <nav aria-label="Home navigation">
          <a
            href="#pitches"
            className="header-login"
            style={{ fontWeight: 600 }}
          >
            Find Pitches
          </a>
          <a href="#community">Tonight&apos;s Games</a>
          <a href="#formats">Formats</a>
          <Link href="/#owners">For Owners</Link>
        </nav>
        <div className="header-actions">
          <span
            className="header-location-pill"
            title="Default search area in Ghana"
          >
            📍 Accra &amp; Kumasi, Ghana
          </span>
          <button
            type="button"
            className="header-badge-btn"
            onClick={() => setShowBookingsDrawer(true)}
            aria-label="View my bookings"
          >
            My Bookings
            {myBookings.length > 0 && (
              <span className="header-count-bubble">{myBookings.length}</span>
            )}
          </button>
          <button
            type="button"
            className="header-badge-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Log out"
            style={{ cursor: "pointer" }}
          >
            {isLoggingOut ? "Leaving..." : "Log out"}
          </button>
        </div>
      </header>

      {/* Main Home Content */}
      <main id="home-content">
        {/* Hero Section */}
        <section className="home-hero wrap">
          <div className="home-hero-top">
            <div>
              {/* <p className="eyebrow">
                <span className="status-dot" aria-hidden="true" /> GOOD GROUNDS.
                READY FOR KICK-OFF ACROSS GHANA.
              </p> */}
              <h1>
                Find your ground.
                <br />
                Book your slot.
                <br />
                <span className="headline-last">
                  Play tonight.
                  <svg viewBox="0 0 390 15" aria-hidden="true">
                    <path d="M3 10Q175-4 386 8" />
                  </svg>
                </span>
              </h1>
            </div>
            <p className="home-hero-subtitle">
              Explore verified all-weather football turfs across the country.
            </p>
          </div>

          {/* Quick Stats Strip */}
          {/* <div className="home-stats-strip">
            <span>
              <strong>6</strong> Verified Grounds in Ghana
            </span>
            <span>•</span>
            <span>
              <strong>18</strong> Available Evening Slots Tonight
            </span>
            <span>•</span>
            <span>
              <strong>100%</strong> Floodlit &amp; All-Weather
            </span>
            <span>•</span>
            <span>Instant Squad MoMo Booking</span>
          </div> */}

          {/* If user has bookings, show quick notification banner */}
          {myBookings.length > 0 && (
            <div className="my-bookings-bar">
              <span aria-hidden="true">⚽</span>
              <span>
                You have{" "}
                <strong>
                  {myBookings.length} upcoming match
                  {myBookings.length > 1 ? "es" : ""}
                </strong>{" "}
                booked! Next game: <strong>{myBookings[0].pitchName}</strong> (
                {myBookings[0].slot})
              </span>
              <button
                type="button"
                className="my-bookings-btn-link"
                onClick={() => setShowBookingsDrawer(true)}
              >
                View match details →
              </button>
            </div>
          )}

          {/* Search & Filter Console */}
          <div
            className="home-search-panel"
            role="search"
            aria-label="Pitch search and filters"
          >
            <div className="search-input-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id={searchInputId}
                type="text"
                className="home-search-input"
                placeholder="Search by ground name, area (e.g. East Legon, Dzorwulu, Cantonments, Tema, Kumasi), surface, or amenity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search pitches"
              />
              {searchQuery && (
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: 14,
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    fontSize: 16,
                  }}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-row">
              {/* Format Filter */}
              <div
                className="filter-group"
                role="group"
                aria-labelledby={formatSelectId}
              >
                <span id={formatSelectId} className="filter-label">
                  Format:
                </span>
                <button
                  type="button"
                  className={`filter-pill ${formatFilter === "all" ? "active" : ""}`}
                  onClick={() => setFormatFilter("all")}
                >
                  All Formats
                </button>
                <button
                  type="button"
                  className={`filter-pill ${formatFilter === "5-a-side" ? "active" : ""}`}
                  onClick={() => setFormatFilter("5-a-side")}
                >
                  5-a-side
                </button>
                <button
                  type="button"
                  className={`filter-pill ${formatFilter === "7-a-side" ? "active" : ""}`}
                  onClick={() => setFormatFilter("7-a-side")}
                >
                  7-a-side
                </button>
                <button
                  type="button"
                  className={`filter-pill ${formatFilter === "11-a-side" ? "active" : ""}`}
                  onClick={() => setFormatFilter("11-a-side")}
                >
                  11-a-side
                </button>
              </div>

              {/* Surface Filter */}
              <div
                className="filter-group"
                role="group"
                aria-labelledby={surfaceSelectId}
              >
                <span id={surfaceSelectId} className="filter-label">
                  Surface:
                </span>
                <button
                  type="button"
                  className={`filter-pill ${surfaceFilter === "all" ? "active" : ""}`}
                  onClick={() => setSurfaceFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`filter-pill ${surfaceFilter === "4G Astro" ? "active" : ""}`}
                  onClick={() => setSurfaceFilter("4G Astro")}
                >
                  4G Astro
                </button>
                <button
                  type="button"
                  className={`filter-pill ${surfaceFilter === "3G Turf" ? "active" : ""}`}
                  onClick={() => setSurfaceFilter("3G Turf")}
                >
                  3G Turf
                </button>
                <button
                  type="button"
                  className={`filter-pill ${surfaceFilter === "Hybrid Pro" ? "active" : ""}`}
                  onClick={() => setSurfaceFilter("Hybrid Pro")}
                >
                  Hybrid Pro
                </button>
              </div>

              {/* Price & Evening toggles in Cedis */}
              <div
                className="filter-group"
                role="group"
                aria-labelledby={priceSelectId}
              >
                <span id={priceSelectId} className="filter-label">
                  Price:
                </span>
                <button
                  type="button"
                  className={`filter-pill ${priceFilter === "all" ? "active" : ""}`}
                  onClick={() => setPriceFilter("all")}
                >
                  Any
                </button>
                <button
                  type="button"
                  className={`filter-pill ${priceFilter === "under-250" ? "active" : ""}`}
                  onClick={() => setPriceFilter("under-250")}
                >
                  &lt; GH₵250
                </button>
                <button
                  type="button"
                  className={`filter-pill ${priceFilter === "250-320" ? "active" : ""}`}
                  onClick={() => setPriceFilter("250-320")}
                >
                  GH₵250 - GH₵320
                </button>
                <button
                  type="button"
                  className={`filter-pill ${priceFilter === "320-plus" ? "active" : ""}`}
                  onClick={() => setPriceFilter("320-plus")}
                >
                  &gt; GH₵320
                </button>
                <button
                  type="button"
                  className={`filter-pill filter-pill-secondary ${eveningOnly ? "active" : ""}`}
                  onClick={() => setEveningOnly(!eveningOnly)}
                >
                  🌙 Evening (18:00+)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pitches Directory */}
        <section
          id="pitches"
          className="pitches-section wrap"
          aria-labelledby="pitches-title"
        >
          <div className="pitches-heading-bar">
            <div>
              <p className="eyebrow">VERIFIED FOOTBALL GROUNDS IN GHANA</p>
              <h2 id="pitches-title">Available Pitches Near You</h2>
            </div>
            <div className="pitches-count">
              Showing <strong>{filteredPitches.length}</strong> of{" "}
              {PITCHES.length} venues
              {(formatFilter !== "all" ||
                surfaceFilter !== "all" ||
                priceFilter !== "all" ||
                eveningOnly ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setFormatFilter("all");
                    setSurfaceFilter("all");
                    setPriceFilter("all");
                    setEveningOnly(false);
                    setSearchQuery("");
                  }}
                  style={{
                    marginLeft: 12,
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "var(--ink)",
                    fontSize: 12,
                  }}
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {filteredPitches.length === 0 ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                border: "1px dashed var(--line)",
                borderRadius: 8,
              }}
            >
              <p style={{ fontSize: 16, marginBottom: 8, fontWeight: 600 }}>
                No pitches match your current criteria
              </p>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  marginBottom: 20,
                }}
              >
                Try loosening your filters, changing the format, or searching
                for a different area in Accra, Tema, or Kumasi.
              </p>
              <button
                type="button"
                className="button button-green"
                onClick={() => {
                  setFormatFilter("all");
                  setSurfaceFilter("all");
                  setPriceFilter("all");
                  setEveningOnly(false);
                  setSearchQuery("");
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="pitches-grid">
              {filteredPitches.map((pitch) => {
                const currentSlot = selectedSlots[pitch.id] || pitch.slots[0];
                return (
                  <article key={pitch.id} className="pitch-card">
                    {/* Visual Card Header */}
                    <div className="pitch-card-thumb">
                      {/* Stylized tactical vector */}
                      <svg
                        className="pitch-mini-vector"
                        viewBox="0 0 200 120"
                        fill="none"
                      >
                        <rect
                          x="10"
                          y="10"
                          width="180"
                          height="100"
                          stroke="#f8f8ef"
                          strokeWidth="2"
                          rx="4"
                        />
                        <line
                          x1="100"
                          y1="10"
                          x2="100"
                          y2="110"
                          stroke="#f8f8ef"
                          strokeWidth="2"
                        />
                        <circle
                          cx="100"
                          cy="60"
                          r="24"
                          stroke="#f8f8ef"
                          strokeWidth="2"
                        />
                        <rect
                          x="10"
                          y="32"
                          width="36"
                          height="56"
                          stroke="#f8f8ef"
                          strokeWidth="2"
                        />
                        <rect
                          x="154"
                          y="32"
                          width="36"
                          height="56"
                          stroke="#f8f8ef"
                          strokeWidth="2"
                        />
                      </svg>
                      <span className="pitch-tag-topleft">
                        {pitch.format.join(" • ").toUpperCase()}
                      </span>
                      <span className="pitch-tag-topright">
                        ★ {pitch.rating} ({pitch.reviewCount})
                      </span>
                      <div className="pitch-thumb-center">
                        <div className="pitch-thumb-surface">
                          {pitch.surface}
                        </div>
                        <div className="pitch-thumb-sub">
                          {pitch.city} Ground
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="pitch-card-body">
                      <div className="pitch-card-header">
                        <h3 className="pitch-card-title">{pitch.name}</h3>
                        <p className="pitch-card-location">
                          📍 {pitch.location} •{" "}
                          <span style={{ color: "#638747", fontWeight: 600 }}>
                            {pitch.distance}
                          </span>
                        </p>
                      </div>

                      <p className="pitch-card-description">
                        {pitch.description}
                      </p>

                      <div className="pitch-card-amenities">
                        {pitch.amenities.map((amenity) => (
                          <span key={amenity} className="amenity-pill">
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Interactive Slot Selector */}
                      <div className="pitch-card-slots">
                        <div className="slots-label">
                          <span>Today&apos;s Available Slots</span>
                          <span style={{ color: "#638747" }}>
                            ● Live inventory
                          </span>
                        </div>
                        <div className="slot-buttons-row">
                          {pitch.slots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              className={`slot-btn ${currentSlot === slot ? "selected" : ""}`}
                              onClick={() => selectSlot(pitch.id, slot)}
                              aria-label={`Select slot at ${slot}`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>

                        {/* Price in Cedis & Book Action */}
                        <div className="pitch-card-actions">
                          <div className="pitch-price">
                            <span className="pitch-price-val">
                              GH₵{pitch.pricePerHour}
                            </span>
                            <span className="pitch-price-unit">
                              per 60m session
                            </span>
                          </div>
                          <button
                            type="button"
                            className="button button-green pitch-book-btn"
                            onClick={() => openBookingModal(pitch)}
                          >
                            Book {currentSlot} <span>↗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Tonight's Pickup Matches & Ringers Needed */}
        <section
          id="community"
          className="community-section"
          aria-labelledby="community-heading"
        >
          <div className="wrap">
            <div className="community-header">
              <p className="eyebrow">
                <span className="status-dot" aria-hidden="true" /> SQUAD SHORT
                OF NUMBERS?
              </p>
              <h2 id="community-heading">
                Tonight&apos;s Open Games &amp; Ringers
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  marginTop: 8,
                  maxWidth: 520,
                }}
              >
                Looking to play without organising the whole match? Or does your
                squad need an extra body before kick-off? Join open sessions
                hosted by verified community captains in Accra.
              </p>
            </div>

            <div className="community-grid">
              {PICKUP_GAMES.map((game) => (
                <div key={game.id} className="match-card">
                  <div>
                    <span className="match-card-badge">
                      ● {game.format} • {game.time}
                    </span>
                    <h3>{game.title}</h3>
                    <div className="match-card-info">
                      <div>📍 {game.venue}</div>
                      <div>👤 Captain: {game.captain}</div>
                      <div
                        style={{
                          color: "#234735",
                          fontWeight: 600,
                          marginTop: 6,
                        }}
                      >
                        🎯 Spot: {game.needed}
                      </div>
                    </div>
                  </div>
                  <div className="match-card-footer">
                    <span style={{ fontWeight: 600 }}>{game.cost}</span>
                    <button
                      type="button"
                      className="button button-lime"
                      style={{
                        padding: "8px 14px",
                        minHeight: 38,
                        fontSize: 11,
                      }}
                      onClick={() => handleJoinPickup(game)}
                    >
                      Request to Join <span>↗</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pitch Formats Tactical Guide */}
        <section
          id="formats"
          className="formats-section wrap"
          aria-labelledby="formats-title"
        >
          <div className="section-heading">
            <p className="eyebrow">THE GROUND RULEBOOK</p>
            <h2 id="formats-title">Choose Your Kind of Football</h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                marginTop: 10,
                maxWidth: 520,
              }}
            >
              Whether it&apos;s high-intensity 5s under floodlights or full
              tactical 11s on the regulation turf, every ground in Ghana brings
              its own energy to match night.
            </p>
          </div>

          <div className="formats-grid">
            <div className="format-card">
              <span className="format-card-dimensions">
                30m × 20m • 5-A-SIDE
              </span>
              <h3>High Tempo. High Touches.</h3>
              <p>
                Fast-paced, relentless football. Rebound boards, short bursts of
                acceleration, and constant action on goal. Ideal for after-work
                matches with small crews in East Legon and Dzorwulu.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setFormatFilter("5-a-side");
                  document
                    .getElementById("pitches")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse 5-a-side grounds <span>→</span>
              </button>
            </div>

            <div className="format-card">
              <span className="format-card-dimensions">
                55m × 37m • 7-A-SIDE
              </span>
              <h3>Tactical Balance &amp; Flow.</h3>
              <p>
                Ghana&apos;s favourite recreational format. Big enough for
                passing triangles and wide play, compact enough for every player
                to stay involved across 60 minutes.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setFormatFilter("7-a-side");
                  document
                    .getElementById("pitches")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse 7-a-side grounds <span>→</span>
              </button>
            </div>

            <div className="format-card">
              <span className="format-card-dimensions">
                100m × 64m • 11-A-SIDE
              </span>
              <h3>The Pure Matchday Experience.</h3>
              <p>
                Full-size regulation pitch with standard goals, proper offsides,
                and room for complete tactical formations. Perfect for weekend
                friendlies, corporate leagues, and academy fixtures.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setFormatFilter("11-a-side");
                  document
                    .getElementById("pitches")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse 11-a-side grounds <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Turf Owner CTA Banner */}
        <section className="wrap" aria-labelledby="owner-banner-title">
          <div className="owner-banner">
            <div>
              <p className="eyebrow">
                TURF MANAGERS &amp; GROUND OWNERS IN GHANA
              </p>
              <h3 id="owner-banner-title">
                Have floodlit hours waiting to be filled?
              </h3>
              <p>
                Join Ghana&apos;s leading network of verified pitches. Automate
                your evening slots, accept Mobile Money squad payments, and
                welcome local teams without picking up phone calls all day.
              </p>
            </div>
            <Link
              href="/#owners"
              className="button button-lime"
              style={{ whiteSpace: "nowrap" }}
            >
              List your turf <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Booking Dialog Modal */}
      <dialog
        ref={bookingDialog}
        className="action-dialog"
        aria-labelledby="booking-dialog-title"
        onClick={(event) => {
          if (event.target !== bookingDialog.current) return;
          const bounds = bookingDialog.current.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          ) {
            bookingDialog.current.close();
          }
        }}
      >
        <button
          className="dialog-close"
          onClick={() => bookingDialog.current?.close()}
          aria-label="Close booking dialog"
        >
          ×
        </button>

        {bookingSuccess ? (
          <div role="status">
            <span className="eyebrow">MATCH SORTED • BOOKING CONFIRMED</span>
            <h2 id="booking-dialog-title">See you on the pitch.</h2>
            <div
              style={{
                background: "#eaf0db",
                padding: 18,
                borderRadius: 6,
                marginBlock: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Booking Reference
              </div>
              <div
                style={{
                  fontFamily: "var(--font-zodiak), serif",
                  fontSize: 26,
                  fontWeight: 700,
                  marginBlock: 4,
                }}
              >
                {bookingSuccess.id}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>
                <strong>{bookingSuccess.pitchName}</strong>
                <br />
                {bookingSuccess.location}
                <br />
                {bookingSuccess.date} at <strong>{bookingSuccess.slot}</strong>{" "}
                ({bookingSuccess.format})
              </div>
            </div>

            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              Your reservation has been confirmed with the ground manager.
              Present this reference code on arrival.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                className="button button-lime"
                onClick={() => copyMatchInvite(bookingSuccess)}
              >
                Copy squad invite for WhatsApp <span>↗</span>
              </button>
              <button
                type="button"
                className="button button-green"
                onClick={() => {
                  bookingDialog.current?.close();
                  setShowBookingsDrawer(true);
                }}
              >
                View in My Bookings <span>↗</span>
              </button>
            </div>
          </div>
        ) : (
          activePitchForBooking && (
            <div>
              <span className="eyebrow">RESERVE YOUR PITCH</span>
              <h2 id="booking-dialog-title">{activePitchForBooking.name}</h2>
              <p
                style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}
              >
                {activePitchForBooking.location} •{" "}
                {activePitchForBooking.surface}
              </p>

              <form onSubmit={handleBookingSubmit} style={{ marginTop: 20 }}>
                {/* Day selector */}
                <label>
                  Match Day
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  >
                    <option value="Tonight">Tonight (Instant Play)</option>
                    <option value="Tomorrow">Tomorrow Evening</option>
                    <option value="This Friday">This Friday Night</option>
                    <option value="This Saturday">This Saturday</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </label>

                {/* Time slot selector */}
                <label>
                  Kick-off Slot (60 mins)
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    required
                  >
                    {activePitchForBooking.slots.map((s) => (
                      <option key={s} value={s}>
                        {s} — Available
                      </option>
                    ))}
                  </select>
                </label>

                {/* Squad Captain / Contact */}
                <label>
                  Match Organiser Name
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder="e.g. Kwame Mensah"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                  />
                </label>

                {/* Match Title */}
                <label>
                  Match Name / Team Note
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Thursday Night 5s"
                    value={matchName}
                    onChange={(e) => setMatchName(e.target.value)}
                  />
                </label>

                {/* Squad size & cost split */}
                <label>
                  Squad Size (for cost split)
                  <select
                    value={squadSize}
                    onChange={(e) => setSquadSize(Number(e.target.value))}
                  >
                    <option value={10}>10 players (5-a-side)</option>
                    <option value={12}>12 players (6-a-side)</option>
                    <option value={14}>14 players (7-a-side)</option>
                    <option value={16}>16 players (8-a-side)</option>
                    <option value={22}>22 players (11-a-side)</option>
                  </select>
                </label>

                {/* Cost breakdown card in Cedis */}
                <div
                  style={{
                    background: "#fffef7",
                    border: "1px solid var(--line)",
                    padding: 14,
                    borderRadius: 5,
                    marginBlock: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <span>Pitch Fee</span>
                    <span>GH₵{activePitchForBooking.pricePerHour}.00</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: "var(--muted)",
                      marginTop: 4,
                    }}
                  >
                    <span>Split among {squadSize} players</span>
                    <span>
                      GH₵
                      {(activePitchForBooking.pricePerHour / squadSize).toFixed(
                        2,
                      )}{" "}
                      / player
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="button button-green"
                  style={{ width: "100%" }}
                >
                  Confirm Pitch Booking <span>↗</span>
                </button>
                <small className="form-note">
                  No payment charged now. Verified grounds allow payment on
                  match arrival via Mobile Money (MoMo) or cash.
                </small>
              </form>
            </div>
          )
        )}
      </dialog>

      {/* "My Bookings" Slide Drawer */}
      {showBookingsDrawer && (
        <div
          className="my-bookings-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bookings-drawer-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBookingsDrawer(false);
          }}
        >
          <div className="my-bookings-content">
            <div className="my-bookings-header">
              <div>
                <span className="eyebrow">YOUR RESERVATIONS</span>
                <h3
                  id="bookings-drawer-title"
                  style={{ fontSize: 24, marginTop: 4 }}
                >
                  My Bookings
                </h3>
              </div>
              <button
                type="button"
                className="dialog-close"
                style={{ position: "static", width: "auto", height: "auto" }}
                onClick={() => setShowBookingsDrawer(false)}
                aria-label="Close drawer"
              >
                ×
              </button>
            </div>

            {myBookings.length === 0 ? (
              <div
                style={{
                  padding: "40px 10px",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                <p
                  style={{
                    fontSize: 16,
                    marginBottom: 8,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  No active bookings yet
                </p>
                <p style={{ fontSize: 12, lineHeight: 1.8 }}>
                  Pick a ground from the list, select an available evening slot,
                  and reserve your pitch in seconds.
                </p>
                <button
                  type="button"
                  className="button button-green"
                  style={{ marginTop: 20 }}
                  onClick={() => setShowBookingsDrawer(false)}
                >
                  Explore pitches <span>→</span>
                </button>
              </div>
            ) : (
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    marginBottom: 16,
                  }}
                >
                  You have {myBookings.length} confirmed ground reservation
                  {myBookings.length > 1 ? "s" : ""}:
                </p>
                {myBookings.map((b) => (
                  <div key={b.id} className="booking-item-card">
                    <span className="booking-ref-badge">{b.id}</span>
                    <h4 className="booking-item-title">{b.pitchName}</h4>
                    <div className="booking-item-details">
                      <div>📍 {b.location}</div>
                      <div>
                        📅 {b.date} • <strong>{b.slot}</strong> ({b.format})
                      </div>
                      <div>👤 Organiser: {b.captain}</div>
                      <div>🏷️ Match: {b.matchName}</div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--ink)",
                          marginTop: 4,
                        }}
                      >
                        Total: GH₵{b.price}.00
                      </div>
                    </div>
                    <div className="booking-item-actions">
                      <button
                        type="button"
                        className="button button-lime"
                        style={{
                          padding: "6px 12px",
                          minHeight: 34,
                          fontSize: 10,
                        }}
                        onClick={() => copyMatchInvite(b)}
                      >
                        Copy invite <span>↗</span>
                      </button>
                      <button
                        type="button"
                        className="text-link"
                        style={{
                          fontSize: 10,
                          color: "#a13232",
                          borderColor: "#a13232",
                        }}
                        onClick={() => removeBooking(b.id)}
                      >
                        Cancel match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice" role="status" aria-live="polite">
          <span aria-hidden="true">✳</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Site Footer */}
      <footer className="site-footer wrap">
        <Brand href="/home" />
        <span>
          © {new Date().getFullYear()} TurfZone Ghana • Good grounds. Great
          games.
        </span>
        <a href="#home-content">Back to top ↑</a>
      </footer>
    </>
  );
}
