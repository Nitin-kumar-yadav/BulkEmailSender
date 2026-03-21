import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuthStore } from '../store/userAuthStore';

/*TODO: ── Login Page ── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  /* ── Ambient rotating border light ── */
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes rotateBorder {
    to { --angle: 360deg; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px);  }
    50%      { transform: translateY(-8px); }
  }
  @keyframes orbPulse1 {
    0%,100% { transform: translate(0,0) scale(1);        opacity: 0.35; }
    50%      { transform: translate(30px,-40px) scale(1.1); opacity: 0.5;  }
  }
  @keyframes orbPulse2 {
    0%,100% { transform: translate(0,0) scale(1);          opacity: 0.25; }
    50%      { transform: translate(-25px,35px) scale(1.08); opacity: 0.4;  }
  }
  @keyframes shimmerText {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .login-card-wrap {
    position: relative;
    border-radius: 24px;
    padding: 1.5px;
    background: conic-gradient(
      from var(--angle),
      transparent 20%,
      rgba(99,102,241,0.9) 40%,
      rgba(139,92,246,0.7) 50%,
      rgba(59,130,246,0.8) 60%,
      transparent 80%
    );
    animation: rotateBorder 4s linear infinite;
    will-change: --angle;
    box-shadow:
      0 0 40px rgba(99,102,241,0.2),
      0 0 80px rgba(99,102,241,0.1),
      0 32px 64px rgba(0,0,0,0.5);
  }
  .login-card-wrap::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 25px;
    background: conic-gradient(
      from var(--angle),
      transparent 20%,
      rgba(99,102,241,0.15) 40%,
      rgba(59,130,246,0.1) 60%,
      transparent 80%
    );
    filter: blur(12px);
    z-index: -1;
    animation: rotateBorder 4s linear infinite;
  }

  .login-card {
    background: rgba(9,9,20,0.97);
    border-radius: 22.5px;
    padding: 2.5rem 2.25rem;
    position: relative;
    overflow: hidden;
  }

  /*TODO: inner grid pattern */
  .login-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(148,163,184,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    border-radius: 22.5px;
  }

  .input-field {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 13px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    color: #fff;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    box-sizing: border-box;
  }
  .input-field::placeholder { color: rgba(255,255,255,0.2); }
  .input-field:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.08);
  }

  .login-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    border: none;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: #fff;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
    background-size: 200% 200%;
    box-shadow: 0 4px 24px rgba(99,102,241,0.4);
    transition: box-shadow 0.25s, transform 0.15s, opacity 0.2s;
  }
  .login-btn:hover:not(:disabled) {
    box-shadow: 0 8px 36px rgba(99,102,241,0.6);
    transform: translateY(-1px);
  }
  .login-btn:active:not(:disabled) { transform: scale(0.98); }
  .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .login-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .label-text {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 8px;
    display: block;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    will-change: transform, opacity;
  }
`;

/*TODO: ── Variants ── */
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/*TODO:  ── Password eye toggle icon ── */
const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/*TODO: ----Login Page---- */
const Login = () => {
  const [userData, setUserData] = useState({ Email: '', Password: '' });
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const { isLogin, login } = useUserAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(userData);
      if (res?.success) navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#04060f',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="orb" style={{
          width: 500, height: 500,
          background: '#4f46e5',
          top: '-15%', left: '-10%',
          opacity: 0.3,
          animation: 'orbPulse1 12s ease-in-out infinite',
        }} />
        <div className="orb" style={{
          width: 400, height: 400,
          background: '#0d9488',
          bottom: '-10%', right: '-8%',
          opacity: 0.2,
          animation: 'orbPulse2 15s ease-in-out infinite',
        }} />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.07) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />

        {/*TODO: ── Card ── */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
        >
          <div className="login-card-wrap">
            <div className="login-card">

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 32,
                }}
              >
                
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 800, color: '#fff',
                    fontFamily: "'Syne', sans-serif",
                    boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
                    marginBottom: 20,
                  }}
                >
                  M
                </motion.div>

                <h1 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#fff',
                  margin: '0 0 6px',
                  letterSpacing: '-0.02em',
                }}>
                  Welcome back
                </h1>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.38)',
                  margin: 0,
                }}>
                  Sign in to your MailBlast account
                </p>
              </motion.div>

              <motion.form
                variants={stagger}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              >

                <motion.div variants={fadeUp}>
                  <label className="label-text">Email address</label>
                  <div style={{ position: 'relative' }}>
                    {/* icon */}
                    <div style={{
                      position: 'absolute', left: 14, top: '50%',
                      transform: 'translateY(-50%)',
                      color: focused === 'email' ? '#818cf8' : 'rgba(255,255,255,0.2)',
                      transition: 'color 0.25s', pointerEvents: 'none',
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      value={userData.Email}
                      onChange={(e) => setUserData({ ...userData, Email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      className="input-field"
                      style={{ paddingLeft: 42 }}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label className="label-text" style={{ margin: 0 }}>Password</label>
                    <a href="#" style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 11, fontWeight: 600,
                      color: '#818cf8',
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                      transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                      onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 14, top: '50%',
                      transform: 'translateY(-50%)',
                      color: focused === 'password' ? '#818cf8' : 'rgba(255,255,255,0.2)',
                      transition: 'color 0.25s', pointerEvents: 'none',
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={userData.Password}
                      onChange={(e) => setUserData({ ...userData, Password: e.target.value })}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                      className="input-field"
                      style={{ paddingLeft: 42, paddingRight: 42 }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      style={{
                        position: 'absolute', right: 14, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.25)',
                        display: 'flex', alignItems: 'center',
                        transition: 'color 0.2s', padding: 0,
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} style={{ marginTop: 4 }}>
                  <button
                    type="submit"
                    disabled={isLogin}
                    className="login-btn"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      opacity: isLogin ? 0.85 : 1,
                    }}
                  >
                    <AnimatePresence>
                      {isLogin && (
                        <motion.span
                          key="shimmer"
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                          style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '60%', height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                            pointerEvents: 'none',
                            zIndex: 2,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {isLogin ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            position: 'relative',
                            zIndex: 3,
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                animate={{
                                  y: ['0%', '-45%', '0%'],
                                  opacity: [0.4, 1, 0.4],
                                }}
                                transition={{
                                  duration: 0.7,
                                  repeat: Infinity,
                                  delay: i * 0.13,
                                  ease: 'easeInOut',
                                }}
                                style={{
                                  display: 'inline-block',
                                  width: 6, height: 6,
                                  borderRadius: '50%',
                                  background: '#fff',
                                }}
                              />
                            ))}
                          </span>
                          <span style={{ letterSpacing: '0.04em' }}>Signing in</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            position: 'relative',
                            zIndex: 3,
                          }}
                        >
                          Sign in
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            →
                          </motion.span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>

              </motion.form>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  margin: '24px 0',
                }}
              >
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 11, color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.06em',
                }}>OR</span>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
              </motion.div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{
                  textAlign: 'center',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.3)',
                  margin: 0,
                }}
              >
                Don't have an account?{' '}
                <Link to="/signup" style={{
                  color: '#818cf8', fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                  onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
                >
                  Create one free →
                </Link>
              </motion.p>

            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;