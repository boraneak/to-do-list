import express from "express";
import { authServices } from "../services/index";
const router = express.Router();

router.post("/register", authServices.register);
router.post("/login", authServices.login);

export default router;
