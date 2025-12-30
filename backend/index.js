import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection/db.js";

dotenv.config({});

const PORT = process.env.PORT || 8000

const app = express();

app.get('/v1/api/test', (req, res) => {
    res.json({
        message: "Api is working"
    })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
    connectDB()
})