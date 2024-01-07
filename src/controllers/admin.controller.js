import { ApiError, ApiResponse } from "../utils/ApiUtils.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const generateAccessTokenForUser = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  user.accesstoken = accessToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken };
};

const registerNewAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if ([name, email, phone, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar image is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar image is required. || failed to uplaod in cloudinary. ");
  }

  const existedAdmin = await User.findOne({
    $or: [{ phone }, { email }],
  });

  if (existedAdmin) {
    throw new ApiError(409, "Admin with email or phone allready exists.");
  }

  const admin = await User.create({
    name,
    profileimage: avatar.url,
    email,
    password,
    phone,
    role: "admin",
  });

  const createdAdmin = await User.findById(admin._id).select("-password -accesstoken");

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the Admin.");
  }

  return res.status(201).json(new ApiResponse(200, createdAdmin, "Admin registered Successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  if (!phone && !email) {
    throw new ApiError(400, "phone or email is required");
  }

  const user = await User.findOne({
    $or: [{ phone }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "Admin does not exists");
  }
  if (user.role != "admin") {
    throw new ApiError(404, "unauthorised access not an admin account.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid admin credentails");
  }

  const { accessToken } = await generateAccessTokenForUser(user._id);
  const loggedinAdmin = await User.findById(user._id).select("-password -accesstoken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: loggedinAdmin,
          accessToken,
        },
        "Admin LoggedIn Successfully"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        accesstoken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "Admin Logged Out"));
});

const getAllUser = asyncHandler(async (req, res) => {
  const alluser = await User.find({}).select("-password -accesstoken");
  if (!alluser) {
    throw new ApiError(404, "Failed to get all users.");
  }

  return res.status(200).json(new ApiResponse(200, alluser, "Successfully retrived all users."));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const id = req.params.userid;
  if (!id) {
    throw new ApiError(401, "Userid Required for updating.");
  }
  const user = await User.findById(id).select("-password -accesstoken");
  if (!user) {
    throw new ApiError(404, "No Such User exits.");
  }

  user.role = user.role === "admin" ? "user" : "admin";
  const updatetuser = await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, updatetuser, "Successfully updated user role."));
});

const deleteSingleUser = asyncHandler(async (req, res) => {
  const id = req.params.userid;
  if (!id) {
    throw new ApiError(401, "Userid Required for deleting.");
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "No Such User exits.");
  }
  return res.status(200).json(new ApiResponse(200, {}, "Successfully deleted user role."));
});

const deletAllUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    throw new ApiError(401, "Admin Password is required for deleting all users.");
  }

  const admin = req.admin;
  //   console.log(admin);
  const isPasswordCorrect = await admin.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password incorrect re-enter correct password");
  }

  await User.deleteMany({
    role: "user",
  });
  return res.status(200).json(new ApiResponse(200, {}, "Successfully deleted all Users."));
});

export {
  registerNewAdmin,
  loginAdmin,
  logoutAdmin,
  getAllUser,
  updateUserRole,
  deleteSingleUser,
  deletAllUser,
};
