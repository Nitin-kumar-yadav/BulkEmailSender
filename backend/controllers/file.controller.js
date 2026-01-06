import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import EmailInfo from "../model/emailInfoModel.js";
import { parseCSV } from "../lib/parseCSV.js";
import { parseExcel } from "../lib/parseExcel.js";

export const extractFileData = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userId = new mongoose.Types.ObjectId(_id);


        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }


        let emailInfo = await EmailInfo.findOne({ userId });
        if (!emailInfo) {
            emailInfo = await EmailInfo.create({ userId, emailStore: [] });
        }

        const filePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();


        let rows = [];
        if (ext === ".csv") {
            rows = await parseCSV(filePath);
        } else if (ext === ".xls" || ext === ".xlsx") {
            rows = await parseExcel(filePath);
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "Unsupported file type" });
        }


        const emails = rows
            .map(row => {
                const normalized = {};
                Object.keys(row).forEach(key => {
                    normalized[key.toLowerCase().trim()] = row[key];
                });
                return {
                    name: normalized.name?.trim(),
                    email: normalized.email?.trim()
                };
            })
            .filter(e => e.name && e.email);

        if (!emails.length) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "No valid records found" });
        }


        const existingEmails = new Set(emailInfo.emailStore.map(e => e.email));
        const uniqueEmails = emails.filter(e => !existingEmails.has(e.email));

        if (!uniqueEmails.length) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "All emails already exist" });
        }


        emailInfo.emailStore.push(...uniqueEmails);
        await emailInfo.save();


        fs.unlinkSync(filePath);


        return res.status(200).json({
            message: "Data extracted successfully",
            totalRecords: uniqueEmails.length,
            fields: Object.keys(rows[0])
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
