import React, { useEffect, useMemo, useRef, useState } from "react";
import { serviceStore } from "../store/serviceStore";

// ── Icons ──────────────────────────────────────────────────────
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const ChevronUp = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
    </svg>
);
const ChevronDown = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const RefreshIcon = ({ spinning }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: spinning ? "rptSpin .8s linear infinite" : "none" }}>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);
const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);
const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

// ── Helpers ────────────────────────────────────────────────────
const toArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.reports)) return data.reports;
    if (Array.isArray(data.emails)) return data.emails;
    const firstArr = Object.values(data).find(Array.isArray);
    return firstArr ?? [];
};

const COLS = ["#", "Email", "Name", "ID", "Created At", "Status"];
const COL_KEYS = ["index", "email", "name", "_id", "createdAt", "status"];
const pad = (n) => String(n).padStart(2, "0");

// ── useTimer hook ──────────────────────────────────────────────
const useTimer = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!targetDate) { setTimeLeft(null); return; }

        const update = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) { setTimeLeft("past"); return; }

            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };

        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return timeLeft;
};

// ── StatusBadge ────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const isSuccess = status === "success";
    const isPending = status === "pending";
    const color = isSuccess ? "#34d399" : isPending ? "#fbbf24" : "#f87171";
    const bg = isSuccess ? "rgba(52,211,153,0.1)" : isPending ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)";
    const bdr = isSuccess ? "rgba(52,211,153,0.3)" : isPending ? "rgba(251,191,36,0.3)" : "rgba(248,113,113,0.3)";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 100,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            background: bg, border: `1px solid ${bdr}`, color,
            textTransform: "uppercase",
        }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
            {status || "unknown"}
        </span>
    );
};

