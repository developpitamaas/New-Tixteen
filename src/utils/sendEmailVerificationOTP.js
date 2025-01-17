


const nodemailer = require("nodemailer");

// send mail to user
const sendEmail = async (email, subject, message, isHTML = false) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      // user: "contactme@tixteen.com",
      // pass: "mpsj biyb kfru norr",
      // tixteen app  
      // user: "tixteenapp@gmail.com",
      // pass: "juaf fexj ghqk cejx",
      user: "tixteenapp@gmail.com",
      pass: "dvte miju lapf hzld",
      // user: "tixteenapp@gmail.com",
      // pass: "tixteen@app1423",

    },
  });

  let mailOptions = {
    // from: "vaibhavrathorema@gmail.com",
    from: "contactme@tixteen.com",
    to: email,
    subject: subject,
    text: isHTML ? undefined : message, 
    html: isHTML ? message : undefined,  
  };

  // Send mail
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// sendEmail("ol@yopmail.com", "Test", "Hello world");

// Export the sendEmail function
module.exports = sendEmail;
