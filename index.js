const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const app = express();
app.use(express.json());
app.use(cors());

// Configura tu API Key de MailerSend desde Railway
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY
});

// Ruta raíz para probar que el backend está vivo
app.get("/", (req, res) => {
  res.send("Backend de RunnerBag funcionando ✅ con MailerSend");
});

// Endpoint de registro
app.post("/predict", async (req, res) => {
  const { nombre, correo } = req.body;

  try {
    // IMPORTANTE: el remitente debe ser un correo verificado en MailerSend
    const sentFrom = new Sender("tu-correo-verificado@tudominio.com", "RunnerBag");

    // Destinatario: tu propio correo para recibir las notificaciones
    const recipients = [new Recipient("rockyboxeador25@gmail.com", "Rocky")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Nuevo registro en RunnerBag")
      .setText(`Se registró ${nombre} con el correo ${correo}`);

    await mailerSend.email.send(emailParams);

    res.json({ mensaje: "Registro recibido y correo enviado ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar correo ❌" });
  }
});

// Puerto Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
