import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiUtils.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  //   authorization : Bearer fhkagfjfd2342
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorised request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const admin = await User.findById(decodedToken?._id).select(" -refreshToken");

  if (!admin) {
    throw new ApiError(401, "Invalid Access Token");
  }

  if (admin.role != "admin") {
    throw new ApiError(401, "Unauthorised access not an Admin Account.");
  }
  req.admin = admin;
  next();
});
