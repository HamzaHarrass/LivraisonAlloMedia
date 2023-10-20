require('dotenv').config();
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });


  const sendEmail = async function(messageOptions){
    transporter.sendMail(messageOptions, (error, info) => {
        // if (error) {
        //   console.log(error);
        // } else {
        //   console.log('Email sent successfully!');
        // }
      });
}
module.exports = {
    transporter,
    sendEmail
}