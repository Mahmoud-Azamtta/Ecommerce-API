import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
  console.log(process.env.EMAIL_PWD);
  console.log(process.env.SENDER_EMAIL);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PWD,
    },
  });

  const info = await transporter.sendMail({
    from: `"MoeShop" <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    html,
  });

  return info;
}

export async function sendEmailPDF(to, subject, html, attachmentPath) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PWD,
    },
  });

  const info = await transporter.sendMail({
    from: `"MoeShop" <${process.env.SENDER_EMAIL}>`,
    to: to,
    subject: subject,
    html: html,
    attachments: [
      {
        filename: "invoice.pdf",
        path: attachmentPath,
      },
    ],
  });

  return info;
}
