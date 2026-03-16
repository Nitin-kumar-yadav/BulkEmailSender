import axios from "axios";
import { create } from "zustand";
import { mainUrl } from "../main";
import toast from "react-hot-toast";

export const serviceStore = create((set) => ({
    reportList: [],
    loading: false,
    error: null,
    EmailData: {},

    getReportList: async () => {
        set({ loading: true, error: null });

        try {
            const res = await axios.get(
                `${mainUrl}/v1/api/email-report`,
                { withCredentials: true }
            );
            // console.log(res?.data?.data?.emailMessages[0].recipients)
            set({
                reportList: res?.data?.data?.emailMessages[0].recipients || [],
                loading: false
            });
            set({
                EmailData: res?.data?.data || {},
                loading: false
            });
            toast.success(res?.data?.message);
        } catch (err) {
            console.error("Failed to fetch report list:", err?.response?.data?.message);

            set({
                error: err?.response?.data?.message || "Something went wrong",
                loading: false
            });
        }
    },
    deleteAllEmailData: async () => {
        set({ loading: true, error: null });

        try {
            const res = await axios.delete(
                `${mainUrl}/v1/api/delete-all-email`,
                { withCredentials: true }
            );
            set({
                loading: false
            });
            toast.success(res?.data?.message);
        } catch (err) {
            console.error("Failed to delete all email data:", err?.response?.data?.message);

            set({
                error: err?.response?.data?.message || "Something went wrong",
                loading: false
            });
        }
    },
    uploadEmailMessage: async (data) => {
        set({ loading: true, error: null });

        try {
            const res = await axios.post(
                `${mainUrl}/v1/api/composed`,
                data,
                { withCredentials: true }
            );
            set({
                loading: false
            });
            toast.success(res?.data?.message);
        } catch (err) {
            console.error("Failed to upload email message:", err?.response?.data?.message);
            toast.error(err?.response?.data?.message);

            set({
                error: err?.response?.data?.message || "Something went wrong",
                loading: false
            });
        }
    },

    uploadFile: async (data) => {
        set({ loading: true, error: null });

        try {
            const res = await axios.post(
                `${mainUrl}/v1/api/upload-file`,
                data,
                { withCredentials: true }
            );
            set({
                loading: false
            });
            toast.success(res?.data?.message);
        } catch (err) {
            console.error("Failed to upload file:", err?.response?.data?.message);
            toast.error(err?.response?.data?.message);

            set({
                error: err?.response?.data?.message || "Something went wrong",
                loading: false
            });
        }
    },
    updateAppPassword: async (userData) => {
        try {
            const res = await axios.post(`${mainUrl}/v1/api/email-pass`, userData, {
                withCredentials: true,
            });
            toast.success(res?.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Email Password failed");
        }
    }
}));
