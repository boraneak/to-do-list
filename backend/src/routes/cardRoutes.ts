import express from "express";
import { cardServices } from "../services/index";
import { verifyUserToken } from "../../middlewares/verifyUserToken";
const router = express.Router();

router.get("/", verifyUserToken, cardServices.getAllCards);
router.get("/:id", verifyUserToken, cardServices.getCardById);
router.post("/create", verifyUserToken, cardServices.createCard);
router.put("/update/:id", verifyUserToken, cardServices.updateCardById);
router.delete("/delete/:id", verifyUserToken, cardServices.deleteCardById);
export default router;
