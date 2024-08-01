const asyncHandler = require("express-async-handler");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/userModel");
const generateToken = require("../config/generateToken");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
/**-----------------------------------------------
 * @desc    Search users by username or email
 * @route   /api/user?search=
 * @method  GET
 * @access  public 
 ------------------------------------------------*/
 module.exports.searchUsersCtl = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        // Search username 
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword, { password: 0 }).find({
    _id: { $ne: req.user._id },
  });

  if (users.length === 0) {
    return res.status(404).json({ message: "No users matching the search found" });
  }

  res.json(users);
});

/**-----------------------------------------------
 * @desc    Register new user
 * @route   /api/user/register
 * @method  POST
 * @access  public 
 ------------------------------------------------*/
module.exports.registerUserCtl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let profileImage = {
    url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
    publicId: null,
  };

  if (req.file) {
    try {
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
      const result = await cloudinaryUploadImage(imagePath);
      profileImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      fs.unlinkSync(imagePath);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Upload to Cloudinary failed", message: error.message });
      return;
    }
  }

  const user = await User.create({
    username,
    email,
    password,
    profilePic: profileImage,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong! Please try again later");
  }
});

/**-----------------------------------------------
 * @desc    Login the user
 * @route   /api/user/login
 * @method  POST
 * @access  public 
 ------------------------------------------------*/
module.exports.loginUserCtl = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

/**-----------------------------------------------
 * @desc    Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  try {
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    const user = await User.findById(req.user._id);

    if (user.profilePic?.publicId) {
      await cloudinaryRemoveImage(user.profilePic.publicId);
    }

    user.profilePic = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    res.status(200).json({
      message: "Your profile photo uploaded successfully",
      profilePic: { url: result.secure_url, publicId: result.public_id },
    });

    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error("Profile photo upload error:", error);
    res
      .status(500)
      .json({ error: "Upload to Cloudinary failed", message: error.message });
  }
});

