const sendEmail = require('../../sendEmailVerificationOTP');

// Function to send payment schedule email
// async function sendPaymentScheduleEmail(paymentDetails) {
async function sendPaymentScheduleEmail({ payscdlamount,
  productprice,
  payscdlemail,
  payscdlinflulevel,
  payscdlinfluname,
  payscdlcampaignno,
  payscdlcampaignname,
  payscdlproduct,
  payscdlcontent,
  maindate,
  payscdlaccholder,
  payscdlbankname,
  payscdlaccnum,
  payscdlifsc}) {
  // const {
  //   payscdlamount,
  //   productprice,
  //   payscdlemail,
  //   payscdlinflulevel,
  //   payscdlinfluname,
  //   payscdlcampaignno,
  //   payscdlcampaignname,
  //   payscdlproduct,
  //   payscdlcontent,
  //   maindate,
  //   payscdlaccholder,
  //   payscdlbankname,
  //   payscdlaccnum,
  //   payscdlifsc
  // } = paymentDetails;

  const amount = payscdlamount + productprice;

  const tableHtml = `
    <table style="width: 100%;">
      <tr></tr>
      <tr>
        <th colspan="2" style="border: 1px solid;">Your Job Details:</th>
      </tr>
      <tr>
        <td style="border: 1px solid;">Your Profile Level</td>
        <td style="border: 1px solid;">${payscdlinflulevel}</td>
      </tr>
      <tr>
        <td style="border: 1px solid;">Account Holder Name</td>
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
        <td style="border: 1px solid;">Payment</td>
        <td style="border: 1px solid;">${amount}</td>
      </tr>
      <tr>
        <td style="border: 1px solid;">Payment Schedule Date</td>
        <td style="border: 1px solid;">${maindate}</td>
      </tr>
    </table>
  `;

  const tableHtml2 = `
    <table style="width: 100%;">
      <tr>
        <th colspan="2" style="border: 1px solid;">Your next step is to confirm your bank details.</th>
      </tr>
      <tr>
        <td style="border: 1px solid;">Account Holder Name</td>
        <td style="border: 1px solid;">${payscdlaccholder}</td>
      </tr>
      <tr>
        <td style="border: 1px solid;">Bank Name</td>
        <td style="border: 1px solid;">${payscdlbankname}</td>
      </tr>
      <tr>
        <td style="border: 1px solid;">Account Number</td>
        <td style="border: 1px solid;">${payscdlaccnum}</td>
      </tr>
      <tr>
        <td style="border: 1px solid;">IFSC Code</td>
        <td style="border: 1px solid;">${payscdlifsc}</td>
      </tr>
    </table>
  `;

  const mailHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Tixteen</title>
      </head>
      <body>
        <div style="width:90%; margin:auto;">
          <div style="background: #fff; box-shadow: 0px 0.8px 3px #00000085; text-align: center; border-bottom: 1px solid #00000008;">
            <img src="https://tixteen.com/assets/img/logo.png" width="120px">
          </div>
          <div>
            Dear ${payscdlinfluname},<br>
            The sales report of your campaigns for the month of ${maindate} is given below for your reference:
          </div>
          <div style="width:60%; margin:auto;">
            ${tableHtml}
            ${tableHtml2}
          </div>
          <div style="background: #000; color: #fff; text-align: center; font-family: sans-serif; padding: 0.4% 0.5%;"><br>
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
      </body>
    </html>
  `;

  try {
   
    // Send email
       await sendEmail(payscdlemail, 'Payment Proceed | Tixteen Pvt Ltd', mailHtml,true);
    ;
    console.log('Email sent successfully payent shadule ');

  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}
module.exports =  sendPaymentScheduleEmail;

// Example usage
// const paymentDetails = {
//   payscdlamount: 1000,
//   productprice: 500,
//   payscdlemail: 'example@example.com',
//   payscdlinflulevel: 'Gold',
//   payscdlinfluname: 'John Doe',
//   payscdlcampaignno: '12345',
//   payscdlcampaignname: 'Campaign X',
//   payscdlproduct: 'Product Y',
//   payscdlcontent: 'Content Z',
//   maindate: 'August 2024',
//   payscdlaccholder: 'John Doe',
//   payscdlbankname: 'Bank A',
//   payscdlaccnum: '1234567890',
//   payscdlifsc: 'IFSC1234',
// };

// sendPaymentScheduleEmail(paymentDetails);
