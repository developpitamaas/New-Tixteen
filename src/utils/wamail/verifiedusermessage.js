
const Influencer = require('../../models/influencerModel');
const sendWhatsAppMessage = require('../whatapp/wamessage');
const sendEmail = require('../sendEmailVerificationOTP');

const handleAccountVerification = async (influencerId, verificationStatus, rejectionMessage=null)=> {
    try {
        const influencer = await Influencer.findById(influencerId);
        // console.log("influencer--",influencer);

        if (!influencer) throw new Error('Influencer not found');

        // Update influencer verification status in MongoDB
        influencer.verification = verificationStatus;
        influencer.approvedby = 'tixteenadmin'; 
        influencer.rejectmark = rejectionMessage;
        influencer.actiondate = new Date();
        await influencer.save();

        let whatsappMessage;
        let emailSubject;
        let emailHtml;

        if (verificationStatus === 'Verified') {
            const na= "let's"
            whatsappMessage =`Hey  ${influencer.user_name}\n\nYour application is in the spotlight now! We're verifying your profile for top-notch opportunities. A bit of anticipation, and you'll be all set! Thanks for choosing Tixteen!\n\nTixteen`

            emailSubject = 'Welcome to Tixteen - Your Account is Verified!';
            emailHtml = `
                <p>Dear ${influencer.user_name} ,</p>
                <p>We are excited to let you know that your Tixteen account has been successfully verified! Welcome to the Tixteen community, where opportunities to collaborate with leading brands await.</p>
                <h2>Whats Next?</h2>
                <p>Your journey with Tixteen starts now. Dive into a world of exclusive opportunities tailored just for you.</p>
                <h3>Getting Started on Tixteen</h3>
                <ul>
                    <li><strong>Discover Campaigns:</strong> Access your Tixteen dashboard to explore campaigns that match your unique style and interests.</li>
                    <li><strong>Perfect Your Profile:</strong> Update your profile with your latest achievements to attract the best partnerships.</li>
                    <li><strong>Stay Alert:</strong> Keep an eye on your inbox and Tixteen notifications via WhatsApp or website for new opportunities and updates.</li>
                </ul>
                <h3>Need Assistance?</h3>
                <p>Our support team is here for you. For any questions or guidance, reach out to us at support@tixteen.com or check our Help Center on the website.</p>
                <h3>Join the Tixteen Community</h3>
                <p>Connect with fellow Tixteen influencers on our social media or forum to share experiences, tips, and insights. Together, we grow stronger.</p>
                <p>Congratulations and welcome aboard! We can't wait to see the amazing collaborations you will be part of on Tixteen.</p>
                <p>Best wishes,</p>
                <p>Geeta Verma<br>COO</p>
            `;
        } else if (verificationStatus === 'Rejected') {
            const name = influencer.user_name
            const Link = 'https://www.tixteen.com/'
            // whatsappMessage = `Hello ${influencer.user_name},\n\nWe appreciate your interest. Unfortunately, your application has not been approved at this time. We encourage you to keep growing your influence, and perhaps we'll cross paths in the future. Thank you for considering Tixteen. #KeepShining\n\nLogin to get more detail\n\nhttps://www.tixteen.com/\nTixteen`;
            whatsappMessage = `Hello ${name}\n\nWe appreciate your interest. Unfortunately, your application has not been approved at this time. We encourage you to keep growing your influence, and perhaps we'll cross paths in the future. Thank you for considering Tixteen. #KeepShining\"\n\nLogin to get more detail\n\n${Link}\nTixteen`;

            emailSubject = 'Regret!!! Your verification is rejected';
            emailHtml = `
                <p>Hi ${influencer.user_name} ,<br>
                Thank you for taking the initiative and submitting your application. Unfortunately, we have to inform you that this time we won't be able to approve your profile. You can apply after some time.</p>
                <p>We wish you every personal and professional success in your future endeavors.</p>
                <p>Thanks,<br>Team Tixteen</p>
                <p>Reason: ${rejectionMessage}</p>
            `;
        }

        // Send WhatsApp message and email
        // await sendWhatsAppMessage(9926503468, whatsappMessage);
        await sendWhatsAppMessage(Number(influencer.mobile), whatsappMessage);
        await sendEmail(influencer.email, emailSubject, emailHtml , true);

    } catch (error) {
        console.error('Error processing account verification:', error);
    }
}



module.exports = handleAccountVerification