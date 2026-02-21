import React from 'react'
import { LuSend } from "react-icons/lu";
import { serviceStore } from "../store/serviceStore";
import { TbMailSearch } from "react-icons/tb";

const Card = () => {
    const { EmailData, reportList } = serviceStore();
    const today = new Date().toISOString().split("T")[0];
    const todayReportList = Array.isArray(reportList)
        ? reportList.filter((item) => item?.createdAt?.split("T")[0] === today)
        : [];

    return (
        <>
            <div className='flex justify-between items-center p-4 rounded-lg border-secondary/20 shadow-md hover:bg-secondary/20 transition-all dark:bg-[var(--bg-primary)] bg-[var(--bg-quaternary)] w-64 h-36'>
                <div className='flex flex-col gap-2'>
                    <h4 className='text-sm font-semibold font-comfortaa'>Total Sent Today</h4>
                    <h2 className='text-3xl font-bold font-comfortaa'>
                        {todayReportList.length > 0 ? todayReportList.length : "No Data"}
                    </h2>
                    <p className='text-sm text-gray-500 font-comfortaa'>
                        Across {EmailData?.campaigns?.length ?? "No"} Campaigns
                    </p>
                </div>
                <div>
                    <LuSend size={30} />
                </div>
            </div>

            {EmailData && reportList ? (
                <div className='flex justify-between items-center p-4 rounded-lg border-secondary/20 shadow-md hover:bg-secondary/20 transition-all dark:bg-[var(--bg-primary)] bg-[var(--bg-quaternary)] w-64 h-36'>
                    <div className='flex flex-col gap-2'>
                        <h4 className='text-sm font-semibold font-comfortaa'>Email</h4>
                        <h2 className='text-sm font-bold font-comfortaa'>
                            {EmailData?.subject || "No Subject"}
                        </h2>
                        <p className='text-sm text-gray-500 font-comfortaa'>
                            {EmailData?.message ? EmailData.message.slice(0, 20) + "..." : "No Message"}
                        </p>
                    </div>
                    <div>
                        <TbMailSearch size={30} />
                    </div>
                </div>
            ) : (
                <div className='flex justify-center items-center p-4 rounded-lg border-secondary/20 shadow-md dark:bg-[var(--bg-primary)] bg-[var(--bg-quaternary)] w-64 h-36'>
                    <p className='text-sm text-gray-500 font-comfortaa'>No Data</p>
                </div>
            )}
        </>
    );
}

export default Card