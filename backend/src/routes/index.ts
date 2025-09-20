import { Router } from "express";
import authRoutes from "./auth";
// import sweetsRoutes from "./sweets"; // milestone 3

const router = Router();

router.use("/auth", authRoutes);
// router.use("/sweets", sweetsRoutes);

export default router;
