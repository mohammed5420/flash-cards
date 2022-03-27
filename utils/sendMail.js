const ejs = require("ejs");
const nodeMailer = require("nodemailer");
const path = require("path");
require("dotenv").config();
const AppError = require("./errorsHandler");
const fs = require("fs");
/**
 *
 * @param {*} message {userEmail,subject,text,type,templateParams}
 * @description send email message to user email by given message object
 */
exports.sendEmailMessage = async (message) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodeMailer.createTransport({
    service: "SendGrid",
    host: process.env.SENDGIRD_HOST,
    port: process.env.SENDGRID_PORT,
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });

  console.log(message);

  // send mail with defined transport object
  const messageUrl =
    process.env.ENVIRONMENT === "development"
      ? `http://localhost:${process.env.PORT}/api/v1/users/${message.url}/${message.userID}`
      : "";
  const templatePath = path.join(
    __dirname,
    `../templates/${
      message.type === "accountVerification"
        ? "verifyAccount.ejs"
        : "resetPassword.ejs"
    }`
  );

  // console.log(messageUrl);
  const source = fs.readFileSync(templatePath, "utf-8").toString();
  const htmlTemplate = ejs.render(source, {
    userName: message.userName,
    url: messageUrl,
  });
  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS, // sender address
      to: `${message.userEmail}`, // list of receivers
      subject: `"${message.subject}"`, // Subject line
      text: `"${message.text}"`, // plain text body
      html: htmlTemplate, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
  } catch (error) {
    let errorApp = new AppError(error.message, 403);
    console.log({error})
    console.log(errorApp.message);
  }
};
