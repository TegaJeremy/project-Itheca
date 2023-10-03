const userOtpVerification = require("../models/otpverifycationModel")
const sendEmail = require("../middleware/mail")
const bcrypt = require('bcryptjs')


const sendOtpVerificationEmail = async ({_id ,email},res)=>{
    try {
        const otp =Maths.floor(Maths.random() * 9000)
        const subject = "New userModel";
        const message = `welcome onboard kindly use this ${otp} to verify your account`;
        const data = {
          email,
         subject,
          message:message
        };
       
        const salt = bcrypt.genSaltSync(10)
        const hashedOtp = bcrypt.hashSync(otp, salt)
        const newOtpVerification = await new userOtpVerification({
            userId:_id,
            otp:hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now * 3600000,
        })
        await newOtpVerification.save()
        sendEmail(data)
        
    } catch (error) {
        res.status(500).json(error.message)
    }
} 

module.exports = sendOtpVerificationEmail