const sendEmail = require('../../sendEmailVerificationOTP');
const sendPaymentNotification =  async({
    payscdlemail,
    curpaydate,
    payscdlinflulevel,
    payscdlinfluname,
    payscdlcampaignno,
    payscdlcampaignname,
    payscdlproduct,
    payscdlcontent,
    transactionid
})=> { 
    try { 
        const tableHtml = `
            <table>
                <tr>
                    <th colspan="2" style="border: 1px solid;">Hope you are doing well! This is to tell you that the payment for the work you have done for us is being processed on ${curpaydate}</th>
                </tr>
                <tr>
                    <th colspan="2" style="border: 1px solid;">Your Job Details:</th>
                </tr>
                <tr>
                    <td style="border: 1px solid;">Your Profile Level</td>
                    <td style="border: 1px solid;">${payscdlinflulevel}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid;">Your Name</td>
                    <td style="border: 1px solid;">${payscdlinfluname}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid;">Campaign ID</td>
                    <td style="border: 1px solid;">${payscdlcampaignno}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid;">Brand Name</td>
                    <td style="border: 1px solid;">${payscdlcampaignname}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid;">Product Name</td>
                    <td style="border: 1px solid;">${payscdlproduct}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid;">Content-Type</td>
                    <td style="border: 1px solid;">${payscdlcontent}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid;">Transaction-ID</td>
                    <td style="border: 1px solid;">${transactionid}</td>
                </tr>
            </table>
        `;

        const mailHtml = `
           
                <div style="width:450px; margin:auto;">
                    <div style="background: #fff; box-shadow: 0px 0.8px 3px #00000085; text-align: center; border-bottom: 1px solid #00000008;">
                        <img src="https://tixteen.com/assets/img/logo.png" width="120px">
                    </div>
                    <div>
                        ${tableHtml}
                    </div>
                    <div>Note: Usually, payments are reflected within a few hours after proceeding, but sometimes due to some technical reason payments take up to 3–5 business days to reflect.</div>
                    <div>Please contact us if you have any questions.</div>
                    <div style="background: #000; color: #fff; text-align: center; font-family: sans-serif; padding: 0.4% 0.5%;">
                        <br>
                        <h1>Thank You</h1>
                        <p>Support:<br><a href="mailto:support@tixteen.com" style="color: #fff;">support@tixteen.com</a></p>
                        <div>
                            <a href="https://www.facebook.com/tixteen/" target="_blank"><img src="https://tixteen.com/assets/img/facebook.png" width="40px"></a>
                            <a href="https://www.instagram.com/tixteen/"><img src="https://tixteen.com/assets/img/instagram.png" width="40px"></a>
                            <a href="https://twitter.com/tixteen_"><img src="https://tixteen.com/assets/img/twitter.png" width="40px"></a>
                            <a href="https://www.youtube.com/channel/UCe80mP_r-wbPzGdiTQDiBrg" target="_blank"><img src="https://tixteen.com/assets/img/youtube.png" width="40px"></a>
                            <br>
                            <p>© 2021-22 Tixteen, All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
           
        `;
        await sendEmail(payscdlemail, 'Payment Proceed | Tixteen Pvt Ltd', mailHtml,true);

    } catch (error) {
        console.error('Error sending payment notification:', error.message);
    }
}

module.exports = sendPaymentNotification