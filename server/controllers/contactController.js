// controllers/contactController.js

const nodemailer = require("nodemailer");
const saveContactMessage = require("../models/contactModel");

const contactUs = async (req, res) => {
  const { contact_name, contact_email, subject, message } = req.body;

  try {
    const savedMessage = await saveContactMessage.saveContactMessage(
      contact_name,
      contact_email,
      subject,
      message
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abdojareeri@gmail.com",
        pass: "ddcu mgwl wcfz xbrw",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `${contact_email}`,
      to: "abdojareeri@gmail.com",
      subject: `Subject: ${subject}`,
      text: `Name: ${contact_name}\nEmail: ${contact_email}\n\n${message} `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in contactUs controller:", error);
    res.status(500).json({ success: false, message: "Error :" });
  }
};

const getAllContactMessages = async (req, res) => {
  try {
    const contactMessages = await saveContactMessage.getAllContactMessages();
    res.json({ success: true, contactMessages });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteContactMessage = async (req, res) => {
  const messageId = req.params.id;

  try {
    const isDeleted = await saveContactMessage.deleteContactMessage(messageId);

    if (isDeleted) {
      res.json({
        success: true,
        message: "Contact message deleted successfully",
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Contact message not found" });
    }
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const softDeleteContactMessage = async (req, res) => {
    const messageId = req.params.id;
  
    try {
      const isDeleted = await saveContactMessage.softDeleteContactMessage(messageId);
  
      if (isDeleted) {
        res.json({ success: true, message: 'Contact message soft-deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Contact message not found' });
      }
    } catch (error) {
      console.error('Error soft-deleting contact message:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

module.exports = {
  contactUs,
  getAllContactMessages,
  deleteContactMessage,
  softDeleteContactMessage,
};
