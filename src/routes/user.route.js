import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("profileimage"), registerUser);
router.route("/login").post(loginUser);

//ristricted routes
router
  .route("/updateuserdetails")
  .post(verifyJWT, upload.single("profileimage"), updateAccountDetails);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/deleteuser").delete(verifyJWT, deleteUser);

export default router;
