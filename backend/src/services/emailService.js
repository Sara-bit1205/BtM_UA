const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Envía el correo de verificación de cuenta (doble verificación)
exports.sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verificar/${token}`
  await transporter.sendMail({
    from: `"Behind The Mask" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verifica tu cuenta en Behind The Mask',
    html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>
           <p>Este enlace expira en 24 horas.</p>`,
  })
}
