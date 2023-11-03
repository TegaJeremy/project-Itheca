const personModel = require("../models/personModel");
const sendEmail = require("../middleware/mail");
const bcrypt = require('bcryptjs');
const otpgenerator = require("otp-generator");
const otpModel = require("../models/otpverifycationModel");
const {sendMail} = require("../utils/mailTemplates")
const jwt = require ("jsonwebtoken")

const signupPerson = async (req, res) => {
    try {
        const { name, address, phoneNumber, email, password } = req.body;

      //  Check if the email is already registered
        const isEmail = await personModel.findOne({ email });

        if (isEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Generate a random OTP
        const OTP = otpgenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            alphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }).replace(/\D/g, ''); // Remove non-digit characters from the generated OTP
        
        console.log(OTP);

        console.log("Generated OTP:", OTP);

        // Hash the OTP and save it to the database
        const hashedOTP = await hashOTP(OTP);
        
        const userotp = new otpModel({
            otp: hashedOTP,
        });

        const savedOtp = await userotp.save();

        // Hash the password before saving it
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            address,
            phoneNumber,
            email,
            password: hashedPassword,
            otpId: savedOtp._id // Associate the OTP document with the user
        };

        // Create a new user
        const newuser = await personModel.create(user);

        const token = jwt.sign({ email: newuser.email, userId: newuser._id }, process.env.SECRET_KEY, { expiresIn: "333mins" });

        // Prepare and send a verification email
        const subject = "New User Registration";
        //const message = `Welcome onboard! Kindly use this OTP to verify your account: ${OTP}`;
        html = sendMail(OTP);
        const data = {
            email: user.email,
            subject,
            html,
        };

        await sendEmail(data);

        // Respond with success
        res.status(200).json({ message: 'Signed up successfully', data: newuser, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Function to hash the OTP
const hashOTP = async (otp) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedOTP = bcrypt.hashSync(otp, salt);
    return hashedOTP;
};

const verifyOtp = async (req, res) => {
    try {
        const { token } = req.params;
        const { otp } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token not found' });
        }
        if (!otp) {
            return res.status(400).json({ message: 'OTP input cannot be empty' });
        }

        const { email } = jwt.verify(token, process.env.SECRET_KEY);
        const user = await personModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email not assigned' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const latestOtp = await otpModel.findOne({ _id: user.otpId });

        if (!latestOtp) {
            return res.status(404).json({ message: 'OTP not found' });
        }
        
        const isOtpValid = await bcrypt.compare(otp, latestOtp.otp);

        if (!isOtpValid) {
            return res.status(400).json({ message: 'OTP not valid' });
        } else {
            user.isVerified = true;
            await user.save();

            await otpModel.deleteOne({ _id: latestOtp._id }); // Delete the used OTP

            res.status(200).json({ message: 'User verified successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const resendVerificationOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user with the provided email exists
        const user = await personModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        // Generate a new OTP
        const OTP = otpgenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            alphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }).replace(/\D/g, ''); // Remove non-digit characters from the generated OTP

        // Hash the OTP and save it to the database
        const hashedOTP = await hashOTP(OTP);

        // Update the user's OTP with the new one
       user.otpId.otp = hashedOTP;
       await user.save()
       const token = jwt.sign({email:user.email, userId:user._id}, process.env.SECRET_KEY, {expiresIn:"333mins"})
        

        // Prepare and send the new verification email
        const subject = "Resend Verification OTP";
        const html = sendMail(OTP);
        const data = {
            email: user.email,
            subject,
            html,
        };

        await sendEmail(data);

        res.status(200).json({ message: 'Verification OTP resent successfully',token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logIn = async(req, res)=>{
    try {
        const {emailOrPhoneNumber, password}= req.body
        const user = await personModel.findOne({$or:[{email:emailOrPhoneNumber},{phoneNumber:emailOrPhoneNumber}]})
        if(!user){
           return  res.status(401).json({message:'user not found'})
        }
        const matchedpassword = await bcrypt.compare(password, user.password)
        if(!matchedpassword){
           return res.status(401).json({message:'Incorrect password'})
        }
        if(!user.isVerified){
            return res.status(401).json({message:'user is not verified'})
        }

        const token =  jwt.sign({
            email:user.email,
            id: user._id,
            phoneNumber:user.phoneNumber
        
        },
        process.env.SECRET_KEY, {expiresIn:"1d"}       
        )
        user.isLoggedIn = true
         return res.status(200).json({message:'login successfully', 
    data: token , 
    userid:user._id
})


    } catch (error) {
        res.status(500).json(error.message)
    }

}

const logout = async(req,res)=>{
    try {
        const {userId } = req.params
        const user = await personModel.findOne({_id: userId})

        //update user model to logout

        const logOutUser = await personModel.findByIdAndUpdate(userId,
            {isLoggedIn:false, token:null},
            {new:true}
            )
            if (!logOutUser){
                return res.status(404).json({message:'user not found'})
            }
            res.status(200).json({message:'user logged out successfully'})
    } catch (error) {
        res.status(500).json(error.message)
        
    }
}







module.exports = {
    signupPerson,
    verifyOtp,
    resendVerificationOtp,
    logIn,
    logout
};


