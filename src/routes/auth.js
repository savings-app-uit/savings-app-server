const express = require("express");
const router = express.Router();

const signup = require("../controllers/auth/signup");
const signin = require("../controllers/auth/signin");

const sendCode = require("../controllers/auth/forgotPassword/sendCode");
const verifyCode = require("../controllers/auth/forgotPassword/verifyCode");
const resetPassword = require("../controllers/auth/forgotPassword/resetPassword");
const showDocs = require("../controllers/docs");

router.get("/", showDocs); 
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password/send-code", sendCode);
router.post("/forgot-password/verify-code", verifyCode);
router.post("/forgot-password/reset", resetPassword);


module.exports = router;
