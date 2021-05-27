const controller = {};
const mailer = require("../helpers/mailer");
const Email = require("email-templates");
const path = require("path");
const appDir = path.join(__dirname, "../templates/");
const emailObj = new Email({
  views: {
    root: appDir,
  },
});

controller.send = async (req, res) => {
  try {
    const subject = req.body.subject
    const destination = "jesusvillarjimenez@gmail.com";
    const text = req.body.message;
    const from = req.body.email

    await mailer.send(subject, destination, text, from);
    res.status(200).send("Se ha enviado el email");
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al enviar el email" });
  }
};

controller.sendPug = async (req, res) => {
  try {
    const subject = "Otro asunto Prueba desde nodemailer";
    const destination = "jesusvillarjimenez@gmail.com";

    const name = "Edu";
    const locals = { name: name };
    const html = await emailObj.render('welcome.pug', locals)

    await mailer.send(subject, destination, html);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al enviar el email" });
  }
};

module.exports = controller;
