function sendMail(otp){
    return`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
            }
    
            .verification-container {
                margin-top: 20px;
            }
    
            .otp {
                font-weight: bold;
                font-size: 24px;
                color: #007bff; /* Blue color for the OTP */
            }
        </style>
    </head>
    <body>
        <h1>Verification Code</h1>
        <p>Please use the following OTP as your verification code:</p>
        <div class="verification-container">
            <span class="otp">${otp}</span> <!-- Replace with your actual OTP -->
        </div>
    </body>
    </html>
    `
}

function forgotPasswordMail(link, name){
    return`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
            }
    
            .verification-container {
                margin-top: 20px;
            }
    
            .otp {
                font-weight: bold;
                font-size: 24px;
                color: #007bff; /* Blue color for the OTP */
            }
        </style>
    </head>
    <body>
        <h1>Verification Code</h1>
        <p> hello ${name}</p>
        <p>please use the following link ${link} to reset your password</p>
       
    </body>
    </html>
    `
}


module.exports = {
    sendMail,
    forgotPasswordMail
}