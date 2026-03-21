import axios from "axios";
import { create } from "zustand";
import { mainUrl } from "../main";
import toast from "react-hot-toast";

export const serviceStore = create((set) => ({
    reportList: [],
    loading: false,
    error: null,
    EmailData: {},

    //TODO: get report list
    getReportList: async () => {
        set({ loading: true, error: null });

        try {
            const res = await axios.get(
                `${mainUrl}/v1/api/email-report`,
                { withCredentials: true }
            );

            set({
                reportList: res?.data?.data?.emailMessages?.[0]?.recipients || [],
                EmailData: res?.data?.data || {},
                loading: false
            });

            const hasShownToast = sessionStorage.getItem('reportToastShown');

            if (res?.data?.data?.emailMessages?.[0]?.recipients?.length > 0 && !hasShownToast) {
                toast.success(res?.data?.message);
                sessionStorage.setItem('reportToastShown', 'true');
            }

        } catch (err) {
            console.error("Failed to fetch report list:", err?.response?.data?.message);

            set({
                error: err?.response?.data?.message || "Something went wrong",
                loading: false
            });
        }
    },
    //TODO: delete all email data
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
    //TODO: upload email message
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
    //TODO: update app password
    updateAppPassword: async (userData) => {
        try {
            const res = await axios.post(`${mainUrl}/v1/api/email-pass`, userData, {
                withCredentials: true,
            });
            toast.success(res?.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Email Password failed");
        }
    },
    //TODO: update USER PASSWORD
    updateEmailPass: async (userData) => {
        try {
            const res = await axios.put(`${mainUrl}/v1/api/update-email-pass`, userData, {
                withCredentials: true,
            });
            toast.success(res?.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Email Password update failed");
        }
    },
    //TODO: open AI controller, AI Writer
    openAIController: async (data) => {
        set({ loading: true, error: null });

        try {
            const res = await axios.post(
                `${mainUrl}/v1/api/open-ai`,
                data,
                { withCredentials: true }
            );
            set({
                loading: false
            });
            return res;
        } catch (err) {
            console.error("Failed to upload email message:", err?.response?.data?.message);
            toast.error(err?.response?.data?.message);

            set({
                error: err?.response?.data?.message || "Something went wrong",
                loading: false
            });
        }
    }
}));
