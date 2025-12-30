import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
dotenv.config({});

const PORT = process.env.PORT || 8000

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/v1/api/test', (req, res) => {
    res.json({
        message: "Api is working"
    })
})

app.use('/v1/api/', userRoute)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
    connectDB()
})