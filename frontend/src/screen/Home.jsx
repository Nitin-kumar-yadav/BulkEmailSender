import React, { useEffect, useRef } from 'react'
import Card from './Card'
import Footer from './Footer'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from 'framer-motion'

/*TODO:  ── Home Styles ── */
const globalStyles = `
  @keyframes orbFloat1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(45px,-60px) scale(1.12); }
    66%      { transform: translate(-30px,35px) scale(0.95); }
  }
  @keyframes orbFloat2 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(-55px,40px) scale(1.08); }
    66%      { transform: translate(40px,-50px) scale(1.15); }
  }
  @keyframes orbFloat3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(35px,55px) scale(0.92); }
  }
  @keyframes scrollBounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(8px); }
  }
  @keyframes badgePing {
    0%,100% { transform: scale(1); opacity: 0.75; }
    50%      { transform: scale(1.8); opacity: 0; }
  }

  /*TODO: Orb base — blur lives here, NOT on the animated child */
  .orb-wrap {
    position: absolute;
    border-radius: 50%;
    filter: blur(72px);
    opacity: 0.32;
    pointer-events: none;
    overflow: hidden;       /* clip the inner div */
  }
  .orb-inner {
    width: 100%; height: 100%;
    border-radius: 50%;
    will-change: transform; /* own GPU layer */
  }
  .orb-inner-1 { animation: orbFloat1 20s ease-in-out infinite; }
  .orb-inner-2 { animation: orbFloat2 24s ease-in-out infinite; }
  .orb-inner-3 { animation: orbFloat3 18s ease-in-out infinite; }

  .scroll-bounce { animation: scrollBounce 1.6s ease-in-out infinite; }
  .badge-ping    { animation: badgePing   1.8s ease-in-out infinite; }

  /*TODO: CTA button */
  .cta-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.875rem 2.25rem;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 1rem;
    color: #fff;
    background: linear-gradient(135deg,#3b82f6,#14b8a6,#10b981);
    box-shadow: 0 0 28px rgba(59,130,246,0.3);
    transition: box-shadow 0.25s, transform 0.15s;
    text-decoration: none;
    cursor: pointer;
  }
  .cta-btn:hover  { box-shadow: 0 0 44px rgba(59,130,246,0.5); transform: scale(1.04); }
  .cta-btn:active { transform: scale(0.97); }

  /*TODO: Feature card — CSS hover only */
  .feat-card {
    border-radius: 1rem;
    border: 0.5px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.025);
    padding: 1.5rem;
    transition: transform 0.25s ease, border-color 0.25s ease,
                box-shadow 0.25s ease;
    will-change: transform;
  }
  .feat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(99,210,255,0.22);
    box-shadow: 0 12px 32px rgba(0,0,0,0.25);
  }

  /*TODO: Gradient text helper */
  .grad-text {
    background-image: linear-gradient(90deg,#60a5fa,#2dd4bf,#34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grad-text-2 {
    background-image: linear-gradient(90deg,#2dd4bf,#60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

/*TODO:  ── Animated counter ── */
const Counter = ({ from = 0, to, suffix = '', prefix = '' }) => {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (v) =>
    prefix + Math.round(v).toLocaleString() + suffix
  )
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (inView) animate(count, to, { duration: 2, ease: 'easeOut' })
  }, [inView, count, to])
  return <motion.span ref={ref}>{rounded}</motion.span>
}

/*TODO:  ── Framer variants (opacity + transform only) ── */
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
}

/*TODO: ── Static data ── */
const chips = ['No credit card', 'SMTP ready', '15k emails/month', 'Open-source']
const features = [
  { icon: '✉️', title: 'Bulk Sending', desc: 'Upload a CSV and fire off thousands of personalised emails in minutes.' },
  { icon: '📊', title: 'Real-time Analytics', desc: 'Track opens, clicks, and bounces with a live dashboard.' },
  { icon: '🔒', title: 'Your SMTP', desc: 'Bring your own SMTP or use ours. Full data privacy guaranteed.' },
]
const stats = [
  { to: 15000, suffix: '+', prefix: '', label: 'Emails / month free' },
  { to: 99, suffix: '%', prefix: '', label: 'Delivery rate' },
  { to: 50000, suffix: '+', prefix: '', label: 'Emails sent today' },
  { to: 0, suffix: '', prefix: '$', label: 'Cost to start' },
]

/* ══════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <style>{globalStyles}</style>

      <div style={{ position: 'relative', background: '#04060f', color: '#fff', overflowX: 'hidden', minHeight: '100vh' }}>

        {/*TODO:  ── Background orbs ── */}
        <div className="orb-wrap" style={{ width: 560, height: 560, top: -200, left: -150 }}>
          <div className="orb-inner orb-inner-1" style={{ background: '#2563eb' }} />
        </div>
        <div className="orb-wrap" style={{ width: 480, height: 480, top: '8%', right: -160 }}>
          <div className="orb-inner orb-inner-2" style={{ background: '#0d9488' }} />
        </div>
        <div className="orb-wrap" style={{ width: 380, height: 380, bottom: '4%', left: '18%' }}>
          <div className="orb-inner orb-inner-3" style={{ background: '#4f46e5' }} />
        </div>

        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.09) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/*TODO:  ══════════ HERO ══════════ */}
        <section
          style={{
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', padding: '5rem 1.5rem 6rem',
            textAlign: 'center',
          }}
        >
          <motion.div
            variants={fadeUp} custom={0.05} initial="hidden" animate="visible"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 28, borderRadius: 9999,
              border: '0.5px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              padding: '6px 16px', fontSize: 13, color: '#93c5fd',
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span
                className="badge-ping"
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%', background: '#60a5fa',
                }}
              />
              <span style={{
                position: 'relative', width: 8, height: 8,
                borderRadius: '50%', background: '#60a5fa', display: 'block',
              }} />
            </span>
            Now free — no credit card required
          </motion.div>

          <motion.h1
            variants={stagger} initial="hidden" animate="visible"
            style={{
              maxWidth: 860, fontWeight: 800, letterSpacing: '-0.02em',
              lineHeight: 1.07, fontFamily: '"DM Sans",sans-serif',
              fontSize: 'clamp(2.6rem,7vw,5.2rem)',
            }}
          >
            {['Free bulk', 'email sender', 'zero-investment'].map((line, i) => (
              <motion.span key={line} variants={fadeUp} style={{ display: 'block' }}>
                {i === 2 ? (
                  <>with <span className="grad-text">zero investment</span> 🚀</>
                ) : line}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeUp} custom={0.55} initial="hidden" animate="visible"
            style={{
              marginTop: 24, maxWidth: 520, fontSize: '1.1rem',
              lineHeight: 1.7, color: 'rgba(255,255,255,0.5)',
            }}
          >
            Send bulk emails to your customers with no upfront cost. Powered by your
            own SMTP — full control, no vendor lock-in.
          </motion.p>

          <motion.div
            variants={fadeUp} custom={0.75} initial="hidden" animate="visible"
            style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 20 }}
          >
            <Link to="/signup" className="cta-btn">Get Started Free</Link>
            <a
              href="#features"
              style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')}
            >
              See how it works →
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp} custom={0.95} initial="hidden" animate="visible"
            style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}
          >
            {chips.map(chip => (
              <span
                key={chip}
                style={{
                  borderRadius: 9999, padding: '4px 12px', fontSize: 12,
                  border: '0.5px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.035)',
                  color: 'rgba(255,255,255,0.42)',
                }}
              >
                ✓ {chip}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp} custom={1.3} initial="hidden" animate="visible"
            style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)' }}
          >
            <div
              className="scroll-bounce"
              style={{
                width: 20, height: 32, borderRadius: 10,
                border: '0.5px solid rgba(255,255,255,0.16)',
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'center', paddingTop: 6,
              }}
            >
              <div style={{ width: 4, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.32)' }} />
            </div>
          </motion.div>
        </section>

        {/*TODO: ══════════ STATS BAND ══════════ */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{
            position: 'relative', zIndex: 10,
            borderTop: '0.5px solid rgba(255,255,255,0.06)',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.018)',
            padding: '2.5rem 1.5rem',
          }}
        >
          <div
            style={{
              maxWidth: 900, margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
              gap: '2rem', textAlign: 'center',
            }}
          >
            {stats.map(({ to, suffix, prefix, label }) => (
              <div key={label}>
                <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#fff' }}>
                  <Counter to={to} suffix={suffix} prefix={prefix} />
                </div>
                <div style={{ marginTop: 4, fontSize: 13, color: 'rgba(255,255,255,0.36)' }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/*TODO: ══════════ FEATURES ══════════ */}
        <section
          id="features"
          style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem' }}
        >
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2
              style={{
                fontWeight: 800, lineHeight: 1.1,
                fontFamily: '"DM Sans",sans-serif',
                fontSize: 'clamp(1.9rem,5vw,3.2rem)',
              }}
            >
              Free bulk email software —{' '}
              <span className="grad-text-2">15,000 mass emails monthly</span>
            </h2>
            <p style={{ marginTop: 16, fontSize: '1.05rem', color: 'rgba(255,255,255,0.44)', maxWidth: 520, margin: '16px auto 0' }}>
              No hidden fees, no throttling, no nonsense. Just reliable bulk sending.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: 16, marginBottom: 56,
            }}
          >
            {features.map(({ icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="feat-card">
                <div style={{ fontSize: '1.6rem', marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>{title}</div>
                <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.46)' }}>{desc}</div>
              </motion.div>
            ))}
          </motion.div>
/* TODO: Card component */
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card />
          </motion.div>
        </section>

        {/*TODO: ══════════ FOOTER ══════════ */}
        <Footer />
      </div>
    </>
  )
}