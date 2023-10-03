const express = require("express")
const router = express.Router()
const {signupPerson, verifyOtp, resendVerificationOtp} = require("../controllers/personController")

router.route("/sign-up").post(signupPerson)
router.route("/verify-otp/:token").post(verifyOtp)
router.route("/resend-verification").post(resendVerificationOtp)

module.exports = router