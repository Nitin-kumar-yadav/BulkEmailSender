import React, { useEffect } from "react";
import { serviceStore } from "../store/serviceStore";

const Report = () => {
    const { reportList, getReportList, loading, error, EmailData } = serviceStore();

    useEffect(() => {
        getReportList();
    }, [getReportList,]);

    return (
        <div className="flex flex-col justify-center items-center mx-5 w-full overflow-x-auto">
            <h1 className="text-2xl font-bold mb-3">Report</h1>

            {loading && <p>Loading reports...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && reportList?.length === 0 && (
                <p>No reports found</p>
            )}

            {reportList?.length > 0 && (
                <table className="w-[60%] border border-gray-200 mt-2">
                    <thead>
                        <tr>
                            <th className="border p-2">Sl No</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">User Name</th>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Created At</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportList.map((item, index) => (
                            <tr key={item?._id || index}>
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{item?.email}</td>
                                <td className="border p-2">{item?.name}</td>
                                <td className="border p-2">{item?._id}</td>
                                <td className="border p-2">
                                    {EmailData?.createdAt
                                        ? new Date(EmailData.createdAt).toLocaleString()
                                        : "-"}
                                </td>
                                <td className="border p-2" style={{ color: item?.status === "sent" ? "green" : "red" }}>
                                    {item?.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Report;
