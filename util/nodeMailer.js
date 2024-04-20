const nodemailer = require("nodemailer");
require('dotenv').config();

function sendMail(fromEmail, toEmail, subject, text) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
      user: 'deveshpathak67@gmail.com',
      pass: 'xecc zivi btvh fajm'
    }
  });

  let mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
module.exports = { sendMail };