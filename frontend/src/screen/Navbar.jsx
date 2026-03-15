import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserAuthStore } from "../store/userAuthStore";
import { serviceStore } from "../store/serviceStore";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineMailOpen, HiMenuAlt3, HiX } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { RiChatDeleteLine } from "react-icons/ri";

/* ── Static data ─────────────────────────────── */
const NAV_ITEMS = [
    { to: "/dashboard", icon: MdOutlineDashboard, label: "Dashboard" },
    { to: "/compose", icon: HiOutlineMailOpen, label: "Composed" },
    { to: "/settings", icon: FiSettings, label: "Settings" },
];
const PUBLIC_LINKS = [
    { to: "/", label: "Home" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
];

/* ── Design tokens — matches Home/Login/Signup/Pricing ── */
const T = {
    // backgrounds — same as Home page (#04060f base)
    pageBg: "#04060f",
    sidebarBg: "rgba(6,6,18,0.98)",
    pillBg: "rgba(6,6,18,0.93)",
    cardBg: "rgba(255,255,255,0.04)",

    // borders
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.12)",

    // text
    textPrimary: "#fff",
    textMuted: "rgba(255,255,255,0.48)",

    // accents — same gradient used in Home hero & Login card
    accent: "#6366f1",   // indigo
    accentTeal: "#14b8a6",   // teal
    accentGrad: "linear-gradient(135deg,#6366f1,#14b8a6)",

    // active nav item — same as Login input focus
    activeGrad: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(20,184,166,0.1))",
    activeBorder: "rgba(99,102,241,0.22)",
    activePip: "linear-gradient(180deg,#6366f1,#14b8a6)",

    // status
    green: "#34d399",

    // danger
    danger: "rgba(248,113,113,0.75)",
    dangerHov: "#f87171",
    dangerBg: "rgba(239,68,68,0.08)",
    dangerBorder: "rgba(239,68,68,0.2)",
};

/* ── Framer variants ─────────────────────────── */
const sidebarV = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 28 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};
const overlayV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};
const itemV = {
    hidden: { opacity: 0, x: -12 },
    visible: (i) => ({
        opacity: 1, x: 0,
        transition: { delay: 0.05 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    }),
};
const bottomV = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: 0.25 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    }),
};

/* ── Logo mark — same gradient as Home/Login ─── */
const Logo = ({ size = 30, radius = 8, fs = 14 }) => (
    <div style={{
        width: size, height: size, borderRadius: radius, flexShrink: 0,
        background: T.accentGrad,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: fs, color: "#fff",
        boxShadow: size >= 30 ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
    }}>M</div>
);

/* ── Action button ───────────────────────────── */
const ActionBtn = ({ icon, label, onClick, danger = false }) => {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10,
                fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 500,
                cursor: "pointer", width: "100%", textAlign: "left",
                transition: "background 0.2s, color 0.2s, border-color 0.2s",
                background: hov
                    ? danger ? T.dangerBg : "rgba(255,255,255,0.05)"
                    : "transparent",
                border: `0.5px solid ${hov && danger ? T.dangerBorder : T.border}`,
                color: danger
                    ? hov ? T.dangerHov : T.danger
                    : hov ? T.textPrimary : T.textMuted,
            }}
        >
            {icon}{label}
        </button>
    );
};

/* ── Sidebar content ─────────────────────────── */
const SidebarContent = ({ authUser, location, onClose, onLogout, onDeleteAll }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0 10px" }}>

        {/* Brand */}
        <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "20px 4px 16px",
            borderBottom: `0.5px solid ${T.border}`, marginBottom: 10,
        }}>
            <Logo size={34} radius={9} fs={15} />
            <span style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800,
                fontSize: 15, color: T.textPrimary, letterSpacing: "-0.01em",
            }}>
                MailBlast
            </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
            {NAV_ITEMS.map(({ to, icon: Icon, label }, i) => {
                const active = location.pathname === to;
                return (
                    <motion.div key={to} custom={i} variants={itemV} initial="hidden" animate="visible">
                        <Link to={to} onClick={onClose} style={{
                            display: "flex", alignItems: "center", gap: 11,
                            padding: "10px 12px", borderRadius: 10,
                            fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 500,
                            textDecoration: "none", position: "relative", overflow: "hidden",
                            border: `0.5px solid ${active ? T.activeBorder : "transparent"}`,
                            color: active ? T.textPrimary : T.textMuted,
                            background: active ? T.activeGrad : "transparent",
                            transition: "background 0.2s, color 0.2s",
                        }}>
                            {/* Active left pip — same gradient as Login focus ring accent */}
                            {active && (
                                <span style={{
                                    position: "absolute", left: 0, top: "50%",
                                    transform: "translateY(-50%)",
                                    width: 3, height: 18, borderRadius: "0 3px 3px 0",
                                    background: T.activePip,
                                }} />
                            )}
                            <Icon size={17} style={{ flexShrink: 0 }} />
                            {label}
                        </Link>
                    </motion.div>
                );
            })}
        </nav>

        {/* Bottom section */}
        <div style={{
            borderTop: `0.5px solid ${T.border}`,
            padding: "12px 0 18px",
            display: "flex", flexDirection: "column", gap: 6,
        }}>
            {/* User card — same card style as Home stats band */}
            <motion.div custom={0} variants={bottomV} initial="hidden" animate="visible">
                <div style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "9px 12px", borderRadius: 10,
                    background: T.cardBg,
                    border: `0.5px solid ${T.border}`,
                }}>
                    {/* Initials avatar — same gradient as logo */}
                    <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        background: T.accentGrad,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#fff",
                    }}>
                        {authUser?.Name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{
                            fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600,
                            color: "rgba(255,255,255,0.82)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                            {authUser?.Name ?? "User"}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: T.green, flexShrink: 0,
                                animation: "sbStatusPulse 2s ease-in-out infinite",
                            }} />
                            <span style={{
                                fontFamily: "'Syne',sans-serif", fontSize: 10,
                                color: T.green, fontWeight: 500,
                            }}>
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div custom={1} variants={bottomV} initial="hidden" animate="visible">
                <ActionBtn icon={<CiLogout size={16} />} label="Logout" onClick={onLogout} />
            </motion.div>
            <motion.div custom={2} variants={bottomV} initial="hidden" animate="visible">
                <ActionBtn icon={<RiChatDeleteLine size={16} />} label="Delete All Emails" onClick={onDeleteAll} danger />
            </motion.div>
        </div>
    </div>
);

