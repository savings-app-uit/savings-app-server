const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { getProfile, updateProfile, deleteProfile, changePassword } = require("../controllers/profileController");

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);
router.delete("/", verifyToken, deleteProfile);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;
