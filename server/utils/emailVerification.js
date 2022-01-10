const nodeMailer = require("nodemailer");
require("dotenv").config();
exports.sendEmailMessage = async (message) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  // send mail with defined transport object
  console.log(message);
  let info = await transporter.sendMail({
    from: `"Mohamed Salah 👻" <${process.env.EMAIL_ADDRESS}>`, // sender address
    to: `${message.userEmail}`, // list of receivers
    subject: `"${message.subject}"`, // Subject line
    text: `"${message.text}"`, // plain text body
    html: `<a href="http://localhost:3300/users/resetpassword/${message.userID}">Click here</a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
