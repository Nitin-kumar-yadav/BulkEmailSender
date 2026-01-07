import EmailInfo from "../model/emailInfoModel.js";
import path from "path";
import { parseCSV } from "../lib/parseCSV.js";
import { parseExcel } from "../lib/parseExcel.js";
import fs from "fs";

export const extractFileData = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const emailInfo = await EmailInfo.findOne({ userId });
        if (!emailInfo) {
            return res.status(400).json({
                message: "Email info not initialized. Save app password first."
            });
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

        const contacts = rows
            .map(row => {
                const normalized = {};
                Object.keys(row).forEach(k => {
                    normalized[k.toLowerCase().trim()] = row[k];
                });
                return {
                    name: normalized.name?.trim(),
                    email: normalized.email?.trim()
                };
            })
            .filter(c => c.name && c.email);

        if (!contacts.length) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "No valid records found" });
        }

        const existingEmails = new Set(
            (emailInfo.contacts || []).map(c => c.email)
        );

        const uniqueContacts = contacts.filter(
            c => !existingEmails.has(c.email)
        );

        if (!uniqueContacts.length) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                message: "All contacts already exist"
            });
        }

        emailInfo.contacts.push(...uniqueContacts);
        await emailInfo.save();

        fs.unlinkSync(filePath);

        return res.status(200).json({
            message: "Contacts imported successfully",
            added: uniqueContacts.length,
            totalContacts: emailInfo.contacts.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
