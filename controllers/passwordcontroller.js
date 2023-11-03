const personModel = require('../models/personModel')
const bcrypt = require('bcryptjs')
const sendEmail = require('../middleware/mail')
const jwt = require('jsonwebtoken')
const {forgotPasswordMail} = require('../utils/mailTemplates')


const forgetpassword = async (req,res)=>{
    try {
        const {email}= req.body

        //check if the user is regisered on the application

        const user = await personModel.findOne({email})
        if(!user){
            res.status(401).json({message:'user not found'})
        }

        //generate a token to sign in the user

        const token = jwt.sign({
            user: user._id
        },
        process.env.SECRET_KEY,{expiresIn: "15mins"})
        link = 'https://accountscenter.instagram.com/info_and_permissions/'
        html = forgotPasswordMail(link, user.name)
        const subject = "forgot password";
        const data = {
            email: user.email,
            subject,
            html,
        };
       await sendEmail(data)
       res.status(200).json({message:"Reset password link sent successfully, "})
        
    } catch (error) {
        res.status(500).json(error.message)
    }

}

const resetPassword = async (req,res)=>{
    try {
        const {token} = req.params
        const{password} = req.body

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        const userId = decodedToken.id
        const user = await personModel.findById(userId)

        if(!user){
            return res.status(401).json({message:'user not found'})

        }
        const saltedpassword = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, saltedpassword)
        user.password = hashedpassword
        await user.save()

        res.status(200).json({message:'password changed successfully'})
        
    } catch (error) {
        console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }

}

const changepassword = async(req,res)=>{
try {
    const {token} = req.params
    const {Newpassword, confirmNewPassword, existingpassword } = req.body
    
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
    const userId = decodeToken.id
    const user = await personModel.findOne(userId)

    if(!user){
        return res.status(401).json({message:'user not found'})
    }
    if(Newpassword !== confirmNewPassword){
        return res.status(401).json({message:'new password and confirm new password does not match'})
    }
        const matchedPassword = await bcrypt.compare(password, existingpassword)
           if(!matchedPassword){
            return res.status(401).json({message:'password does not match existing password'})
           }
           const saltedPassword =  bcrypt.genSaltSync(10);
           const hashedPassword = bcrypt.hashSync(password, saltedPassword)
           user.password = hashedPassword

           await user.save()
           res.status(200).json({
            message:'password changed successfully'
           })

    
} catch (error) {
     console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
}
}






module.exports = {
    forgetpassword,
    resetPassword,
    changepassword
}
