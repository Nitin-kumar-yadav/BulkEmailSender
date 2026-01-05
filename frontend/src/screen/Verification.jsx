import React, { useState } from 'react';
import { useUserAuthStore } from '../store/userAuthStore';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
        <div className="h-[calc(100vh-5rem)] flex items-center justify-center px-4 ">
            <div className="w-full max-w-md border-white dark:bg-(--bg-primary) light:bg-(--bg-quaternary) rounded-2xl p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold font-comfortaa">Verify OTP</h1>
                    <p className="text-gray-500 font-space-grotesk mt-2">
                        Please enter your OTP to verify
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold font-space-grotesk ">
                            OTP
                        </label>
                        <input
                            value={userData.otp}
                            onChange={(e) => setUserData({ ...userData, otp: e.target.value })}
                            type="number"
                            placeholder="Enter OTP"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-space-grotesk"
                        />
                    </div>
                    <button
                        disabled={isOtpVerify}
                        type="submit"
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 font-space-grotesk shadow-md ${isOtpVerify ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isOtpVerify ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Verifying...
                            </span>
                        ) : 'Verify'}
                    </button>
                    <button
                        type="button"
                        className="w-full text-blue-600 hover:underline font-space-grotesk mt-2"
                        onClick={() => handleResendOtp()}
                    >
                        Resend OTP
                    </button>
                </form>
            </div>
        </div>
    );
};