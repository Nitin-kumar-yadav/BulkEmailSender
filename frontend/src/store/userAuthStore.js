import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { mainUrl } from "../main";

// Configure axios defaults so you don't have to repeat withCredentials
axios.defaults.withCredentials = true;

export const useUserAuthStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem('authUser')) || null,
    isCheckingAuth: false,
    isSignup: false,
    isLogin: false,
    isOtpVerify: false,
    isUserId: JSON.parse(localStorage.getItem('userId')) || null,
    isResendOtp: false,


    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.get(`${mainUrl}/v1/api/checkAuth`, {
                withCredentials: true,
            });

            const user = res.data;
            set({ authUser: user });

            if (user) {
                localStorage.setItem('authUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('authUser');
            }
        } catch (error) {
            set({ authUser: null });
            localStorage.removeItem('authUser');
            console.error("Auth check failed:", error.response?.data?.message);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (userData) => {
        set({ isSignup: true });
        try {
            const res = await axios.post(`${mainUrl}/v1/api/signup`, userData);
            toast.success(res?.data?.message);
            set({ isSignup: false });
            set({ isUserId: res.data.userId });
            console.log(res)
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Signup failed");
            set({ isSignup: false });
        }
    },

    login: async (userData) => {
        set({ isLogin: true });
        try {
            const res = await axios.post(`${mainUrl}/v1/api/signin`, userData, {
                withCredentials: true,
            });

            const user = res?.data;

            set({ authUser: user });
            localStorage.setItem('authUser', JSON.stringify(user));
            toast.success(`Welcome back, ${user.Name}`);
            return { success: true, data: user };

        } catch (error) {
            const message = error?.response?.data?.message || "Login failed";
            toast.error(message);
            return { success: false, error: message };
        } finally {
            set({ isLogin: false });
        }
    },

    otpVerify: async (userData) => {
        set({ isOtpVerify: true });
        const userId = get().isUserId;
        try {
            const res = await axios.post(`${mainUrl}/v1/api/otp-verification?_id=${userId}`, userData, {
                withCredentials: true,
            });
            set({ authUser: res.data });
            localStorage.setItem('authUser', JSON.stringify(res.data));
            toast.success(`Account verified successfully!`);
        } catch (error) {
            toast.error(error?.response?.data?.message || "OTP Verification failed");
        } finally {
            set({ isOtpVerify: false });
        }
    },

    resendOtp: async (userData) => {
        set({ isResendOtp: true });
        const userId = get().isUserId;
        try {
            const res = await axios.post(`${mainUrl}/v1/api/resend-otp?_id=${userId}`, userData, {
                withCredentials: true,
            });
            toast.success(res?.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Resend OTP failed");
        } finally {
            set({ isResendOtp: false });
        }
    },

    logout: async () => {
        try {
            const res = await axios.get(`${mainUrl}/v1/api/logout`);
            set({ authUser: null });
            localStorage.removeItem('authUser');
            toast.success(res?.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
            set({ authUser: null });
            localStorage.removeItem('authUser');
        } finally {
            set({ isLogout: false });
        }
    },
}));