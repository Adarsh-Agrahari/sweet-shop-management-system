import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	})
);
app.use(express.json());

app.use("/api/v1", routes);

app.get("/", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
