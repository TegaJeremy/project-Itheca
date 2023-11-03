const nodemailer = require ("nodemailer")
// const dotenv = require("dotenv")
// dotenv.config()
require ("dotenv").config()

const sendEmail = async (options) => {
const transporter = nodemailer.createTransport({

    host:"smtp.gmail.com",
   service:"Gmail",
     port:587,
     // port: 2525,
   auth: {
     user: process.env.user,
     pass: process.env.password
   },
   tls:{
       rejectUnauthorized: false,
      },
   });

     // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.user,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
    
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
  main().catch(console.error);
};

module.exports= sendEmail