import express from "express";
import { userServices } from "../services/index";
import { verifyUserToken } from "../../middlewares/verifyUserToken";
const router = express.Router();

router.get("/", verifyUserToken, userServices.getAllUsers);
router.get("/:id", verifyUserToken, userServices.getUserById);
router.post("/create", verifyUserToken, userServices.createUser);
router.put("/update/:id", verifyUserToken, userServices.updateUserById);
router.delete("/delete/:id", verifyUserToken, userServices.deleteUserById);
export default router;
