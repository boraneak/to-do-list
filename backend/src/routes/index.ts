import express from "express";
import userRoutes from "./userRoutes";
import boardRoutes from "./boardRoutes";
import cardRoutes from "./cardRoutes";
import listRoutes from "./listRoutes";
// import activityRoutes from "./activityRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/boards", boardRoutes);
router.use("/cards", cardRoutes);
router.use("/lists", listRoutes);
// router.use("./activities", activityRoutes)

export default router;
