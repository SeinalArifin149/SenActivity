import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import transactionRoutes from "./routes/transactionRoutes.js";
import { dashboardCharts, dashboardSummary } from "./controllers/transactionController.js";
import { reportCategories, reportMonthly, reportSummary } from "./controllers/reportController.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true }));
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/transactions", transactionRoutes);
app.get("/api/dashboard/summary", dashboardSummary);
app.get("/api/dashboard/charts", dashboardCharts);
app.get("/api/reports/summary", reportSummary);
app.get("/api/reports/categories", reportCategories);
app.get("/api/reports/monthly", reportMonthly);
app.use(errorHandler);

if (process.env.VERCEL !== "1") {
  app.listen(process.env.PORT || 4000, () => console.log(`SenActivity API berjalan di port ${process.env.PORT || 4000}`));
}

export default app;
