import fs from "fs";
import csv from "csv-parser";

export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                if (row.name && row.email) {
                    results.push({
                        name: row.name.trim(),
                        email: row.email.trim()
                    });
                }
            })
            .on("end", () => resolve(results))
            .on("error", reject);
    });
};
