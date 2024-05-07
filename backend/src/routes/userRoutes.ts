import express from "express";
import { userServices } from "../services/index";
const router = express.Router();

router.get("/", userServices.getAllUsers);
router.post("/register", userServices.register);
router.post("/login", userServices.login)
router.post("/create", userServices.createUser);
router.put("/update/:id", userServices.updateUserById);
router.delete("/delete/:id", userServices.deleteUserById);
export default router;
