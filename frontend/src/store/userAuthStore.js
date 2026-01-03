import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { mainUrl } from "../main";

// Configure axios defaults so you don't have to repeat withCredentials
axios.defaults.withCredentials = true;

export const useUserAuthStore = create((set) => ({
    authUser: (() => {
        const authUser = localStorage.getItem('authUser');
        try {
            return authUser && authUser !== 'undefined' ? JSON.parse(authUser) : null;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something went wrong");

        }
    })(),

    isCheckingAuth: false,
    isSignup: false,
    isLogin: false,
    isOtpVerify: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.get(`${mainUrl}/v1/api/checkAuth`);
            set({ authUser: res.data?.user });
            localStorage.setItem('authUser', JSON.stringify(res.data?.user));
        } catch (error) {
            set({ authUser: null });
            localStorage.removeItem('authUser');
            throw new Error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (userData) => {
        set({ isSignup: true });
        try {
            const res = await axios.post(`${mainUrl}/v1/api/signup`, userData);
            toast.success("Please verify OTP.");
            set({ isSignup: false });
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Signup failed");
            set({ isSignup: false });
        }
    },

    login: async (userData) => {
        set({ isLogin: true });
        try {
            const res = await axios.post(`${mainUrl}/v1/api/login`, userData);
            set({ authUser: res.data?.user });
            localStorage.setItem('authUser', JSON.stringify(res.data?.user));
            toast.success(`${res.data?.user?.Name}, Welcome back!`);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            set({ isLogin: false });
        }
    },

    otpVerify: async (userData) => {
        set({ isOtpVerify: true });
        try {
            const res = await axios.post(`${mainUrl}/v1/api/otpVerify`, userData);
            set({ authUser: res.data?.user });
            localStorage.setItem('authUser', JSON.stringify(res.data?.user));
            toast.success(`Account verified successfully!`);
        } catch (error) {
            toast.error(error?.response?.data?.message || "OTP Verification failed");
        } finally {
            set({ isOtpVerify: false });
        }
    },

    logout: async () => {
        try {
            await axios.post(`${mainUrl}/v1/api/logout`);
            set({ authUser: null });
            localStorage.removeItem('authUser');
            toast.success("Logged out");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
            set({ authUser: null });
            localStorage.removeItem('authUser');
        } finally {
            set({ isLogout: false });
        }
    },
}));