// ── CountdownBox ───────────────────────────────────────────────
const CountdownBox = ({ schedule, timeLeft }) => {
    if (!timeLeft) return null;

    const isUrgent = timeLeft !== "past" &&
        timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5;

    return (
        <div style={{
            margin: "0 0 32px",
            padding: "20px 24px",
            borderRadius: 16,
            border: `1px solid ${timeLeft === "past" ? "rgba(248,113,113,0.3)" : "rgba(251,191,36,0.3)"}`,
            background: timeLeft === "past" ? "rgba(248,113,113,0.06)" : "rgba(251,191,36,0.06)",
            animation: "rptFadeUp .4s cubic-bezier(.16,1,.3,1) both",
        }}>

            {/* Label row */}
            <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 16,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: timeLeft === "past" ? "#f87171" : "#fbbf24",
            }}>
                {/* Pulse dot */}
                {timeLeft !== "past" && (
                    <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "#fbbf24", flexShrink: 0,
                        animation: "rptPulse 1.5s ease-in-out infinite",
                    }} />
                )}
                <ClockIcon />
                {timeLeft === "past" ? "Scheduled time has passed — please reschedule" : "Campaign sending in"}
            </div>

            {timeLeft === "past" ? (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    The scheduled time <strong style={{ color: "#fff" }}>{schedule?.date} {schedule?.time}</strong> has already passed.
                    Please update the schedule from the Compose page.
                </p>
            ) : (
                <>
                    {/* Tiles */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {[
                            { value: pad(timeLeft.days), unit: "Days" },
                            { value: pad(timeLeft.hours), unit: "Hours" },
                            { value: pad(timeLeft.minutes), unit: "Minutes" },
                            { value: pad(timeLeft.seconds), unit: "Seconds" },
                        ].map((item, i) => (
                            <React.Fragment key={item.unit}>
                                {i > 0 && (
                                    <span style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.15)", marginBottom: 18 }}>:</span>
                                )}
                                <div style={{
                                    flex: 1, display: "flex", flexDirection: "column",
                                    alignItems: "center", gap: 6,
                                    padding: "14px 8px",
                                    background: "rgba(255,255,255,0.04)",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    minWidth: 64,
                                }}>
                                    <span style={{
                                        fontSize: 28, fontWeight: 800, lineHeight: 1,
                                        letterSpacing: "-0.02em",
                                        fontVariantNumeric: "tabular-nums",
                                        color: isUrgent ? "#f87171" : "#fff",
                                        transition: "color .3s",
                                    }}>
                                        {item.value}
                                    </span>
                                    <span style={{
                                        fontSize: 10, fontWeight: 600,
                                        letterSpacing: "0.12em", textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.25)",
                                    }}>
                                        {item.unit}
                                    </span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Scheduled for */}
                    <p style={{ margin: "14px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                        Scheduled for&nbsp;
                        <strong style={{ color: "rgba(255,255,255,0.6)" }}>
                            {schedule?.date} at {schedule?.time}
                        </strong>
                    </p>
                </>
            )}
        </div>
    );
};

// ── Main Report component ──────────────────────────────────────
const Report = () => {
    const { reportList, getReportList, loading, error, EmailData } = serviceStore();
    const hasFetched = useRef(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 12;

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            getReportList();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Countdown ──────────────────────────────────────────────────
    const scheduleObj = EmailData?.schedule;
    const isScheduled = Boolean(scheduleObj?.date && scheduleObj?.time && scheduleObj?.status !== "completed");

    const targetDate = useMemo(() => {
        if (!isScheduled) return null;

        // Normalize date → "YYYY-MM-DD"
        const rawDate = scheduleObj.date;
        const normalizedDate = rawDate.includes("T")
            ? rawDate.split("T")[0]           // "2025-01-15T00:00:00Z" → "2025-01-15"
            : rawDate;                         // "2025-01-15" → already fine

        // Normalize time → "HH:MM"
        const rawTime = scheduleObj.time;
        const normalizedTime = rawTime.length > 5
            ? rawTime.slice(0, 5)             // "14:30:00" → "14:30"
            : rawTime;                         // "14:30"  → already fine

        const combined = `${normalizedDate}T${normalizedTime}:00`;
        const parsed = new Date(combined);

        // Return null if the date is invalid
        return isNaN(parsed.getTime()) ? null : combined;

    }, [isScheduled, scheduleObj?.date, scheduleObj?.time]);

    const timeLeft = useTimer(targetDate);
    // console.log(timeLeft)

    const handleRefresh = async () => {
        setRefreshing(true);
        hasFetched.current = false;
        await getReportList();
        hasFetched.current = true;
        setRefreshing(false);
    };

    const handleSort = (key) => {
        setPage(1);
        setSort(prev =>
            prev.key === key
                ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key, dir: "asc" }
        );
    };

    const list = toArray(reportList);

    const filtered = list
        .filter(item =>
            !search || [item?.email, item?.name, item?._id, item?.status]
                .some(v => v?.toLowerCase?.().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            const { key, dir } = sort;
            if (key === "createdAt") {
                return dir === "asc"
                    ? new Date(a?.createdAt ?? 0) - new Date(b?.createdAt ?? 0)
                    : new Date(b?.createdAt ?? 0) - new Date(a?.createdAt ?? 0);
            }
            const va = (a?.[key] ?? "").toString().toLowerCase();
            const vb = (b?.[key] ?? "").toString().toLowerCase();
            return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const sentCount = list.filter(r => r?.status === "success").length;
    const failCount = list.filter(r => r?.status === "failed").length;
    const pendCount = list.filter(r => r?.status === "pending").length;
    const successPct = list.length ? Math.round((sentCount / list.length) * 100) : 0;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400&display=swap');

                .rpt-root, .rpt-root *, .rpt-root *::before, .rpt-root *::after { box-sizing: border-box; }

                .rpt-root {
                    font-family: 'Outfit', sans-serif;
                    margin-left: 230px;
                    min-height: 100vh;
                    padding: 40px 48px 60px;
                    background: #030509;
                    background-image:
                        radial-gradient(circle at 15% 50%, rgba(99,102,241,0.08), transparent 25%),
                        radial-gradient(circle at 85% 30%, rgba(52,211,153,0.05), transparent 25%);
                    overflow-x: hidden;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }

                @keyframes rptFadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes rptSpin    { to{transform:rotate(360deg)} }
                @keyframes rptPulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }

                .ra0{animation:rptFadeUp .6s .00s cubic-bezier(.16,1,.3,1) both}
                .ra1{animation:rptFadeUp .6s .08s cubic-bezier(.16,1,.3,1) both}
                .ra2{animation:rptFadeUp .6s .16s cubic-bezier(.16,1,.3,1) both}
                .ra3{animation:rptFadeUp .6s .24s cubic-bezier(.16,1,.3,1) both}
                .ra4{animation:rptFadeUp .6s .32s cubic-bezier(.16,1,.3,1) both}

                /* Search */
                .rpt-search-wrapper {
                    position: relative; border-radius: 14px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                    transition: all 0.3s; display: flex; align-items: center;
                }
                .rpt-search-wrapper:focus-within {
                    border-color: rgba(99,102,241,0.5);
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
                    background: rgba(255,255,255,0.04);
                }
                .rpt-search {
                    background: transparent; border: none;
                    padding: 12px 16px 12px 42px;
                    font-family: 'Outfit', sans-serif; font-size: 14px;
                    color: #fff; outline: none; width: 280px;
                }
                .rpt-search::placeholder { color: rgba(255,255,255,0.3); }

                /* Table */
                .rpt-table { width:100%; border-collapse:separate; border-spacing:0 8px; min-width:700px; }
                .rpt-th {
                    padding: 0 20px 10px; font-size:11px; font-weight:600;
                    letter-spacing:0.15em; text-transform:uppercase;
                    color:rgba(255,255,255,0.4); text-align:left;
                    cursor:pointer; user-select:none; transition:color .2s;
                }
                .rpt-th:hover { color:rgba(255,255,255,0.8); }
                .rpt-th.active { color:#818cf8; }
                .rpt-tr td {
                    background:rgba(255,255,255,0.02);
                    border-top:1px solid rgba(255,255,255,0.04);
                    border-bottom:1px solid rgba(255,255,255,0.04);
                    padding:16px 20px; font-size:14px;
                    color:rgba(255,255,255,0.7); vertical-align:middle;
                    transition: background .2s, border-color .2s;
                }
                .rpt-tr td:first-child {
                    border-left:1px solid rgba(255,255,255,0.04);
                    border-top-left-radius:12px; border-bottom-left-radius:12px;
                    text-align:center; color:rgba(255,255,255,0.3);
                }
                .rpt-tr td:last-child {
                    border-right:1px solid rgba(255,255,255,0.04);
                    border-top-right-radius:12px; border-bottom-right-radius:12px;
                }
                .rpt-tr:hover td {
                    background:rgba(99,102,241,0.06);
                    border-color:rgba(99,102,241,0.15);
                }
                .rpt-td-mono {
                    font-family:'DM Mono',monospace; font-size:12px;
                    color:rgba(255,255,255,0.4); max-width:150px;
                    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
                }

                /* Refresh button */
                .rpt-btn-refresh {
                    display:inline-flex; align-items:center; gap:8px;
                    background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2);
                    color:#818cf8; border-radius:10px; padding:10px 18px;
                    font-family:'Outfit',sans-serif; font-size:13px; font-weight:500;
                    cursor:pointer; transition:all .2s;
                }
                .rpt-btn-refresh:hover:not(:disabled) {
                    background:rgba(99,102,241,0.15); border-color:rgba(99,102,241,0.4);
                    transform:translateY(-1px);
                }
                .rpt-btn-refresh:disabled { opacity:.5; cursor:not-allowed; }

                /* Stat card */
                .rpt-stat-card {
                    background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
                    border-radius:20px; padding:24px; display:flex; align-items:center;
                    gap:20px; position:relative; overflow:hidden;
                    transition:all .3s;
                }
                .rpt-stat-card:hover {
                    background:rgba(255,255,255,0.035); border-color:rgba(255,255,255,0.1);
                    transform:translateY(-2px); box-shadow:0 10px 30px rgba(0,0,0,.2);
                }
                .rpt-stat-icon-wrap {
                    width:56px; height:56px; border-radius:16px;
                    display:flex; align-items:center; justify-content:center; flex-shrink:0;
                }

                /* Pagination */
                .rpt-page-btn {
                    width:34px; height:34px; border-radius:10px;
                    display:inline-flex; align-items:center; justify-content:center;
                    border:1px solid rgba(255,255,255,0.06);
                    background:rgba(255,255,255,0.02);
                    color:rgba(255,255,255,0.4);
                    font-family:'Outfit',sans-serif; font-size:13px; font-weight:500;
                    cursor:pointer; transition:all .2s;
                }
                .rpt-page-btn:hover:not(:disabled) {
                    border-color:rgba(99,102,241,0.3); color:#fff;
                    background:rgba(99,102,241,0.1);
                }
                .rpt-page-btn.active {
                    background:#6366f1; border-color:#6366f1; color:#fff;
                    box-shadow:0 4px 12px rgba(99,102,241,0.3);
                }
                .rpt-page-btn:disabled { opacity:.3; cursor:not-allowed; }

                @media (max-width: 767px) {
                    .rpt-root { margin-left:0; padding:80px 20px 40px; }
                    .rpt-stat-grid { grid-template-columns:1fr !important; }
                    .rpt-search { width:100%; }
                    .rpt-toolbar { flex-direction:column; align-items:stretch; gap:16px; }
                }
                @media (min-width: 768px) and (max-width: 1024px) {
                    .rpt-root { padding:40px 32px; }
                }
            `}</style>

            <div className="rpt-root">
                <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", maxWidth: 1200, width: "100%", margin: "0 auto" }}>

                    {/* ── Header ── */}
                    <div className="ra0" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                                    <MailIcon />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", color: "#818cf8", textTransform: "uppercase" }}>Campaign Insights</span>
                            </div>
                            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Performance Report</h1>
                        </div>
                        <button className="rpt-btn-refresh" onClick={handleRefresh} disabled={loading || refreshing}>
                            <RefreshIcon spinning={refreshing} />
                            {refreshing ? "Syncing…" : "Refresh"}
                        </button>
                    </div>

                    {/* ── Countdown box ── */}
                    {isScheduled && targetDate && (
                        <div className="ra1">
                            <CountdownBox schedule={scheduleObj} timeLeft={timeLeft} />
                        </div>
                    )}

                    {/* ── Stat cards ── */}
                    <div className="ra2 rpt-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginBottom: 32 }}>

                        {/* Total */}
                        <div className="rpt-stat-card">
                            <div className="rpt-stat-icon-wrap" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>Total Dispatched</p>
                                <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{loading ? "–" : list.length}</p>
                            </div>
                        </div>

                        {/* Success */}
                        <div className="rpt-stat-card">
                            <div className="rpt-stat-icon-wrap" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>Successfully Delivered</p>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                    <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{loading ? "–" : sentCount}</p>
                                    {!loading && list.length > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: "#34d399" }}>({successPct}%)</span>}
                                </div>
                            </div>
                        </div>

                        {/* Failed */}
                        <div className="rpt-stat-card">
                            <div className="rpt-stat-icon-wrap" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>Delivery Failures</p>
                                <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{loading ? "–" : failCount}</p>
                            </div>
                        </div>

                        {/* Pending */}
                        <div className="rpt-stat-card">
                            <div className="rpt-stat-icon-wrap" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>Pending</p>
                                <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{loading ? "–" : pendCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Table Area ── */}
                    <div className="ra3" style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                        {/* Toolbar */}
                        <div className="rpt-toolbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <div className="rpt-search-wrapper">
                                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none", display: "flex" }}>
                                    <SearchIcon />
                                </span>
                                <input className="rpt-search" placeholder="Search by email, name, or status…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                            </div>
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                                <span style={{ color: "#fff" }}>{filtered.length}</span> records
                            </span>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, minHeight: 300 }}>
                                <div style={{ width: 40, height: 40, border: "3px solid rgba(99,102,241,0.1)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "rptSpin 1s linear infinite" }} />
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Fetching records...</span>
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, background: "rgba(248,113,113,0.05)", border: "1px dashed rgba(248,113,113,0.2)", borderRadius: 20 }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#fff" }}>Failed to load report</p>
                                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{error}</p>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && filtered.length === 0 && (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 20 }}>
                                <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "rgba(255,255,255,0.3)" }}>
                                    <SearchIcon />
                                </div>
                                <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600, color: "#fff" }}>No records found</p>
                                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{search ? "Try adjusting your search." : "No emails dispatched yet."}</p>
                            </div>
                        )}

                        {/* Table */}
                        {!loading && !error && filtered.length > 0 && (
                            <div className="ra4" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <div style={{ overflowX: "auto", paddingBottom: 16 }}>
                                    <table className="rpt-table">
                                        <colgroup>
                                            <col style={{ width: 60 }} />
                                            <col style={{ width: "25%" }} />
                                            <col style={{ width: "15%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "15%" }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                {COLS.map((col, i) => {
                                                    const key = COL_KEYS[i];
                                                    const sortable = key !== "index";
                                                    const isActive = sort.key === key;
                                                    return (
                                                        <th key={col} className={`rpt-th ${isActive ? "active" : ""}`}
                                                            style={{ textAlign: i === 0 ? "center" : "left" }}
                                                            onClick={() => sortable && handleSort(key)}>
                                                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                                                {col}
                                                                {sortable && (
                                                                    <span style={{ opacity: isActive ? 1 : 0.3 }}>
                                                                        {sort.dir === "asc" && isActive ? <ChevronUp /> : <ChevronDown />}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((item, index) => (
                                                <tr key={item?._id || index} className="rpt-tr">
                                                    <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                                                    <td style={{ color: "#fff", fontWeight: 500 }}>{item?.email || "—"}</td>
                                                    <td>{item?.name || "—"}</td>
                                                    <td><div className="rpt-td-mono" title={item?._id}>{item?._id || "—"}</div></td>
                                                    <td style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                                                        {item?.createdAt ? new Date(item.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—"}
                                                    </td>
                                                    <td><StatusBadge status={item?.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                                            Showing <span style={{ color: "#fff" }}>{(page - 1) * PAGE_SIZE + 1}</span>–<span style={{ color: "#fff" }}>{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span style={{ color: "#fff" }}>{filtered.length}</span>
                                        </span>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button className="rpt-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                                return (
                                                    <button key={p} className={`rpt-page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                                                );
                                            })}
                                            <button className="rpt-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Report;