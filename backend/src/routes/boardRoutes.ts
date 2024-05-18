import express from "express";
import { boardServices } from "../services/index";
import { verifyUserToken } from "../../middlewares/verifyUserToken";
const router = express.Router();

router.get("/", verifyUserToken, boardServices.getAllBoards);
router.get("/:id", verifyUserToken, boardServices.getBoardById);
router.post("/create", verifyUserToken, boardServices.createBoard);
router.put("/update/:id", verifyUserToken, boardServices.updateBoardById);
router.delete("/delete/:id", verifyUserToken, boardServices.deleteBoardById);
export default router;
