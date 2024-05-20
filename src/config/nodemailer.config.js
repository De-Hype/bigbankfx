const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    service: process.env.SMPT_SERVICE,
    port: process.env.SMPT_PORT,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: `noreply@bigbankfx.com`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
