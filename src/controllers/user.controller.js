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

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if ([name, email, phone, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ phone }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or phone allready exists.");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar image is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar image is required. || failed to uplaod in cloudinary. ");
  }

  const user = await User.create({
    name,
    profileimage: avatar.url,
    email,
    password,
    phone,
  });

  const createdUser = await User.findById(user._id).select("-password -accesstoken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  if (!phone && !email) {
    throw new ApiError(400, "phone or email is required");
  }

  const user = await User.findOne({
    $or: [{ phone }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentails");
  }

  const { accessToken, accesstoken } = await generateAccessTokenForUser(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -accesstoken");

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
          user: loggedInUser,
          accessToken,
        },
        "User LoggedIn Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
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
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const avatarLocalPath = req.file?.path;

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "avatar image is required. || failed to uplaod in cloudinary. ");
    }
  }
  const update = {};
  if (name) update.name = name;
  if (avatarLocalPath) update.profileimage = avatarLocalPath;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: update,
    },
    {
      new: true,
    }
  ).select("-password -accesstoken");

  return res.status(200).json(new ApiResponse(200, user, "account details updated Successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    throw new ApiError(402, "Password is required for confirmation.");
  }

  await User.findByIdAndDelete(req.user?._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User deleted Successfully"));
});

export { registerUser, loginUser, logoutUser, updateAccountDetails, deleteUser };
