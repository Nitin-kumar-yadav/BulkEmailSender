import React, { useState, useEffect } from 'react'
import { useUserAuthStore } from '../store/userAuthStore'
import { serviceStore } from '../store/serviceStore'

const EyeIcon = ({ open }) => open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

const SaveIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
)

const ShieldIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)

const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const CopyIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
)

const mask = (val) => val ? '•'.repeat(Math.min(val.length, 18)) : ''

const CredentialRow = ({ label, value, visible, onToggle, onCopy, copied }) => (
    <div className="stg-cred-row">
        <div className="stg-cred-header">
            <span className="stg-cred-label">{label}</span>
            <div style={{ display: 'flex', gap: 6 }}>
                <button
                    onClick={onCopy} title="Copy"
                    className={`stg-icon-btn ${copied ? 'copied' : ''}`}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
                <button
                    onClick={onToggle} title={visible ? 'Hide' : 'Show'}
                    className={`stg-icon-btn ${visible ? 'active' : ''}`}
                >
                    <EyeIcon open={visible} />
                </button>
            </div>
        </div>
        <div className={`stg-cred-val ${visible ? 'visible' : value ? 'masked' : 'empty'}`}>
            {value ? (visible ? value : mask(value)) : 'Not set'}
        </div>
    </div>
)

