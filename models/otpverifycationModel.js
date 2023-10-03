const mongoose = require("mongoose")
const { stringify } = require("nodemon/lib/utils")

const userOtpVerificationSchema = new mongoose.Schema({
    // userId:String,
    // otp:String,
    // createtAt: Date,
    // expiresAt: Date

    otp :{
        type:String,
        required:true,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'personmain',
      },
    //after 5 minutes this will bw deleted authomatically from the database
   createdAt:{type:Date, default:Date.now, index:{expires:"300s"}}
},{timestamps:true}
)
const userOtpVerification = mongoose.model("otpverification", userOtpVerificationSchema)
module.exports= userOtpVerification