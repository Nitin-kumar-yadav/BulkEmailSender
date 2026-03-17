import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { mainUrl } from "../main";

axios.defaults.withCredentials = true;

export const useUserAuthStore = create((set, get) => ({
    // ─── CRITICAL FIX ────────────────────────────────────────────────────
    // Never seed authUser from localStorage.
    // localStorage can be stale after logout + back button.
    // The ONLY source of truth is the server (checkAuth).
    // ─────────────────────────────────────────────────────────────────────
    authUser: null,
    isCheckingAuth: true,   // start TRUE so app waits for server before rendering
    isSignup: false,
    isLogin: false,
    isOtpVerify: false,
    isUserId: localStorage.getItem("userId") || null,
    isResendOtp: false,

    /* ── checkAuth ──────────────────────────────────────────────────────── */
    // Called ONCE on app mount. Until it resolves, isCheckingAuth = true
    // so ProtectedRoute renders nothing (no flash of protected content).
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.get(`${mainUrl}/v1/api/checkAuth`, {
                withCredentials: true,
            });
            set({ authUser: res.data });
        } catch {
            // Cookie missing or expired → not logged in
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    /* ── signup ─────────────────────────────────────────────────────────── */
    signup: async (userData) => {
        set({ isSignup: true });
        try {
            const signupPromise = axios.post(`${mainUrl}/v1/api/signup`, userData);
            const res = await toast.promise(signupPromise, {
                loading: "Signing up...",
                success: (resData) => resData?.data?.message || "Signup successful",
                error: (err) => err?.response?.data?.message || "Signup failed",
            });
            set({ isUserId: res.data.userId });
            localStorage.setItem("userId", res.data.userId);
            return res.data;
        } catch (error) {
            console.error(error);
        } finally {
            set({ isSignup: false });
        }
    },

    /* ── login ──────────────────────────────────────────────────────────── */
    login: async (userData) => {
        set({ isLogin: true });
        try {
            const loginPromise = axios.post(`${mainUrl}/v1/api/signin`, userData, {
                withCredentials: true,
            });
            const res = await toast.promise(loginPromise, {
                loading: "Logging in...",
                success: (resData) => resData?.data?.message || "Login successful",
                error: (err) => err?.response?.data?.message || "Login failed",
            });
            const user = res?.data;
            // Only store in Zustand — NOT localStorage
            // The httpOnly cookie is the real session token
            set({ authUser: user });
            return { success: true, data: user };
        } catch (error) {
            const message = error?.response?.data?.message || "Login failed";
            return { success: false, error: message };
        } finally {
            set({ isLogin: false });
        }
    },

    /* ── otpVerify ──────────────────────────────────────────────────────── */
    otpVerify: async (userData) => {
        set({ isOtpVerify: true });
        const userId = get().isUserId;
        try {
            const otpPromise = axios.post(
                `${mainUrl}/v1/api/otp-verification?_id=${userId}`,
                userData,
                { withCredentials: true }
            );
            const res = await toast.promise(otpPromise, {
                loading: "Verifying OTP...",
                success: (resData) => resData?.data?.message || "OTP Verification successful",
                error: (err) => err?.response?.data?.message || "OTP Verification failed",
            });
            set({ authUser: res.data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isOtpVerify: false });
        }
    },

    /* ── resendOtp ──────────────────────────────────────────────────────── */
    resendOtp: async (userData) => {
        set({ isResendOtp: true });
        const userId = get().isUserId;
        try {
            const resendPromise = axios.post(
                `${mainUrl}/v1/api/resend-otp?_id=${userId}`,
                userData,
                { withCredentials: true }
            );
            await toast.promise(resendPromise, {
                loading: "Resending OTP...",
                success: (resData) => resData?.data?.message || "OTP Resent",
                error: (err) => err?.response?.data?.message || "Resend OTP failed",
            });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isResendOtp: false });
        }
    },

    /* ── logout ─────────────────────────────────────────────────────────── */
    logout: async () => {
        try {
            const logoutPromise = axios.get(`${mainUrl}/v1/api/logout`, {
                withCredentials: true,
            });
            await toast.promise(logoutPromise, {
                loading: "Logging out...",
                success: (resData) => resData?.data?.message || "Logged out successfully",
                error: (err) => err?.response?.data?.message || "Logout failed",
            });
            localStorage.removeItem("authUser");
            localStorage.removeItem("userId");
        } catch (error) {
            console.error(error);
        } finally {
            // 1. Clear Zustand
            set({ authUser: null, isUserId: null });

            // 2. Clear all localStorage + sessionStorage
            localStorage.clear();
            sessionStorage.clear();

            // 3. Expire every client-readable cookie
            document.cookie.split(";").forEach((c) => {
                const key = c.split("=")[0].trim();
                ["/", "/api", "/v1", "/v1/api"].forEach((path) => {
                    document.cookie =
                        `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
                });
            });

            // 4. Hard navigation — destroys JS heap + React tree.
            //    Back button cannot restore the cached authenticated page.
            window.location.replace("/login");
        }
    },
    updateUserPassword: async (userData) => {
        try {
            const updatePassPromise = axios.put(`${mainUrl}/v1/api/updatePassword`, userData, {
                withCredentials: true,
            });
            await toast.promise(updatePassPromise, {
                loading: "Updating password...",
                success: (resData) => resData?.data?.message || "Password updated successfully",
                error: (err) => err?.response?.data?.message || "Password update failed",
            });
        } catch (error) {
            console.error(error);
        }
    }
}));