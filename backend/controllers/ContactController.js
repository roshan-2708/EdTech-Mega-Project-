// controllers/contactController.js

const Contact = require("../model/ContactUs");

exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        // validation
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled",
            });
        }

        // save to database
        const contact = await Contact.create({
            firstName,
            lastName,
            email,
            phone,
            message,
        });

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: contact,
        });
    } catch (error) {
        console.error("Contact Us Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
