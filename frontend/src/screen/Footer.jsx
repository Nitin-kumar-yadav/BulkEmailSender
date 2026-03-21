import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/*TODO:  ── Footer Styles ── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(400%);  }
  }
  @keyframes blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.38);
    text-decoration: none;
    transition: color 0.22s ease;
    position: relative;
    cursor: pointer;
  }
  .footer-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 0.5px;
    background: linear-gradient(90deg, #6366f1, #2dd4bf);
    transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  .footer-link:hover {
    color: rgba(255,255,255,0.85);
  }
  .footer-link:hover::after {
    width: 100%;
  }

  .social-btn {
    width: 36px; height: 36px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
    text-decoration: none;
  }
  .social-btn:hover {
    background: rgba(99,102,241,0.14);
    border-color: rgba(99,102,241,0.35);
    color: #a5b4fc;
    transform: translateY(-2px);
  }

  .status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 0 0 rgba(52,211,153,0.4);
    animation: pulseGreen 2s ease-in-out infinite;
  }
  @keyframes pulseGreen {
    0%,100% { box-shadow: 0 0 0 0   rgba(52,211,153,0.35); }
    50%      { box-shadow: 0 0 0 6px rgba(52,211,153,0);    }
  }

  .footer-divider {
    height: 0.5px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent);
  }

  .section-label {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-bottom: 16px;
  }

  .newsletter-input {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
    min-width: 0;
  }
  .newsletter-input::placeholder { color: rgba(255,255,255,0.25); }
  .newsletter-input:focus { border-color: rgba(99,102,241,0.5); }

  .newsletter-btn {
    padding: 10px 18px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(99,102,241,0.3);
  }
  .newsletter-btn:hover  { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.45); }
  .newsletter-btn:active { transform: scale(0.97); }
`;

/*TODO:  ── Data ── */
const sections = [
    {
        title: "Services",
        links: [
            { label: "Bulk email sender", href: "#bulk-email-sender" },
            { label: "Automated email", href: "#automated-email" },
            { label: "Mass email sender", href: "#mass-email-sender" },
            { label: "Google Gemini Support", href: "#google-gemini-support" },
        ],
    },
    {
        title: "Features",
        links: [
            { label: "AI email writing", href: "#ai-email" },
            { label: "Your own email", href: "#own-email" },
            { label: "Email Templates", href: "#templates" },
            { label: "Upload CSV file", href: "#upload-csv" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About us", href: "#about" },
            { label: "Pricing", href: "#pricing" },
            { label: "Blog", href: "#blog" },
            { label: "Changelog", href: "#changelog" },
        ],
    },
];

/*TODO:  ── Socials ── */
const socials = [
    {
        label: "Twitter / X",
        href: "https://x.com/NitinKumar80560",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        label: "GitHub",
        href: "https://github.com/Nitin-kumar-yadav",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nitin-yadav-179088247",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
];

/*TODO:  ── Variants ── */
const colVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};
const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/*TODO:  ── Footer ── */
const Footer = () => {
    const footerRef = useRef(null);
    const inView = useInView(footerRef, { once: true, margin: "-60px" });

    return (
        <>
            <style>{globalStyles}</style>

            <footer
                ref={footerRef}
                style={{
                    width: "100%",
                    background: "rgba(6,6,14,0.98)",
                    borderTop: "0.5px solid rgba(255,255,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    aria-hidden
                    style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.05) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div
                    aria-hidden
                    style={{
                        position: "absolute", top: -120, left: -80, width: 400, height: 400,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem 0", position: "relative", zIndex: 1 }}>

                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 40,
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 48,
                    }}>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            style={{ maxWidth: 300 }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 9,
                                    background: "linear-gradient(135deg,#6366f1,#14b8a6)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 15, fontWeight: 800, color: "#fff",
                                    fontFamily: "'Syne', sans-serif",
                                }}>M</div>
                                <span style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: 16, fontWeight: 800, color: "#fff",
                                    letterSpacing: "-0.01em",
                                }}>MailBlast</span>
                            </div>

                            <p style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: 13, color: "rgba(255,255,255,0.35)",
                                lineHeight: 1.7, marginBottom: 20,
                            }}>
                                Send bulk emails to thousands of customers — free, fast, and with zero investment required.
                            </p>

                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 7,
                                padding: "5px 12px", borderRadius: 9999,
                                background: "rgba(52,211,153,0.07)",
                                border: "0.5px solid rgba(52,211,153,0.2)",
                            }}>
                                <div className="status-dot" />
                                <span style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: 11, fontWeight: 600,
                                    color: "#34d399", letterSpacing: "0.04em",
                                }}>All systems operational</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            style={{ minWidth: 260, maxWidth: 360, flex: 1 }}
                        >
                            <div className="section-label">Stay in the loop</div>
                            <p style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: 13, color: "rgba(255,255,255,0.35)",
                                lineHeight: 1.65, marginBottom: 14,
                            }}>
                                Get product updates, tips, and email marketing insights — no spam, ever.
                            </p>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="newsletter-input"
                                />
                                <button className="newsletter-btn">Subscribe</button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="footer-divider" style={{ marginBottom: 40 }} />

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: "2rem 3rem",
                        marginBottom: 48,
                    }}>
                        {sections.map((section, si) => (
                            <motion.div
                                key={section.title}
                                variants={colVariants}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                style={{ transitionDelay: `${si * 0.08}s` }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: si * 0.08 }}
                                >
                                    <div className="section-label">{section.title}</div>
                                </motion.div>

                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                                    {section.links.map((link) => (
                                        <motion.li key={link.label} variants={linkVariants}>
                                            <a href={link.href} className="footer-link">
                                                {link.label}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <div className="footer-divider" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                            padding: "20px 0 28px",
                        }}
                    >
                        <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            color: "rgba(255,255,255,0.2)",
                            letterSpacing: "0.04em",
                        }}>
                            © {new Date().getFullYear()} MailBlast — All rights reserved.
                        </span>

                        <div style={{ display: "flex", gap: 20 }}>
                            {["Privacy", "Terms", "Cookies"].map(item => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="footer-link">
                                    {item}
                                </a>
                            ))}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            {socials.map(s => (
                                <a key={s.label} href={s.href} target="_blank" className="social-btn" aria-label={s.label}>
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </footer>
        </>
    );
};

export default Footer;