

const sendWhatsAppMessage = require("../../utils/whatapp/wamessage.js");
const RequiredFollower = require("../../models/campaign/requiredFollower.js");


function formatDateToDDMMYYYY(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

const messageTemplate = (name, campName, camType, campproduct, camdeline, Eligibility, Deliverable, Payout,CamProducPrice, applylink) => 
    // `Hello ${name}\nGreat news – fresh campaigns are now live!\nReady to seize the spotlight?\nCampaign Highlights:\n\nName: ${campName}\nType: ${camType}\nProduct: ${campproduct}\nEnd Date: ${camdeline}\nEligibility: ${Eligibility}\nDeliverable: ${Deliverable}\nPayout: ${Payout}\n\nApply here:\n\n${applylink}\n\n#TixteenCampaigns`;
`Hello ${name}\nGreat news – fresh campaigns are now live!\nReady to seize the spotlight?\nCampaign Highlights:\n\nName: ${campName}\nType: ${camType}\nProduct: ${campproduct}\nEnd Date: ${camdeline}\nEligibility: ${Eligibility}\nDeliverable: ${Deliverable}\nPayout: ${Payout}\nProduct Price: ${CamProducPrice}\n\nApply here:\n\n${applylink}\n\n#TixteenCampaigns`;


const sendBatchMessages = async (batch, campaignData) => {
    const results = [];
    const { campName, camType, campproduct, camdeline, Eligibility, Deliverable, Payout, applylink,CamProducPrice } = campaignData;

    for (const { name, mobile } of batch) {
        try {
            const message = messageTemplate(name, campName, camType, campproduct, camdeline, Eligibility, Deliverable, Payout, applylink,CamProducPrice);
            const result = await sendWhatsAppMessage(mobile, message);
            results.push(result);
            console.log(`Message sent to ${mobile}`);
        } catch (error) {
            console.error(`Failed to send message to ${mobile}:`, error.message);
        }
    }
    return results;
};

const SendMessage = async (req, res) => {
    const { users, campaignData } = req.body; 
    const requiredFollowers = await RequiredFollower.find({ campaign_no:campaignData.campaign_no });

    const platformNames = {
        F: 'Facebook',
        I: 'Instagram',
        T: 'Twitter'
    };
    const campName = `${campaignData.campaign_name}`;
    const camType = `    ${campaignData.campaign_type ? campaignData.campaign_type : "Paid"}`;
    const campproduct = `${campaignData.product}`;
    const camdeline = `${formatDateToDDMMYYYY(campaignData.dead_line)}`;
    const CamProducPrice = `${campaignData.product_price}`;
    // const Eligibility = `More than 1000`;
    // const eligibilityDetails = requiredFollowers
    // .map(f => `${f.platforms.join(', ')}: ${f.followers} followers`)
    // .join(' | ');
    const eligibilityDetails = requiredFollowers
    .map(f => `${f.platforms.map(p => platformNames[p]).join(', ')}: ${f.followers} followers`)
    .join(' || ');
    const Eligibility = ` ${eligibilityDetails}`;
    const deliverables = campaignData.deliverables.length > 0 ? campaignData.deliverables.map(d => d.deliverable).join(', ') : 'No deliverables';
    const Deliverable = `${deliverables}`;
    const Payout = `${campaignData.price}`; 
    const applylink = `https://tixteen.com/verified/creator/campaign/details/${campaignData._id}`
    // const applylink = "tixteen.com";
    const defaultUser = { name: "Geeta", mobile: "8360057380" };
    // const defaultUser = { name: "VAibhav", mobile: "7909921367" };


    const batchSize = 100; 
    const delayBetweenBatches = 2000; 

    let totalSent = 0;

    try {
        try {
            const message = messageTemplate(defaultUser.name, campName, camType, campproduct, camdeline, Eligibility, Deliverable, Payout, applylink,CamProducPrice);
            const result = await sendWhatsAppMessage(defaultUser.mobile, message);
            totalSent++;
            console.log(`Default message sent to ${defaultUser.mobile}`);
        } catch (error) {
            console.error(`Failed to send default message to ${defaultUser.mobile}:`, error.message);
        }
        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            const results = await sendBatchMessages(batch, { campName, camType, campproduct, camdeline, Eligibility, Deliverable, Payout, applylink,CamProducPrice });
            totalSent += results.length;
            console.log(`Batch sent: ${results.length} messages`);

            if (i + batchSize < users.length) {
                console.log(`Waiting ${delayBetweenBatches / 1000} seconds before sending the next batch...`);
                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            }
        }

        console.log(`Total messages sent: ${totalSent}`);
        return res.status(200).json({ success: true, totalSent });
    } catch (error) {
        console.error('Error in SendMessage:', error.message);
        return res.status(500).json({ error: "Failed to send messages", details: error.message });
    }
};

module.exports = { 
    SendMessage,
};