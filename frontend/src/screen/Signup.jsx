import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuthStore } from '../store/userAuthStore';
import toast from 'react-hot-toast';

/*TODO: ── Shared styles (identical to Login) ── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes rotateBorder {
    to { --angle: 360deg; }
  }
  @keyframes orbPulse1 {
    0%,100% { transform: translate(0,0) scale(1);           opacity: 0.35; }
    50%      { transform: translate(30px,-40px) scale(1.1);  opacity: 0.5;  }
  }
  @keyframes orbPulse2 {
    0%,100% { transform: translate(0,0) scale(1);            opacity: 0.2; }
    50%      { transform: translate(-25px,35px) scale(1.08);  opacity: 0.38; }
  }
  @keyframes orbPulse3 {
    0%,100% { transform: translate(0,0) scale(1);            opacity: 0.18; }
    60%      { transform: translate(20px,30px) scale(1.06);   opacity: 0.3; }
  }

  /*TODO: ── Ambient rotating border — same conic trick as Login ── */
  .signup-card-wrap {
    position: relative;
    border-radius: 24px;
    padding: 1.5px;
    background: conic-gradient(
      from var(--angle),
      transparent 20%,
      rgba(20,184,166,0.85)  38%,
      rgba(99,102,241,0.75)  50%,
      rgba(139,92,246,0.7)   62%,
      transparent 80%
    );
    animation: rotateBorder 4s linear infinite;
    will-change: --angle;
    box-shadow:
      0 0 40px rgba(20,184,166,0.18),
      0 0 80px rgba(99,102,241,0.1),
      0 32px 64px rgba(0,0,0,0.5);
  }
  .signup-card-wrap::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 25px;
    background: conic-gradient(
      from var(--angle),
      transparent 20%,
      rgba(20,184,166,0.12) 40%,
      rgba(99,102,241,0.1)  60%,
      transparent 80%
    );
    filter: blur(14px);
    z-index: -1;
    animation: rotateBorder 4s linear infinite;
  }

  .signup-card {
    background: rgba(9,9,20,0.97);
    border-radius: 22.5px;
    padding: 2.25rem 2.25rem 2rem;
    position: relative;
    overflow: hidden;
  }
  .signup-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(148,163,184,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    border-radius: 22.5px;
  }

  /*TODO: Reuse same input + button + label styles from Login */
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
    border-color: rgba(20,184,166,0.6);
    background: rgba(20,184,166,0.04);
    box-shadow: 0 0 0 3px rgba(20,184,166,0.1), 0 0 20px rgba(20,184,166,0.06);
  }
  .input-field.error {
    border-color: rgba(239,68,68,0.6) !important;
    background: rgba(239,68,68,0.04) !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
  }

  .signup-btn {
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
    background: linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #8b5cf6 100%);
    background-size: 200% 200%;
    box-shadow: 0 4px 24px rgba(20,184,166,0.35);
    transition: box-shadow 0.25s, transform 0.15s, opacity 0.2s;
  }
  .signup-btn:hover:not(:disabled) {
    box-shadow: 0 8px 36px rgba(20,184,166,0.55);
    transform: translateY(-1px);
  }
  .signup-btn:active:not(:disabled) { transform: scale(0.98); }
  .signup-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .signup-btn::after {
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

  /*TODO: password strength bar */
  .strength-bar {
    height: 3px;
    border-radius: 2px;
    transition: width 0.4s ease, background 0.4s ease;
  }
`;

/*TODO: ── Framer variants (same as Login) ── */
const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/*TODO: ── Password strength helper ── */
const getStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score, label: 'Fair', color: '#f59e0b' };
    if (score <= 4) return { score, label: 'Good', color: '#10b981' };
    return { score, label: 'Strong', color: '#14b8a6' };
};

/*TODO: ── Eye icon ── */
const EyeIcon = ({ open }) => open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

/*TODO: ── Input field with left icon ── */
const InputRow = ({ label, icon, type = 'text', placeholder, value, onChange, onFocus, onBlur, focused, name, rightSlot, hasError }) => (
    <motion.div variants={fadeUp}>
        <label className="label-text">{label}</label>
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)',
                color: focused === name ? '#2dd4bf' : 'rgba(255,255,255,0.2)',
                transition: 'color 0.25s', pointerEvents: 'none',
            }}>
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => onFocus(name)}
                onBlur={() => onBlur('')}
                className={`input-field${hasError ? ' error' : ''}`}
                style={{ paddingLeft: 42, paddingRight: rightSlot ? 42 : 16 }}
                autoComplete="off"
            />
            {rightSlot && (
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                    {rightSlot}
                </div>
            )}
        </div>
    </motion.div>
);

/*TODO: ════════════════════SIGNUP COMPONENT═════════════════════ */
const Signup = () => {
    const navigate = useNavigate();
    const { isSignup, signup } = useUserAuthStore();

    const [userData, setUserData] = useState({
        Name: '', Email: '', Password: '', ConfirmPassword: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [focused, setFocused] = useState('');
    const [pwMismatch, setPwMismatch] = useState(false);

    const strength = getStrength(userData.Password);

    const set = (key) => (e) => {
        setUserData((prev) => ({ ...prev, [key]: e.target.value }));
        if (key === 'ConfirmPassword' || key === 'Password') setPwMismatch(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!userData.Name || !userData.Email || !userData.Password || !userData.ConfirmPassword) {
            toast.error('All fields are required');
            return;
        }
        if (userData.Password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (userData.Password !== userData.ConfirmPassword) {
            setPwMismatch(true);
            toast.error('Passwords do not match');
            return;
        }

        const success = await signup(userData);
        if (success) navigate('/verify-otp');
    };

    return (
        <>
            <style>{globalStyles}</style>

            <div style={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#04060f',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
            }}>

                <div className="orb" style={{
                    width: 480, height: 480, background: '#0d9488',
                    top: '-12%', right: '-8%', opacity: 0.28,
                    animation: 'orbPulse1 14s ease-in-out infinite',
                }} />
                <div className="orb" style={{
                    width: 420, height: 420, background: '#4f46e5',
                    bottom: '-10%', left: '-8%', opacity: 0.22,
                    animation: 'orbPulse2 17s ease-in-out infinite',
                }} />
                <div className="orb" style={{
                    width: 300, height: 300, background: '#7c3aed',
                    top: '40%', left: '5%', opacity: 0.15,
                    animation: 'orbPulse3 20s ease-in-out infinite',
                }} />

                <div aria-hidden style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.07) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                }} />
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
                >
                    <div className="signup-card-wrap">
                        <div className="signup-card">

                            {/*TODO: Header */}
                            <motion.div
                                variants={fadeUp} initial="hidden" animate="visible"
                                style={{ textAlign: 'center', marginBottom: 28 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    style={{
                                        width: 52, height: 52, borderRadius: 14,
                                        background: 'linear-gradient(135deg, #14b8a6, #6366f1, #8b5cf6)',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 22, fontWeight: 800, color: '#fff',
                                        fontFamily: "'Syne', sans-serif",
                                        boxShadow: '0 8px 32px rgba(20,184,166,0.4)',
                                        marginBottom: 18,
                                    }}
                                >
                                    M
                                </motion.div>

                                <h1 style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: '1.7rem', fontWeight: 800,
                                    color: '#fff', margin: '0 0 6px',
                                    letterSpacing: '-0.02em',
                                }}>
                                    Create your account
                                </h1>
                                <p style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0,
                                }}>
                                    Start sending bulk emails for free
                                </p>
                            </motion.div>

                            {/*TODO: Form */}
                            <motion.form
                                variants={stagger} initial="hidden" animate="visible"
                                onSubmit={handleSignup}
                                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                            >

                                <InputRow
                                    label="Full name" name="name" placeholder="John Doe"
                                    value={userData.Name} onChange={set('Name')}
                                    onFocus={setFocused} onBlur={setFocused} focused={focused}
                                    icon={
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                    }
                                />

                                <InputRow
                                    label="Email address" name="email" type="email" placeholder="hello@example.com"
                                    value={userData.Email} onChange={set('Email')}
                                    onFocus={setFocused} onBlur={setFocused} focused={focused}
                                    icon={
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    }
                                />

                                <motion.div variants={fadeUp}>
                                    <label className="label-text">Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: 14, top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: focused === 'password' ? '#2dd4bf' : 'rgba(255,255,255,0.2)',
                                            transition: 'color 0.25s', pointerEvents: 'none',
                                        }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                            </svg>
                                        </div>
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Min. 6 characters"
                                            value={userData.Password}
                                            onChange={set('Password')}
                                            onFocus={() => setFocused('password')}
                                            onBlur={() => setFocused('')}
                                            className="input-field"
                                            style={{ paddingLeft: 42, paddingRight: 42 }}
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
                                            onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                                        >
                                            <EyeIcon open={showPass} />
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {userData.Password && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                transition={{ duration: 0.25 }}
                                                style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}
                                            >
                                                <div style={{
                                                    flex: 1, height: 3, borderRadius: 2,
                                                    background: 'rgba(255,255,255,0.07)',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div
                                                        className="strength-bar"
                                                        style={{
                                                            width: `${(strength.score / 5) * 100}%`,
                                                            background: strength.color,
                                                        }}
                                                    />
                                                </div>
                                                <span style={{
                                                    fontFamily: "'Syne', sans-serif",
                                                    fontSize: 11, fontWeight: 600,
                                                    color: strength.color,
                                                    letterSpacing: '0.05em',
                                                    minWidth: 42,
                                                }}>
                                                    {strength.label}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <label className="label-text">Confirm password</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: 14, top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: focused === 'confirm'
                                                ? pwMismatch ? '#ef4444' : '#2dd4bf'
                                                : 'rgba(255,255,255,0.2)',
                                            transition: 'color 0.25s', pointerEvents: 'none',
                                        }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            </svg>
                                        </div>
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Re-enter your password"
                                            value={userData.ConfirmPassword}
                                            onChange={set('ConfirmPassword')}
                                            onFocus={() => setFocused('confirm')}
                                            onBlur={() => setFocused('')}
                                            className={`input-field${pwMismatch ? ' error' : ''}`}
                                            style={{ paddingLeft: 42, paddingRight: 42 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(v => !v)}
                                            style={{
                                                position: 'absolute', right: 14, top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'rgba(255,255,255,0.25)',
                                                display: 'flex', alignItems: 'center',
                                                transition: 'color 0.2s', padding: 0,
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                                        >
                                            <EyeIcon open={showConfirm} />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {pwMismatch && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                style={{
                                                    fontFamily: "'Syne', sans-serif",
                                                    fontSize: 11, color: '#f87171',
                                                    marginTop: 6, marginBottom: 0,
                                                }}
                                            >
                                                ✕ Passwords do not match
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={fadeUp} style={{ marginTop: 4 }}>
                                    <button
                                        type="submit"
                                        disabled={isSignup}
                                        className="signup-btn"
                                        style={{ opacity: isSignup ? 0.85 : 1 }}
                                    >
                                        <AnimatePresence>
                                            {isSignup && (
                                                <motion.span
                                                    key="shimmer"
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '200%' }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                                                    style={{
                                                        position: 'absolute', top: 0, left: 0,
                                                        width: '60%', height: '100%',
                                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                                                        pointerEvents: 'none', zIndex: 2,
                                                    }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence mode="wait">
                                            {isSignup ? (
                                                <motion.span
                                                    key="loading"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', gap: 10,
                                                        position: 'relative', zIndex: 3,
                                                    }}
                                                >
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        {[0, 1, 2].map((i) => (
                                                            <motion.span
                                                                key={i}
                                                                animate={{
                                                                    y: ['0%', '-50%', '0%'],
                                                                    opacity: [0.4, 1, 0.4],
                                                                }}
                                                                transition={{
                                                                    duration: 0.65,
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
                                                    <span style={{ letterSpacing: '0.04em' }}>Creating account</span>
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="idle"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', gap: 8,
                                                        position: 'relative', zIndex: 3,
                                                    }}
                                                >
                                                    Create account
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

                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                margin: '22px 0 18px',
                            }}>
                                <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
                                <span style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: 11, color: 'rgba(255,255,255,0.2)',
                                    letterSpacing: '0.06em',
                                }}>OR</span>
                                <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
                            </div>

                            <p style={{
                                textAlign: 'center',
                                fontFamily: "'Syne', sans-serif",
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.3)',
                                margin: 0,
                            }}>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{ color: '#2dd4bf', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#5eead4'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#2dd4bf'}
                                >
                                    Sign in →
                                </Link>
                            </p>

                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Signup;