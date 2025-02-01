const Mail = require("../../utils/sendEmailVerificationOTP");
const sendbrandmail = async (req, res) => {
    try {
        const { fullName, email, contactNumber, industryType } = req.body;

        if (!fullName || !email || !contactNumber || !industryType) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Email content for the client
        const clientMessage = `
            Hello ${fullName},

            Thank you for reaching out to us! We have received your details and will contact you soon.

            Best Regards,
            Tixteen Team
        `;

        // Email content for the admin
        const adminMessage = `
            New Brand Form Submission:

            Name: ${fullName}
            Email: ${email}
            Contact Number: ${contactNumber}
            Industry Type: ${industryType}
        `;

        // Send email to the client
        await Mail(email, "Thank You for Contacting Us!", clientMessage);

        // Send email to admin
        await Mail("contactme@tixteen.com", "New Brand Form Submission", adminMessage);

        res.status(200).json({ message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Error handling form submission:", error);
        res.status(500).json({ error: "Failed to submit form." });
    }
};

module.exports = {
    sendbrandmail,
};
