import express from "express";
import { listServices } from "../services/index";
import { verifyUserToken } from "../../middlewares/verifyUserToken";
const router = express.Router();

router.get("/", verifyUserToken, listServices.getAllLists);
router.get("/:id", verifyUserToken, listServices.getListById);
router.post("/create", verifyUserToken, listServices.creatList);
router.put("/update/:id", verifyUserToken, listServices.updateListById);
router.delete("/delete/:id", verifyUserToken, listServices.deleteListById);
export default router;
