// const axios = require("axios")


// const sendWhatsAppMessage=  async (mobile, message)=> {
    
//     try {
//         const response = await axios.post('https://api.gupshup.io/wa/api/v1/msg', null, {
//             params: {
//                 channel: 'whatsapp',
//                 source: '916239773006',
//                 destination: `91${mobile}`,
//                 message: JSON.stringify({ type: 'text', text: message }),
//                 'src.name': 'uIHvQwJNXtGXNvHosRVFu5ke'
//             }, 
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'apikey': '6obmnmqwoxszx9nmpl9tcaf812axrp3t'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error sending WhatsApp message:', error);
//         throw error;
//     }
// }

// module.exports = sendWhatsAppMessage

const axios = require("axios");

const sendWhatsAppMessage = async (mobile, message) => {
    try {
        const response = await axios.post('https://api.gupshup.io/wa/api/v1/msg', null, {
            params: {
                channel: 'whatsapp',
                source: '916239773006',
                destination: `91${mobile}`,
                message: JSON.stringify({ type: 'text', text: message }),
                'src.name': 'uIHvQwJNXtGXNvHosRVFu5ke'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apikey': '6obmnmqwoxszx9nmpl9tcaf812axrp3t'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

module.exports = sendWhatsAppMessage