const Settings = () => {
    const { authUser } = useUserAuthStore()
    const { EmailData, getReportList, updateEmailPass } = serviceStore()

    const [appPassword, setAppPassword] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [username, setUsername] = useState('')
    const [emailAppPassword, setEmailAppPassword] = useState(EmailData?.emailAppPassword || '')
    const { updateUserPassword } = useUserAuthStore()

    useEffect(() => {
        getReportList()
        if (authUser?.Email) setUsername(authUser.Email)
    }, [authUser, getReportList])

    useEffect(() => {
        if (EmailData?.emailAppPassword) {
            setAppPassword(EmailData.emailAppPassword)
            setEmailAppPassword(EmailData.emailAppPassword)
        }
    }, [EmailData])


    const [saved, setSaved] = useState(false)
    const [vis, setVis] = useState({ username: false, password: false, appPassword: false })
    const [copied, setCopied] = useState({ username: false, password: false, appPassword: false })

    const toggleVis = (key) => setVis(v => ({ ...v, [key]: !v[key] }))

    const handleCopy = (key, value) => {
        if (!value) return
        navigator.clipboard.writeText(value).catch(() => { })
        setCopied(c => ({ ...c, [key]: true }))
        setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 1800)
    }

    const handleSave = () => {
        // Here we would dispatch the actual save requests if backend routes existed
        // For now, it visually saves as requested by the user flow.
        updateEmailPass({ emailAppPassword })
        updateUserPassword({ Password: userPassword })
        setSaved(true)
        setTimeout(() => setSaved(false), 2200)
    }

    const [showPass, setShowPass] = useState(false)
    const [showApp, setShowApp] = useState(false)

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        /* ── Reset ── */
        .stg-root, .stg-root *, .stg-root *::before, .stg-root *::after {
          box-sizing: border-box;
        }

        .stg-root { 
            font-family: 'Syne', sans-serif;
            margin-left: 230px;
            min-height: 100vh;
            padding: 36px 40px 48px;
            background: linear-gradient(155deg, #04060f 0%, #0a0d1a 55%, #04080f 100%);
            overflow-x: hidden;
            position: relative;
        }

        @keyframes stgIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stg-root .sa0 { animation: stgIn .5s .00s cubic-bezier(.22,1,.36,1) both; }
        .stg-root .sa1 { animation: stgIn .5s .07s cubic-bezier(.22,1,.36,1) both; }
        .stg-root .sa2 { animation: stgIn .5s .14s cubic-bezier(.22,1,.36,1) both; }
        .stg-root .sa3 { animation: stgIn .5s .21s cubic-bezier(.22,1,.36,1) both; }

        /* ── Ambient orbs ── */
        .stg-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(100px); z-index: 0;
        }
        .stg-content { position: relative; z-index: 1; width: 100%; max-width: 1000px; }

        /* ── Header ── */
        .stg-header {
            margin-bottom: 36px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding-bottom: 28px;
        }
        .stg-header-tag {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.18em;
            color: #6366f1;
            text-transform: uppercase;
            margin: 0 0 8px;
        }
        .stg-header-title {
            font-size: 32px;
            font-weight: 800;
            color: #fff;
            line-height: 1.15;
            letter-spacing: -0.01em;
            margin: 0;
        }
        .stg-header-desc {
            margin: 8px 0 0;
            font-size: 13px;
            color: rgba(255,255,255,0.3);
        }

        /* ── Layout Grid ── */
        .stg-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 40px;
            align-items: start;
        }

        .stg-card { display: flex; flex-direction: column; gap: 28px; }
        .stg-divider {
          width: 1px; height: 100%; min-height: 400px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent);
        }

        /* ── Card Header ── */
        .stg-card-header { display: flex; alignItems: center; gap: 12px; }
        .stg-card-icon {
            width: 34px; height: 34px; border-radius: 10px;
            background: rgba(99,102,241,0.12);
            color: #818cf8;
            display: flex; align-items: center; justify-content: center;
        }

        /* ── Forms ── */
        .stg-field { display: flex; flex-direction: column; gap: 8px; }
        .stg-label {
            font-size: 11px; font-weight: 600;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: rgba(255,255,255,0.3);
        }

        .stg-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          color: #f0eaff;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .stg-input::placeholder { color: rgba(255,255,255,0.18); }
        .stg-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .stg-input-wrap { position: relative; }
        .stg-input-wrap .stg-input { padding-right: 44px; }
        .stg-eye {
          position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
          width: 32px; height: 32px; border-radius: 8px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: color .2s;
        }
        .stg-eye:hover { color: #a5b4fc; }

        /* ── Save Button ── */
        .stg-save {
          display: inline-flex; align-items: center; gap: 8px;
          border: none; border-radius: 100px;
          background: linear-gradient(135deg, #6366f1, #14b8a6);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 13px 32px; cursor: pointer;
          transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
          position: relative; overflow: hidden;
        }
        .stg-save::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.1); opacity: 0;
          transition: opacity .2s;
        }
        .stg-save:hover { transform: scale(1.04); box-shadow: 0 8px 32px rgba(99,102,241,0.4); }
        .stg-save:hover::before { opacity: 1; }
        .stg-save:active { transform: scale(.97); }

        @keyframes stgPop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
        .stg-saved-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 100px;
          background: rgba(52,211,153,0.12);
          border: 1px solid rgba(52,211,153,0.25);
          color: #34d399; font-size: 13px; font-weight: 500;
          animation: stgPop .35s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ── Credential Rows ── */
        .stg-cred-row {
            display: flex; flex-direction: column; gap: 8px;
            padding: 16px;
            border-radius: 14px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.07);
        }
        .stg-cred-header { display: flex; align-items: center; justify-content: space-between; }
        .stg-cred-label { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        
        .stg-icon-btn {
            width: 28px; height: 28px; border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.04);
            color: rgba(255,255,255,0.4);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all .2s;
        }
        .stg-icon-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
        .stg-icon-btn.copied { background: rgba(52,211,153,0.15); color: #34d399; border-color: rgba(52,211,153,0.3); }
        .stg-icon-btn.active { background: rgba(99,102,241,0.18); color: #a5b4fc; border-color: rgba(99,102,241,0.3); }

        .stg-cred-val {
            font-family: 'DM Mono', monospace;
            font-size: 14px;
            min-height: 20px;
            word-break: break-all;
            transition: color .2s, letter-spacing .2s;
        }
        .stg-cred-val.visible { color: #e0e7ff; letter-spacing: 0.02em; }
        .stg-cred-val.masked { color: rgba(255,255,255,0.45); letter-spacing: 0.12em; line-height:1; }
        .stg-cred-val.empty { color: rgba(255,255,255,0.18); font-size: 13px; font-family: 'Syne', sans-serif;}

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .stg-root {
            margin-left: 0;
            padding: 70px 18px 40px;
          }
          .stg-grid { grid-template-columns: 1fr; gap: 32px; }
          .stg-divider { display: none; }
          .stg-header-title { font-size: 26px; }
          .stg-orb { display: none; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .stg-root { padding: 30px 24px 40px; }
          .stg-grid { gap: 24px; }
        }
      `}</style>

            {/* Page shell */}
            <div className="stg-root">
                {/* Ambient orbs */}
                <div className="stg-orb" style={{ width: 480, height: 480, top: -100, left: -50, background: 'rgba(99,102,241,0.15)' }} />
                <div className="stg-orb" style={{ width: 360, height: 360, bottom: -80, right: -60, background: 'rgba(20,184,166,0.1)' }} />

                <div className="stg-content">

                    {/* ── Header ── */}
                    <div className="stg-header sa0">
                        <p className="stg-header-tag">Configuration</p>
                        <h1 className="stg-header-title">Settings</h1>
                        <p className="stg-header-desc">Manage your credentials and account configuration</p>
                    </div>

                    {/* ── Two-column layout ── */}
                    <div className="stg-grid">

                        {/* ── LEFT: Edit form ── */}
                        <div className="stg-card sa1">

                            {/* Section label */}
                            <div className="stg-card-header">
                                <div className="stg-card-icon"><ShieldIcon /></div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Update Credentials</p>
                                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Changes are saved locally</p>
                                </div>
                            </div>

                            {/* Username */}
                            <div className="stg-field">
                                <label className="stg-label">Username / Email</label>
                                <input
                                    type="text"
                                    className="stg-input"
                                    placeholder="you@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {/* App Password */}
                            <div className="stg-field">
                                <label className="stg-label">App Password</label>
                                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
                                    16-character password generated by Google for third-party apps.{' '}
                                    <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer"
                                        style={{ color: '#818cf8', textDecoration: 'none' }}
                                        onMouseOver={e => e.target.style.textDecoration = 'underline'}
                                        onMouseOut={e => e.target.style.textDecoration = 'none'}
                                    >
                                        How to get it →
                                    </a>
                                </p>
                                <div className="stg-input-wrap">
                                    <input
                                        type={showApp ? 'text' : 'password'}
                                        className="stg-input"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        value={appPassword}
                                        onChange={(e) => setAppPassword(e.target.value) || setEmailAppPassword(e.target.value)}
                                    />
                                    <button className="stg-eye" onClick={() => setShowApp(v => !v)}>
                                        <EyeIcon open={showApp} />
                                    </button>
                                </div>
                            </div>

                            {/* User Password */}
                            <div className="stg-field">
                                <label className="stg-label">Account Password</label>
                                <div className="stg-input-wrap">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        className="stg-input"
                                        placeholder="Your account password"
                                        value={userPassword}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                    />
                                    <button className="stg-eye" onClick={() => setShowPass(v => !v)}>
                                        <EyeIcon open={showPass} />
                                    </button>
                                </div>
                            </div>

                            {/* Save */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 8 }}>
                                <button className="stg-save" onClick={handleSave}>
                                    <SaveIcon />
                                    Save Changes
                                </button>
                                {saved && (
                                    <div className="stg-saved-badge">
                                        <CheckIcon />
                                        Saved!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Divider ── */}
                        <div className="stg-divider sa2" />

                        {/* ── RIGHT: Credential preview ── */}
                        <div className="stg-card sa3">

                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Stored Credentials</p>
                                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Click the eye icon to reveal · Copy to clipboard</p>
                            </div>

                            <CredentialRow
                                label="Username / Email"
                                value={username}
                                visible={vis.username}
                                onToggle={() => toggleVis('username')}
                                onCopy={() => handleCopy('username', username)}
                                copied={copied.username}
                            />

                            <CredentialRow
                                label="App Password"
                                value={appPassword}
                                visible={vis.appPassword}
                                onToggle={() => toggleVis('appPassword')}
                                onCopy={() => handleCopy('appPassword', appPassword)}
                                copied={copied.appPassword}
                            />

                            <CredentialRow
                                label="Account Password"
                                value={userPassword}
                                visible={vis.password}
                                onToggle={() => toggleVis('password')}
                                onCopy={() => handleCopy('password', userPassword)}
                                copied={copied.password}
                            />


                            {/* Security tip */}
                            <div style={{
                                marginTop: 8, padding: '14px 16px', borderRadius: 14,
                                background: 'rgba(99,102,241,0.06)',
                                border: '1px solid rgba(99,102,241,0.15)',
                            }}>
                                <p style={{ margin: 0, fontSize: 12, color: 'rgba(165,180,252,0.8)', lineHeight: 1.65 }}>
                                    🔒 Credentials are stored only in your local session. They are never transmitted without your action.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings