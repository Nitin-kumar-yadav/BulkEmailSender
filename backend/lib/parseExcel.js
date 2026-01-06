import xlsx from "xlsx";

export const parseExcel = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    return data
        .filter(row => row.name && row.email)
        .map(row => ({
            name: row.name.trim(),
            email: row.email.trim()
        }));
};
