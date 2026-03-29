const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de tu correo Gmail con contraseña de aplicación
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rockyboxeador25@gmail.com",   // tu correo
    pass: "rfeh hjok vskz styx"          // tu contraseña de aplicación
  }
});

// Ruta raíz para mostrar mensaje en vez de "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Backend de RunnerBag funcionando ✅");
});

// Endpoint para recibir registros desde tu frontend
app.post("/predict", async (req, res) => {
  const { nombre, correo } = req.body;

  try {
    // Enviar correo de notificación
    await transporter.sendMail({
      from: "rockyboxeador25@gmail.com",
      to: "rockyboxeador25@gmail.com", // tu propio correo para recibir la notificación
      subject: "Nuevo registro en RunnerBag",
      text: `Se registró ${nombre} con el correo ${correo}`
    });

    res.json({ mensaje: "Registro recibido y correo enviado ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar correo ❌" });
  }
});

// Puerto Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
