const mongoose = require("mongoose")
const personSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        requird:true
    },
 email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    isVerified:{
        type:Boolean,
       default:false
    },
    otpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'otpverification'
      },
}, {timestamps:true}
)
const personModel = mongoose.model("personmain", personSchema)
module.exports = personModel