import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/*TODO: ── 3D TILT + MAGNETIC GLOW PRICING CARDS ── */
const globalStyles = `

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes floatBadge {
    0%,100% { transform: translateY(0px);   }
    50%      { transform: translateY(-4px); }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0   rgba(99,102,241,0.4); }
    70%  { box-shadow: 0 0 0 12px rgba(99,102,241,0);   }
    100% { box-shadow: 0 0 0 0   rgba(99,102,241,0);    }
  }

  .pricing-card {
    position: relative;
    border-radius: 24px;
    padding: 2px;             /* border gradient via padding trick */
    will-change: transform;
    transform-style: preserve-3d;
    cursor: default;
    transition: box-shadow 0.3s ease;
  }
  .pricing-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1.5px;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    transition: background 0.4s;
  }
  .pricing-card.highlight::before {
    background: linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.5), rgba(59,130,246,0.6));
  }
  .pricing-card:hover {
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  }
  .pricing-card.highlight:hover {
    box-shadow: 0 30px 80px rgba(99,102,241,0.3);
  }

  .card-inner {
    position: relative;
    border-radius: 22px;
    overflow: hidden;
    height: 100%;
    background: rgba(12,12,22,0.85);
    padding: 2rem 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    transform-style: preserve-3d;
  }
  .card-inner.highlight-inner {
    background: linear-gradient(160deg, rgba(22,18,48,0.95), rgba(12,12,26,0.98));
  }

  /*TODO:  cursor glow spotlight */
  .card-glow {
    position: absolute;
    width: 280px; height: 280px;
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    z-index: 0;
  }

  .feat-check {
    width: 18px; height: 18px; flex-shrink: 0;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .cta-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.03em;
    cursor: pointer;
    border: none;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.2s ease;
    z-index: 1;
  }
  .cta-btn:hover  { transform: translateY(-2px); }
  .cta-btn:active { transform: translateY(0px) scale(0.98); }

  .cta-btn.default {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.75);
    border: 0.5px solid rgba(255,255,255,0.12);
  }
  .cta-btn.default:hover {
    background: rgba(255,255,255,0.11);
    color: #fff;
  }

  .cta-btn.primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6);
    background-size: 200% 200%;
    color: #fff;
    box-shadow: 0 6px 24px rgba(99,102,241,0.4);
    animation: shimmer 3s linear infinite;
  }
  .cta-btn.primary:hover {
    box-shadow: 0 10px 32px rgba(99,102,241,0.6);
  }

  .badge-popular {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2));
    border: 0.5px solid rgba(139,92,246,0.45);
    color: #a78bfa;
    animation: floatBadge 2.8s ease-in-out infinite;
    width: fit-content;
  }

  .price-num {
    font-family: 'DM Mono', monospace;
    font-size: clamp(2.8rem, 5vw, 3.6rem);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .divider {
    height: 0.5px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    margin: 1.25rem 0;
  }
`;

/*FIXME:  ── Pricing Plans Data ── */

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Everything you need to get started sending emails.",
    features: [
      "15,000 emails per month",
      "Unlimited updates",
      "Community support",
      "Basic analytics",
    ],
    buttonText: "Start for Free",
    glowColor: "rgba(148,163,184,0.07)",
    accentColor: "#94a3b8",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Unlock the full power for growing businesses.",
    features: [
      "50,000 emails per month",
      "Unlimited updates",
      "Priority support",
      "Custom domains",
      "Advanced analytics",
    ],
    buttonText: "Get Pro",
    highlight: true,
    badge: "Most Popular",
    glowColor: "rgba(99,102,241,0.14)",
    accentColor: "#818cf8",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "Unlimited scale with white-glove support.",
    features: [
      "Unlimited emails",
      "Unlimited updates",
      "24/7 Phone support",
      "Dedicated manager",
      "Custom SLA",
    ],
    buttonText: "Contact Sales",
    glowColor: "rgba(20,184,166,0.07)",
    accentColor: "#2dd4bf",
  },
];

/*TODO: ── Single 3D tilt card ── */
const PricingCard = ({ plan, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: "50%", y: "50%", opacity: 0 });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const nx = (cx / rect.width - 0.5) * 2;  // -1 → 1
    const ny = (cy / rect.height - 0.5) * 2;

    setTilt({ x: -ny * 12, y: nx * 12 });   // max 12° tilt
    setGlow({
      x: `${(cx / rect.width) * 100}%`,
      y: `${(cy / rect.height) * 100}%`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlow(g => ({ ...g, opacity: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.13,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 900 }}
    >
      <div
        ref={cardRef}
        className={`pricing-card${plan.highlight ? " highlight" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transition: tilt.x === 0 && tilt.y === 0
            ? "transform 0.6s cubic-bezier(0.22,1,0.36,1)"
            : "transform 0.08s linear",
          height: "100%",
        }}
      >
        <div className={`card-inner${plan.highlight ? " highlight-inner" : ""}`}>

          {/* Cursor glow */}
          <div
            className="card-glow"
            style={{
              left: glow.x,
              top: glow.y,
              opacity: glow.opacity,
              background: `radial-gradient(circle, ${plan.glowColor} 0%, transparent 70%)`,
            }}
          />

          {/* Top section */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {plan.badge && (
              <div className="badge-popular" style={{ marginBottom: 14 }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="4" fill="#a78bfa" />
                </svg>
                {plan.badge}
              </div>
            )}
            {!plan.badge && <div style={{ height: 28, marginBottom: 14 }} />}

            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: plan.accentColor,
              marginBottom: 12,
            }}>
              {plan.name}
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 10 }}>
              <span className="price-num" style={{ color: "#fff" }}>{plan.price}</span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                paddingBottom: 8,
              }}>{plan.period}</span>
            </div>

            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6,
              marginBottom: 0,
            }}>
              {plan.description}
            </p>
          </div>

          <div className="divider" />

          {/* Features */}
          <ul style={{
            listStyle: "none", padding: 0, margin: "0 0 1.5rem",
            display: "flex", flexDirection: "column", gap: 10,
            flex: 1, position: "relative", zIndex: 1,
          }}>
            {plan.features.map((feat, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.13 + 0.35 + i * 0.06, duration: 0.4 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  className="feat-check"
                  style={{
                    background: plan.highlight
                      ? "rgba(99,102,241,0.15)"
                      : "rgba(255,255,255,0.06)",
                    border: `0.5px solid ${plan.highlight ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5.5L4.2 7.5L8 3"
                      stroke={plan.accentColor}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                }}>
                  {feat}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <button
              className={`cta-btn ${plan.highlight ? "primary" : "default"}`}
              onClick={() => window.location.href = "/login"}
            >
              {plan.buttonText}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/*TODO:  ── Pricing ── */
const Pricing = () => {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-40px" });

  return (
    <>
      <style>{globalStyles}</style>

      <div style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "5rem 1.5rem 6rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>

        <div ref={headRef}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 9999,
              background: "rgba(99,102,241,0.1)",
              border: "0.5px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
              fontFamily: "'Syne', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "block" }} />
            Simple Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            Pick your{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              perfect plan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.42)",
              maxWidth: 440,
              lineHeight: 1.7,
              margin: "0 auto",
            }}
          >
            No hidden fees. No surprises. Just straightforward pricing that scales with you.
          </motion.p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginTop: 56,
          width: "100%",
          alignItems: "stretch",
        }}>
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            marginTop: 36,
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          All plans include SSL, 99.9% uptime SLA, and GDPR compliance. Cancel anytime.
        </motion.p>
      </div>
    </>
  );
};

export default Pricing;