const nodemailer = require("nodemailer");
require("dotenv").config();
const SmtpConfig = require("../models/SmtpConfig");

const sendEmail = async (subject, body, html) => {
  try {
    const smtpconfig = await SmtpConfig.findOne();
    const pass = smtpconfig.password;
    // Check if password is null
    if (!pass) {
      throw new Error(
        "SMTP password not found. Please configure SMTP details in the admin panel for sending emails."
      );
    }

    // Check if smtpconfig is null
    if (!smtpconfig) {
      throw new Error(
        "SMTP config Details not found. Please configure SMTP details in the admin panel for sending emails."
      );
    }

    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        // service: smtpconfig.service,
        host: smtpconfig.host,
        port: smtpconfig.port,
        secure: smtpconfig.secure, // true for 465, false for other ports
        auth: {
          user: smtpconfig.mail_address,
          pass: pass,
        },
        socketTimeout: 10000, // Time in ms before socket timeout
        connectionTimeout: 10000, // Timeout for establishing a connection
      });

      const email = body.email;
      const mailOptions = {
        from: smtpconfig.mail_address,
        to: email,
        subject: subject,
        html: html,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          resolve(false);
        } else {
          console.log("Email sent: " + info.response);
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.log("Error in sendEmail: ", error.message);
    throw error;
  }
};

module.exports = sendEmail;
