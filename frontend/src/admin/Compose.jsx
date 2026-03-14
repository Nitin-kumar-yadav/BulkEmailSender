import React from "react";
import { FaUsers } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import { serviceStore } from "../store/serviceStore";

const Compose = () => {
  const { uploadFile, uploadEmailMessage } = serviceStore();
  const [formData, setFormData] = React.useState({
    subject: "",
    message: "",
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileData = new FormData(); // ✅ Renamed to avoid shadowing state
      fileData.append("file", file);
      uploadFile(fileData);
    }
  };

  const handleEmailMessageUpload = (e) => {
    e.preventDefault();
    uploadEmailMessage(formData);
  };

  // ✅ Combined handler — calls both functions on button click
  const handleUpload = (e) => {
    handleEmailMessageUpload(e);
    uploadEmailMessage(formData);
  };

  return (
    <div className="flex flex-col absolute w-[80%] mx-5 my-2 left-[17%] overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-3 font-comfortaa">Compose Email</h1>

      <div className="flex flex-col w-full">
        <div className="flex justify-evenly gap-5 items-stretch">

          {/* Recipients */}
          <div className="flex flex-col gap-3 border w-1/2 rounded-2xl p-5">
            <div className="flex gap-2 items-center">
              <FaUsers size={20} />
              <h2 className="font-comfortaa text-xl">Recipients</h2>
            </div>

            <p className="text-sm text-gray-500 font-comfortaa">
              Upload Excel/CSV file with contacts
            </p>

            {/* Upload Box */}
            <label className="border-2 border-dashed rounded-lg h-60 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition">
              <IoCloudUploadOutline size={70} className="text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">Click to upload file</span>

              {/* ✅ onChange now wired to handleFileUpload */}
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Subject + Message */}
          <div className="flex flex-col gap-4 border w-1/2 rounded-2xl p-5">
            <div>
              <label className="font-comfortaa">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="border rounded-lg p-2 outline-none w-full focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="font-comfortaa">Message</label>
              <textarea
                rows="10"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border rounded-lg p-2 outline-none w-full resize-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-5">
          {/* ✅ onClick now calls the combined handler */}
          <button
            onClick={handleUpload}
            className="bg-[var(--bg-tertiary)] text-white px-4 py-3 rounded-full font-medium font-space-grotesk hover:bg-[var(--bg-secondary)] transition w-[200px] h-[50px]"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compose;