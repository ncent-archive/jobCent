const nodemailer = require("nodemailer");
const keys = require("./secret");
module.exports = {
  sendMail(from, to, html) {
   
    let smtpTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: keys.user,
        clientId:
          keys.clientId,
        clientSecret: keys.clientSecret,
        refreshToken:
          keys.refreshToken,
        accessToken:
          keys.accessToken
      }
    });
    // Setup mail configuration
    var mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      subject: "Access code", // Subject line
      // text: '', // plaintext body
      html: html // html body
    };
    // send mail
    smtpTransport.sendMail(mailOptions, function(error, info) {
      console.log("sending mail...");

      if (error) {
        console.log(error);
      } else {
        console.log("Message %s sent: %s", info.messageId, info.response);
      }
      smtpTransport.close();
    });
  }
};
