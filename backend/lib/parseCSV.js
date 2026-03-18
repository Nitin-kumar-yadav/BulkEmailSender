import fs from "fs";
import csv from "csv-parser";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File not found: ${filePath}`));
        }

        const results = [];
        const skipped = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("headers", (headers) => {
                // If the very first row contains an email, it's likely a data row (missing headers)
                const headerValues = headers.map(h => h.trim());
                const emailHeader = headerValues.find(h => EMAIL_REGEX.test(h));
                
                if (emailHeader) {
                    const nameHeader = headerValues.find(h => h && h !== emailHeader);
                    if (nameHeader) {
                        results.push({ name: nameHeader, email: emailHeader });
                    }
                }
            })
            .on("data", (row) => {
                const keys = Object.keys(row);
                // Look for common header variations
                const nameKey = keys.find(k => /^(name|username|user|full\s*name|first\s*name)$/i.test(k.trim()));
                const emailKey = keys.find(k => /^(email|mail|email\s*address)$/i.test(k.trim()));

                let name = "";
                let email = "";

                if (nameKey && emailKey) {
                    name = row[nameKey]?.trim() || "";
                    email = row[emailKey]?.trim() || "";
                } else {
                    // Fallback to checking values if headers don't match exactly
                    const values = Object.values(row).map(v => typeof v === 'string' ? v.trim() : "");
                    email = values.find(v => EMAIL_REGEX.test(v)) || "";
                    name = values.find(v => v && !EMAIL_REGEX.test(v)) || "";
                }

                if (name && email && EMAIL_REGEX.test(email)) {
                    results.push({ name, email });
                } else {
                    skipped.push(row); // Track invalid rows
                }
            })
            .on("end", () => {
                if (skipped.length > 0) {
                    console.warn(`parseCSV: skipped ${skipped.length} invalid row(s) in "${filePath}"`);
                }
                resolve(results);
            })
            .on("error", (err) => {
                reject(new Error(`Failed to parse CSV at "${filePath}": ${err.message}`));
            });
    });
};