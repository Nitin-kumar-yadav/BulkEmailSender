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
            // console.log(res?.data?.data?.[0]?.recipients);
            set({
                reportList: res?.data?.data?.[0]?.recipients,
                loading: false
            });
            set({
                EmailData: res?.data?.data?.[0],
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
    }
}));
