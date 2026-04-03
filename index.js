const express = require("express");
const cors = require("cors");

// IMPORTACIÓN CORRECTA (forma segura)
const mailersend = require("mailersend");

const MailerSend = mailersend.default;
const { EmailParams, Sender, Recipient } = mailersend;

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

if (!process.env.MAILERSEND_API_KEY) {
  console.log("⚠️ Falta MAILERSEND_API_KEY");
}

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY
});

// Ruta base
app.get("/", (req, res) => {
  res.send("Backend de RunnerBag funcionando ✅");
});

// Endpoint
app.post("/predict", async (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const sentFrom = new Sender("rockyboxeador25@gmail.com", "RunnerBag");

    const recipients = [
      new Recipient("rockyboxeador25@gmail.com", "Admin")
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Nuevo registro en RunnerBag 🚀")
      .setText(`Nombre: ${nombre}\nCorreo: ${correo}`);

    await mailerSend.email.send(emailParams);

    res.json({ mensaje: "Registro enviado y notificado ✅" });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Error al enviar correo ❌" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
