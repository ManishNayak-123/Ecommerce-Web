// controllers/contactController.js

import Contact from "../models/contactModel.js";


// @desc    Submit a new contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContactInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation check
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields (Name, Email, and Message).' 
      });
    }

    // Create and save to database
    const newInquiry = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully submitted! Our team will get back to you shortly.',
      data: newInquiry,
    });
  } catch (error) {
    console.error('Contact Submission Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Failed to submit your message, please try again later.',
    });
  }
};