/* ── Sidebar shell style ─────────────────────── */
const SIDEBAR = {
    position: "fixed", top: 0, left: 0, bottom: 0, width: 230, zIndex: 40,
    background: "rgba(6,6,18,0.98)",
    borderRight: `0.5px solid ${T.border}`,
    // Subtle indigo glow on the right edge — matches Home orb ambience
    boxShadow: "4px 0 40px rgba(0,0,0,0.6), 1px 0 0 rgba(99,102,241,0.08)",
    display: "flex", flexDirection: "column",
};

/* ── Global CSS ──────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  /* Houdini custom property for rotating border */
  @property --nba {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes nbaRotate { to { --nba: 360deg; } }

  /* Status dot pulse — same green as Home "all systems operational" */
  @keyframes sbStatusPulse {
    0%,100% { box-shadow: 0 0 0 0   rgba(52,211,153,0.4); }
    50%      { box-shadow: 0 0 0 5px rgba(52,211,153,0);   }
  }

  /* Pill nav — rotating ambient border, same technique as Login/Signup cards */
  .nb-pill-wrapper {
    position: fixed; top: 14px; left: 0; right: 0;
    z-index: 50;
    display: flex; justify-content: center; align-items: center;
    pointer-events: none;
  }
  .nb-pill {
    border-radius: 9999px; padding: 1.5px;
    pointer-events: auto;
    background: conic-gradient(
      from var(--nba),
      transparent 25%,
      rgba(99,102,241,0.7) 45%,
      rgba(20,184,166,0.6) 55%,
      transparent 75%
    );
    animation: nbaRotate 5s linear infinite;
    will-change: --nba;
  }
  .nb-pill-inner {
    display: flex; align-items: center; gap: 4px;
    padding: 0 16px; height: 48px; border-radius: 9999px;
    /* Matches Home page bg (#04060f) with slight transparency */
    background: rgba(4,6,15,0.95);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  /* Pill links */
  .nb-link {
    padding: 6px 13px; border-radius: 9999px;
    font-family: 'Syne',sans-serif; font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.52); text-decoration: none; white-space: nowrap;
    transition: color 0.2s, background 0.2s;
  }
  .nb-link:hover  { color: #fff; background: rgba(255,255,255,0.07); }
  /* Active uses same indigo tint as Login active state */
  .nb-link.active { color: #a5b4fc; background: rgba(99,102,241,0.12); }

  /* Responsive breakpoints */
  @media (min-width: 768px) {
    .sb-desktop { display: flex !important; }
    .sb-topbar  { display: none  !important; }
  }
  @media (max-width: 767px) {
    .sb-desktop  { display: none  !important; }
    .sb-topbar   { display: flex  !important; }
    .pill-links  { display: none  !important; }
    .pill-burger { display: flex  !important; }
  }
`;

/* ════════════════════════════════════════════════ */
export default function Navbar() {
    const { authUser, isCheckingAuth, logout } = useUserAuthStore();
    const { deleteAllEmailData } = serviceStore();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => { setOpen(false); }, [location.pathname]);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const doLogout = () => logout();
    const doDeleteAll = () => confirm("Delete all email data?") && deleteAllEmailData();

    /* ── Loading spinner ── */
    if (isCheckingAuth) return (
        <>
            <style>{CSS}</style>
            <div style={{
                position: "fixed", inset: 0, zIndex: 999,
                background: T.pageBg,   // ← Home page bg
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: 26, height: 26, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.1)",
                        borderTopColor: T.accent,  // ← Home indigo accent
                    }}
                />
            </div>
        </>
    );

    /* ════════ PUBLIC NAV ════════ */
    if (!authUser) return (
        <>
            <style>{CSS}</style>
            <div style={{ height: 72 }} />

            <div className="nb-pill-wrapper">
            <motion.div
                className="nb-pill"
                initial={{ y: -48, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    boxShadow: scrolled
                        ? "0 8px 40px rgba(0,0,0,0.55), 0 0 20px rgba(99,102,241,0.1)"
                        : "0 4px 20px rgba(0,0,0,0.25)",
                    transition: "box-shadow 0.3s",
                }}
            >
                <div className="nb-pill-inner">
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginRight: 6 }}>
                        <Logo size={24} radius={6} fs={12} />
                        <span
                            className="pill-links"
                            style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: "#fff" }}
                        >
                            MailBlast
                        </span>
                    </div>

                    <div style={{ width: "0.5px", height: 18, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />

                    {/* Desktop links */}
                    <div className="pill-links" style={{ display: "flex", alignItems: "center" }}>
                        {PUBLIC_LINKS.map(({ to, label }, i) => (
                            <motion.div
                                key={to}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.07 }}
                            >
                                <Link
                                    to={to}
                                    className={`nb-link${location.pathname === to ? " active" : ""}`}
                                >
                                    {label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="pill-burger"
                        style={{
                            display: "none",
                            background: "rgba(255,255,255,0.06)",
                            border: `0.5px solid rgba(255,255,255,0.1)`,
                            borderRadius: 8, color: "#fff", cursor: "pointer",
                            width: 34, height: 34,
                            alignItems: "center", justifyContent: "center", marginLeft: 4,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: open ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: "flex" }}
                        >
                            {open ? <HiX size={17} /> : <HiMenuAlt3 size={17} />}
                        </motion.div>
                    </button>
                </div>
            </motion.div>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        style={{
                            position: "fixed", top: 74, left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 49, width: "86vw", maxWidth: 300,
                            background: "rgba(6,6,18,0.98)",
                            border: `0.5px solid rgba(255,255,255,0.09)`,
                            borderRadius: 16, padding: 6,
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        {PUBLIC_LINKS.map(({ to, label }) => (
                            <Link
                                key={to} to={to}
                                onClick={() => setOpen(false)}
                                style={{
                                    display: "block", padding: "11px 14px", borderRadius: 10,
                                    fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 500,
                                    color: location.pathname === to ? "#a5b4fc" : "rgba(255,255,255,0.6)",
                                    background: location.pathname === to ? "rgba(99,102,241,0.1)" : "transparent",
                                    textDecoration: "none", transition: "background 0.15s",
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    /* ════════ AUTHENTICATED SIDEBAR ════════ */
    return (
        <>
            <style>{CSS}</style>

            {/* Desktop sidebar */}
            <motion.aside
                className="sb-desktop"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={SIDEBAR}
            >
                <SidebarContent
                    authUser={authUser} location={location}
                    onClose={() => { }} onLogout={doLogout} onDeleteAll={doDeleteAll}
                />
            </motion.aside>

            {/* Mobile top bar */}
            <div className="sb-topbar" style={{
                position: "fixed", top: 0, left: 0, right: 0, height: 54, zIndex: 50,
                background: "rgba(6,6,18,0.98)",
                borderBottom: `0.5px solid ${T.border}`,
                display: "flex", alignItems: "center",
                padding: "0 14px", justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Logo size={28} radius={7} fs={13} />
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: T.textPrimary }}>
                        MailBlast
                    </span>
                </div>
                <button
                    onClick={() => setOpen(v => !v)}
                    style={{
                        background: "rgba(255,255,255,0.06)",
                        border: `0.5px solid rgba(255,255,255,0.1)`,
                        borderRadius: 8, color: "#fff", cursor: "pointer",
                        width: 34, height: 34,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    <motion.div
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex" }}
                    >
                        {open ? <HiX size={17} /> : <HiMenuAlt3 size={17} />}
                    </motion.div>
                </button>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key="ov" variants={overlayV}
                            initial="hidden" animate="visible" exit="exit"
                            onClick={() => setOpen(false)}
                            style={{
                                position: "fixed", inset: 0, zIndex: 48,
                                background: "rgba(0,0,0,0.65)",
                                backdropFilter: "blur(3px)",
                            }}
                        />
                        <motion.aside
                            key="dr" variants={sidebarV}
                            initial="hidden" animate="visible" exit="exit"
                            style={{ ...SIDEBAR, zIndex: 49 }}
                        >
                            <SidebarContent
                                authUser={authUser} location={location}
                                onClose={() => setOpen(false)}
                                onLogout={doLogout} onDeleteAll={doDeleteAll}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}