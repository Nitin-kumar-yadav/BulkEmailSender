import React, { useState, useRef } from "react";
import { serviceStore } from "../store/serviceStore";

const Compose = () => {
  const { uploadFile, uploadEmailMessage } = serviceStore();
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState({ subject: false, message: false });
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", success: true });
  const fileInputRef = useRef(null);

  const handleAICorrect = async (field) => {
    if (!formData[field].trim()) {
      showToast(`Please enter some ${field} to correct.`, false);
      return;
    }
    setIsAiLoading((prev) => ({ ...prev, [field]: true }));
    // Mock AI correction timeout
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field] + (field === 'subject' ? " ✨" : "\n\n(Enhanced by AI ✨)")
      }));
      setIsAiLoading((prev) => ({ ...prev, [field]: false }));
      showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} enhanced by AI!`);
    }, 1500);
  };

  const showToast = (message, success = true) => {
    setToast({ show: true, message, success });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const fd = new FormData();
    fd.append("file", file);
    uploadFile(fd);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setFileName(file.name);
    const fd = new FormData();
    fd.append("file", file);
    uploadFile(fd);
  };

  const handleSend = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      showToast("Fill in subject and message first.", false);
      return;
    }
    setIsSending(true);
    try {
      const payload = { ...formData, scheduleDate, scheduleTime };
      await uploadEmailMessage(payload);
      setSent(true);
      if (scheduleDate || scheduleTime) {
        showToast(`Campaign scheduled!`);
      } else {
        showToast("Campaign dispatched!");
      }
    } catch {
      showToast("Failed to send. Try again.", false);
    } finally {
      setIsSending(false);
    }
  };

  const charLen = formData.message.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

        /* ── Reset ── */
        .cmp-root, .cmp-root *, .cmp-root *::before, .cmp-root *::after {
          box-sizing: border-box;
        }

        /* ── Shell ── */
        .cmp-root {
          font-family: 'Syne', sans-serif;
          margin-left: 230px;
          min-height: 100vh;
          padding: 36px 40px 48px;
          background: linear-gradient(155deg, #04060f 0%, #0a0d1a 55%, #04080f 100%);
          overflow-x: hidden;
        }

        /* ── Animations ── */
        @keyframes cmpSlideIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cmp-root .anim-0 { animation: cmpSlideIn .5s .00s cubic-bezier(.22,1,.36,1) both; }
        .cmp-root .anim-1 { animation: cmpSlideIn .5s .08s cubic-bezier(.22,1,.36,1) both; }
        .cmp-root .anim-2 { animation: cmpSlideIn .5s .16s cubic-bezier(.22,1,.36,1) both; }
        .cmp-root .anim-3 { animation: cmpSlideIn .5s .24s cubic-bezier(.22,1,.36,1) both; }

        /* ── Header ── */
        .cmp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 24px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .cmp-header-tag {
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #6366f1;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .cmp-header-title {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        /* ── Step pills ── */
        .cmp-steps { display: flex; align-items: center; gap: 6px; }
        .cmp-step-pill {
          padding: 5px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.28);
          font-size: 12px;
          font-weight: 500;
          transition: all .3s;
        }
        .cmp-step-pill.active {
          border-color: rgba(99,102,241,0.35);
          color: #a5b4fc;
          background: rgba(99,102,241,0.1);
        }
        .cmp-step-sep { color: rgba(255,255,255,0.12); font-size: 13px; }

        /* ── Grid ── */
        .cmp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        /* ── Card ── */
        .cmp-card {
          border-radius: 20px;
          padding: 28px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          gap: 18px;
          transition: border-color .25s;
        }
        .cmp-card:hover { border-color: rgba(255,255,255,0.1); }
        .cmp-card-header { display: flex; align-items: center; gap: 10px; }
        .cmp-card-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(99,102,241,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cmp-card-label {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.55);
        }
        .cmp-card-hint {
          font-size: 12px;
          color: rgba(255,255,255,0.22);
          line-height: 1.6;
          margin-top: -6px;
        }

        /* ── Drop zone ── */
        .cmp-dropzone {
          flex: 1;
          min-height: 200px;
          border-radius: 16px;
          border: 2px dashed rgba(255,255,255,0.08);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px; cursor: pointer;
          transition: background .2s, border-color .2s, transform .2s;
        }
        .cmp-dropzone:hover, .cmp-dropzone.drag {
          background: rgba(99,102,241,0.06) !important;
          border-color: rgba(99,102,241,0.35) !important;
          transform: scale(1.008);
        }
        .cmp-dropzone.filled {
          background: rgba(99,102,241,0.06) !important;
          border-color: rgba(99,102,241,0.3) !important;
          border-style: solid !important;
        }
        .cmp-dropzone:hover .cmp-upload-glyph {
          animation: cmpIconBounce .5s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes cmpIconBounce {
          0%   { transform: translateY(0) scale(1); }
          40%  { transform: translateY(-8px) scale(1.12); }
          70%  { transform: translateY(-3px) scale(.96); }
          100% { transform: translateY(0) scale(1); }
        }
        .cmp-upload-glyph {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
        }
        .cmp-drop-text { font-size: 13px; color: rgba(255,255,255,0.3); }
        .cmp-drop-text span { color: #6366f1; }
        .cmp-drop-hint { font-size: 11px; color: rgba(255,255,255,0.15); }
        .cmp-file-name {
          font-size: 13px; font-weight: 500; color: #a5b4fc;
          max-width: 200px; text-align: center;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .cmp-file-replace { font-size: 11px; color: rgba(255,255,255,0.18); }

        /* ── Check animation ── */
        @keyframes cmpPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .cmp-check-anim { animation: cmpPop .4s cubic-bezier(.34,1.56,.64,1) both; }
        .cmp-check-circle {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(99,102,241,0.15);
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Inputs ── */
        .cmp-field { display: flex; flex-direction: column; gap: 8px; }
        .cmp-field-grow { flex: 1; }
        .cmp-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }
        .cmp-input {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          width: 100%;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          color: #e0e7ff;
          outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
          resize: none;
        }
        .cmp-input::placeholder { color: rgba(255,255,255,0.18); }
        .cmp-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .cmp-input::-webkit-scrollbar { width: 4px; }
        .cmp-input::-webkit-scrollbar-track { background: transparent; }
        .cmp-input::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 4px; }
        .cmp-char-count {
          font-size: 11px; transition: color .2s;
        }
        .cmp-body-row {
          display: flex; align-items: center; justify-content: space-between;
        }

        /* ── Send row ── */
        .cmp-send-row {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0 4px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .cmp-send-hint { font-size: 12px; color: rgba(255,255,255,0.18); }

        /* ── Send button ── */
        .cmp-send {
          position: relative; overflow: hidden; border: none;
          border-radius: 100px;
          background: linear-gradient(135deg, #6366f1 0%, #14b8a6 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 13px 36px;
          cursor: pointer; letter-spacing: 0.01em;
          transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .2s, opacity .2s;
          display: inline-flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        .cmp-send::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.1); opacity: 0;
          transition: opacity .2s;
        }
        .cmp-send:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
        }
        .cmp-send:hover::before { opacity: 1; }
        .cmp-send:active { transform: scale(.97); }
        .cmp-send:disabled { opacity: .55; pointer-events: none; }

        /* ── Spinner ── */
        @keyframes cmpSpin { to { transform: rotate(360deg); } }
        .cmp-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cmpSpin .7s linear infinite;
          flex-shrink: 0;
        }

        /* ── Toast ── */
        .cmp-toast {
          position: fixed; bottom: 28px; left: 50%;
          transform: translateX(-50%) translateY(16px);
          background: rgba(6,6,18,0.97);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 10px 22px;
          font-family: 'Syne', sans-serif;
          font-size: 13px; color: #e0e7ff;
          display: flex; align-items: center; gap: 8px;
          opacity: 0; pointer-events: none;
          transition: opacity .25s, transform .35s cubic-bezier(.22,1,.36,1);
          z-index: 9999; white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0,0,0,.55);
        }
        .cmp-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .cmp-toast-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* ── AI & Schedule Additions ── */
        .cmp-ai-btn {
          background: linear-gradient(90deg, #ff00cc, #3333ff, #00d4ff, #ff00cc);
          background-size: 300% auto;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          animation: cmpAiGlow 3s linear infinite;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cmp-ai-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(255, 0, 204, 0.4);
        }
        .cmp-ai-btn:disabled {
          opacity: 0.6; pointer-events: none; animation: none;
        }
        @keyframes cmpAiGlow {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        .cmp-schedule-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .cmp-ai-spinner {
          width: 12px; height: 12px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cmpSpin .7s linear infinite;
        }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .cmp-root {
            margin-left: 0;
            padding: 70px 18px 40px;
          }
          .cmp-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .cmp-header { flex-direction: column; align-items: flex-start; }
          .cmp-header-title { font-size: 26px; }
          .cmp-card { padding: 20px; }
          .cmp-send { padding: 12px 28px; font-size: 13px; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .cmp-root { padding: 30px 24px 40px; }
          .cmp-grid { gap: 16px; }
        }
      `}</style>

      {/* Page shell */}
      <div className="cmp-root">

        {/* ── Header ── */}
        <div className="cmp-header anim-0">
          <div>
            <p className="cmp-header-tag">NEW CAMPAIGN</p>
            <h1 className="cmp-header-title">Compose Email</h1>
          </div>

          {/* Step pills */}
          <div className="cmp-steps">
            {["Recipients", "Message", "Send"].map((s, i) => (
              <React.Fragment key={s}>
                <span className={`cmp-step-pill ${(i === 0 && fileName) ||
                    (i === 1 && formData.subject && formData.message) ||
                    (i === 2 && sent)
                    ? "active" : ""}`}
                >
                  {s}
                </span>
                {i < 2 && <span className="cmp-step-sep">›</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div className="cmp-grid">

          {/* Left — Recipients */}
          <div className="cmp-card anim-1">
            <div className="cmp-card-header">
              <div className="cmp-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="cmp-card-label">Recipients</span>
            </div>

            <p className="cmp-card-hint">
              Upload an Excel or CSV file containing your contact list.
            </p>

            {/* Drop zone */}
            <div
              className={`cmp-dropzone ${isDragging ? "drag" : ""} ${fileName ? "filled" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {fileName ? (
                <>
                  <div className="cmp-check-anim cmp-check-circle">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="cmp-file-name">{fileName}</p>
                  <p className="cmp-file-replace">Click to replace</p>
                </>
              ) : (
                <>
                  <div className="cmp-upload-glyph">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </div>
                  <p className="cmp-drop-text">
                    Drop file here or{" "}
                    <span>browse</span>
                  </p>
                  <p className="cmp-drop-hint">CSV · XLSX · XLS</p>
                </>
              )}

              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleFileChange} />
            </div>
          </div>

          {/* Right — Subject + Message */}
          <div className="cmp-card anim-2">
            <div className="cmp-card-header">
              <div className="cmp-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="cmp-card-label">Message</span>
            </div>

            {/* Subject */}
            <div className="cmp-field">
              <div className="cmp-body-row">
                <label className="cmp-label">Subject</label>
                <button className="cmp-ai-btn" onClick={(e) => { e.preventDefault(); handleAICorrect("subject"); }} disabled={isAiLoading.subject}>
                  {isAiLoading.subject ? <span className="cmp-ai-spinner" /> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
                  {isAiLoading.subject ? "Fixing..." : "AI Correct"}
                </button>
              </div>
              <input
                type="text"
                className="cmp-input"
                placeholder="Your email subject line…"
                maxLength={120}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            {/* Body */}
            <div className="cmp-field cmp-field-grow">
              <div className="cmp-body-row">
                <label className="cmp-label">Body</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button className="cmp-ai-btn" onClick={(e) => { e.preventDefault(); handleAICorrect("message"); }} disabled={isAiLoading.message}>
                    {isAiLoading.message ? <span className="cmp-ai-spinner" /> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
                    {isAiLoading.message ? "Enhancing..." : "AI Enhance"}
                  </button>
                  <span className="cmp-char-count" style={{ color: charLen > 1800 ? "#f87171" : "rgba(255,255,255,0.18)" }}>
                    {charLen} / 2000
                  </span>
                </div>
              </div>
              <textarea
                className="cmp-input"
                rows={9}
                placeholder="Craft your message here…"
                maxLength={2000}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* ── Schedule ── */}
        <div className="cmp-schedule-grid anim-3">
          <div className="cmp-field">
            <label className="cmp-label">Schedule Date</label>
            <input
              type="date"
              className="cmp-input"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="cmp-field">
            <label className="cmp-label">Schedule Time</label>
            <input
              type="time"
              className="cmp-input"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
        </div>

        {/* ── Send row ── */}
        <div className="cmp-send-row anim-3">
          <p className="cmp-send-hint">
            {fileName && formData.subject && formData.message
              ? "✦ Ready to dispatch"
              : "Complete all fields to send"}
          </p>

          <button className="cmp-send" onClick={handleSend} disabled={isSending}>
            {isSending && <span className="cmp-spinner" />}
            {isSending ? "Sending…" : sent ? "✓ Sent" : "Send Campaign"}
          </button>
        </div>
      </div>

      {/* Toast notification */}
      <div className={`cmp-toast${toast.show ? " show" : ""}`}>
        <div className="cmp-toast-dot" style={{ background: toast.success ? "#34d399" : "#f87171" }} />
        {toast.message}
      </div>
    </>
  );
};

export default Compose;