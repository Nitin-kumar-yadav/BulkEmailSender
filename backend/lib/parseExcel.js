import xlsx from "xlsx";

export const parseExcel = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    return data
        .reduce((acc, row) => {
            const keys = Object.keys(row);
            const nameKey = keys.find(k => /^(name|username|user|full\s*name|first\s*name)$/i.test(k.trim()));
            const emailKey = keys.find(k => /^(email|mail|email\s*address)$/i.test(k.trim()));

            let name = "";
            let email = "";

            if (nameKey && emailKey) {
                name = String(row[nameKey] || "").trim();
                email = String(row[emailKey] || "").trim();
            } else {
                const values = Object.values(row).map(v => String(v || "").trim());
                email = values.find(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || "";
                name = values.find(v => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || "";
            }

            if (name && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                acc.push({ name, email });
            }
            return acc;
        }, []);
};
