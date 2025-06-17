const express = require("express");
const router = express.Router();

const signup = require("../controllers/auth/signup/signup");
const signin = require("../controllers/auth/signin");

const sendSignupCode = require("../controllers/auth/signup/sendCode");
const verifySignupCode = require("../controllers/auth/signup/verifySignupCode");
const sendResetCode = require("../controllers/auth/reset/sendCode");
const verifyResetCode = require("../controllers/auth/reset/verifyCode");

const resetPassword = require("../controllers/auth/reset/resetPassword");
const showDocs = require("../controllers/docs");

router.get("/", showDocs); 
router.post("/signin", signin);
router.post("/signup/send-code", sendSignupCode);
router.post("/signup/verify-code", verifySignupCode);
router.post("/forgot-password/send-code", sendResetCode);
router.post("/forgot-password/verify-code", verifyResetCode);
router.post("/forgot-password/reset", resetPassword);
router.post("/signup", signup);

module.exports = router;