const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { getProfile, deleteProfile, changePassword, updateProfileWithAvatar } = require("../controllers/profileController");
const upload = require("../middlewares/upload");

router.get("/", verifyToken, getProfile);
router.delete("/", verifyToken, deleteProfile);
router.post("/change-password", verifyToken, changePassword);
router.post("/update", verifyToken, upload.single("avatar"), updateProfileWithAvatar);

module.exports = router;
