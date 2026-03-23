import { useState } from 'react';
import { useUserAuthStore } from '../store/userAuthStore';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const verifyStyles = `
  .vrf-wrap {
    min-height: calc(100vh - 5rem);
    display: flex; align-items: center; justify-content: center;
    padding: 24px 16px;
    background: linear-gradient(155deg, #04060f 0%, #0a0d1a 55%, #04080f 100%);
  }

  .vrf-card {
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 40px 32px;
    animation: vrfSlideUp .5s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes vrfSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .vrf-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
    color: #fff; text-align: center;
    margin: 0 0 6px; letter-spacing: -0.01em;
  }

  .vrf-subtitle {
    font-family: 'Syne', sans-serif;
    font-size: 13px; color: rgba(255,255,255,0.35);
    text-align: center; margin: 0 0 32px;
  }

  .vrf-form { display: flex; flex-direction: column; gap: 20px; }

  .vrf-label {
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-bottom: 8px; display: block;
  }

  .vrf-input {
    width: 100%;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 14px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 16px; letter-spacing: 0.25em;
    color: #e0e7ff; text-align: center;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .vrf-input::placeholder { color: rgba(255,255,255,0.18); letter-spacing: 0.1em; }
  .vrf-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .vrf-btn {
    width: 100%; border: none; border-radius: 100px;
    background: linear-gradient(135deg, #6366f1 0%, #14b8a6 100%);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 600;
    padding: 14px 24px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .2s, opacity .2s;
    position: relative; overflow: hidden;
  }
  .vrf-btn::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0.1); opacity: 0;
    transition: opacity .2s;
  }
  .vrf-btn:hover { transform: scale(1.03); box-shadow: 0 8px 32px rgba(99,102,241,0.35); }
  .vrf-btn:hover::before { opacity: 1; }
  .vrf-btn:active { transform: scale(.97); }
  .vrf-btn:disabled { opacity: .55; pointer-events: none; }

  @keyframes vrfSpin { to { transform: rotate(360deg); } }
  .vrf-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: vrfSpin .7s linear infinite;
    flex-shrink: 0;
  }

  .vrf-resend {
    background: none; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 500;
    color: #818cf8; text-align: center;
    padding: 8px; width: 100%;
    transition: color .2s;
  }
  .vrf-resend:hover { color: #a5b4fc; text-decoration: underline; }

  @media (max-width: 480px) {
    .vrf-card { padding: 32px 20px; }
    .vrf-title { font-size: 24px; }
  }
`;

export const Verification = () => {
    const { isOtpVerify, otpVerify, authUser, resendOtp } = useUserAuthStore();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        otp: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await otpVerify(userData);
            if (success) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Verification failed:", error);
        }
    };

    if (authUser && authUser.isVerified) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleResendOtp = async () => {
        try {
            const success = await resendOtp(userData);
            if (success) {
                toast.success("OTP sent successfully!");
            }
        } catch (error) {
            console.error("Resend OTP failed:", error);
        }
    };

    return (
        <>
            <style>{verifyStyles}</style>
            <div className="vrf-wrap">
                <div className="vrf-card">
                    <h1 className="vrf-title">Verify OTP</h1>
                    <p className="vrf-subtitle">Please enter the code sent to your email</p>

                    <form className="vrf-form" onSubmit={handleSubmit}>
                        <div>
                            <label className="vrf-label">OTP Code</label>
                            <input
                                className="vrf-input"
                                value={userData.otp}
                                onChange={(e) => setUserData({ ...userData, otp: e.target.value })}
                                type="number"
                                placeholder="Enter OTP"
                            />
                        </div>

                        <button className="vrf-btn" disabled={isOtpVerify} type="submit">
                            {isOtpVerify ? (
                                <>
                                    <span className="vrf-spinner" />
                                    Verifying…
                                </>
                            ) : 'Verify'}
                        </button>

                        <button
                            type="button"
                            className="vrf-resend"
                            onClick={() => handleResendOtp()}
                        >
                            Resend OTP
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};