import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";

//App Config
const PORT = process.env.PORT || 4000;

const app = express();
await connectDB();

//Initialize the middleware

app.use(express.json());
app.use(cors());

//API Routes

app.get("/", (req, res) => res.send("API working"));

app.listen(PORT, () => console.log("Server Running on PORT " + PORT));
