const axios = require("axios");

function sendWhatsAppMessage(mobile, name, verified) {
  const apiKey = "6obmnmqwoxszx9nmpl9tcaf812axrp3t";
  const baseUrl = "https://api.gupshup.io/wa/api/v1/msg";

  let message = "";
  if (verified) {
    message = `Hi ${name}\n\nFantastic news, Tixteen Influencer! Your account is now verified! Welcome officially to the Tixteen family. Exciting collaborations await, let's create magic together! \n\nTixteen`;
  } else {
    message = `Hello ${name}\n\nWe appreciate your interest. Unfortunately, your application has not been approved at this time. We encourage you to keep growing your influence, and perhaps we'll cross paths in the future. Thank you for considering Tixteen. #KeepShining\n\nLogin to get more detail\n\nhttps://www.tixteen.com/\nTixteen`;
  }

  const params = new URLSearchParams({
    channel: "whatsapp",
    source: "916239773006",
    destination: `91${mobile}`,
    message: JSON.stringify({ type: "text", text: message }),
    "src.name": "uIHvQwJNXtGXNvHosRVFu5ke",
  });

  axios
    .post(baseUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        apikey: apiKey,
      },
    })
    .then((response) => {
      console.log("WhatsApp message sent:", response.data);
    })
    .catch((error) => {
      console.error("Error sending WhatsApp message:", error);
    });
}

// export 
module.exports = sendWhatsAppMessage

// Example usage
// sendWhatsAppMessage("9926503468", "John Doe", true);
