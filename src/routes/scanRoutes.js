const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scanController");
const multer = require("multer");
const verifyToken = require("../middlewares/verifyToken");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("", verifyToken, upload.single("image"), scanController.scanImage); 

module.exports = router;