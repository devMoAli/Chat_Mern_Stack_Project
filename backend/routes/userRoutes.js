const express = require("express");
const {
  registerUserCtl,
  profilePhotoUploadCtrl,
  loginUserCtl,
  searchUsersCtl,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");
const photoUpload = require("../middlewares/photoUpload");
const router = express.Router();

router.route("/").get(protect, searchUsersCtl);
router.route("/register").post(photoUpload.single("image"), registerUserCtl);
router.post("/login", loginUserCtl);
router
  .route("/profile/profile-photo-upload")
  .post(protect, photoUpload.single("image"), profilePhotoUploadCtrl);
  
module.exports = router;
