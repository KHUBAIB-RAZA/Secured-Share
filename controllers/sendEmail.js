const nodemailer = require("nodemailer");
const File = require("../models/File"); // Ensure the path is correct

const sendEmailNodemailer = async (receiverEmail, fileID, senderName = "Encrypt Share") => {
  try {
    // Fetch the file info from the database
    const file = await File.findOne({ downloadLink: `http://localhost:4000/download/${fileID}` });

    if (!file) {
      throw new Error("File not found in database");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"${senderName}" <${process.env.GMAIL_USER}>`,
      to: receiverEmail,
      subject: "Here is your File ID!",
      text: `Dear user, here is your File ID: ${fileID}`,
      html: `
        <h3>Dear user,</h3><br/>
        Download page: <a href='http://localhost:5173/download'>download page link</a><br/>
        Here is your File ID: <strong>${fileID}</strong><br/><br/>
        <b>Because of our security policy, we don't share passwords. You need to ask the sender for it.</b>
      `
      // attachments removed
    });

    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmailNodemailer;
