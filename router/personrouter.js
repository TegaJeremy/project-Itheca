const express = require("express")
const router = express.Router()
const {signupPerson, verifyOtp, resendVerificationOtp, logIn,logout} = require("../controllers/personController")
const {forgetpassword,resetPassword,changepassword} = require('../controllers/passwordcontroller')

router.route("/sign-up").post(signupPerson)
router.route("/verify-otp/:token").post(verifyOtp)
router.route("/resend-verification").post(resendVerificationOtp)
router.route("/log-in").post(logIn)
router.route("/log-out/:userId").post(logout)

//password
router.route('/forget-password').post(forgetpassword)
router.route('/reset-password/:token').post(resetPassword)
router.route('/change-password/:token').post(changepassword)

module.exports = router