import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminauth.middleware.js";
import {
  deletAllUser,
  deleteSingleUser,
  getAllUser,
  loginAdmin,
  logoutAdmin,
  registerNewAdmin,
  updateUserRole,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/registernewadmin").post(upload.single("adminprofile"), registerNewAdmin);

router.route("/loginadmin").post(loginAdmin);

//ristricted routes for admin only
router.route("/logoutadmin").post(verifyAdminJWT, logoutAdmin);
router.route("/getallusers").get(verifyAdminJWT, getAllUser);

router.route("/updateuserrole/:userid").patch(verifyAdminJWT, updateUserRole);
router.route("/deleteSingleuser/:userid").delete(verifyAdminJWT, deleteSingleUser);

router.route("/deleteallusers").delete(verifyAdminJWT, deletAllUser);

export default router;
