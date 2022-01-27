const ejs = require("ejs");
const nodeMailer = require("nodemailer");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
/**
 *
 * @param {*} message {userEmail,subject,text,type,templateParams}
 * @description send email message to user email by given message object
 */
exports.sendEmailMessage = async (message) => {
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
  const messageUrl =
    process.env.ENVIRONMENT === "development"
      ? `http://localhost:${process.env.PORT}/users/${message.url}/${message.userID}`
      : "";
  const templatePath = path.join(
    __dirname,
    `../templates/${
      message.type === "accountVerification"
        ? "verifyAccount.ejs"
        : "resetPassword.ejs"
    }`
  );
  const source = fs.readFileSync(templatePath, 'utf-8').toString();
  const htmlTemplate = ejs.render(source, {
    userName: message.userName,
    url: messageUrl,
  });
  let info = await transporter.sendMail({
    from: `"Mohamed Salah 👽" <${process.env.EMAIL_ADDRESS}>`, // sender address
    to: `${message.userEmail}`, // list of receivers
    subject: `"${message.subject}"`, // Subject line
    text: `"${message.text}"`, // plain text body
    html: htmlTemplate, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
};
