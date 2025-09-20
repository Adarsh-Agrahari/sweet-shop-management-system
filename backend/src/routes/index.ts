import { Router } from "express";
import authRoutes from "./auth";
import sweetsRoutes from "./sweets";
import ordersRoutes from "./orders";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sweets", sweetsRoutes);
router.use("/orders", ordersRoutes);

export default router;
