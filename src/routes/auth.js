const express = require("express");
const router = express.Router();

const signup = require("../controllers/auth/signup/signup");
const signin = require("../controllers/auth/signin/signin");

const sendCode = require("../controllers/auth/signin/forgotPassword/sendCode");
const verifyCode = require("../controllers/auth/signin/forgotPassword/verifyCode");
const resetPassword = require("../controllers/auth/signin/forgotPassword/resetPassword");
const showDocs = require("../controllers/docs");
const sendSignupCode = require("../controllers/auth/signup/sendSignupCode");
const verifySignupCode = require("../controllers/auth/signup/verifySignupCode");

router.get("/", showDocs); 
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password/send-code", sendCode);
router.post("/forgot-password/verify-code", verifyCode);
router.post("/forgot-password/reset", resetPassword);
router.post("/signup/send-code", sendSignupCode);
router.post("/signup/verify-code", verifySignupCode);


module.exports = router;
