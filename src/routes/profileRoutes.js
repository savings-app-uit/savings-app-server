const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { getProfile, updateProfile, deleteProfile } = require("../controllers/auth/getProfile");

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);
router.delete("/", verifyToken, deleteProfile);

module.exports = router;
