import { Router } from "express";
import {
  aggregationController,
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
} from "../../../controllers";
import guard from "../../../midllewares/guard";
import { upload } from "../../../midllewares/upload";
import roleAccess from "../../../midllewares/roleAccess";
import { Role } from "../../../lib/constants";

const router = new Router();

router.get("/stats/:id", guard, roleAccess(Role.ADMIN), aggregationController);
router.patch("/avatar", guard, upload.single("avatar"), uploadAvatar);
router.get("/verify/:token", verifyUser);
router.post("/verify", repeatEmailForVerifyUser);

export default router;
