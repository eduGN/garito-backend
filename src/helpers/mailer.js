const helper = {};
const nodemailer = require("nodemailer");
require("dotenv").config();

const user = process.env.USER;
const pass = process.env.PASS;

const transport = nodemailer.createTransport({
  service: "SendinBlue",
  auth: {
    user: user,
    pass: pass,
  },
});

helper.send = (subject, to, html, from) => {

  return new Promise((resolve, reject) => {
    try {
      transport.sendMail({ from, subject, to, html }, (error, info) => {
        if (error) {
          console.log("errorSendingEmail: " + JSON.stringify(error));
          reject(error);
          return;
        }

        console.log("emailSent: " + JSON.stringify(info));
        resolve(info);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = helper;
