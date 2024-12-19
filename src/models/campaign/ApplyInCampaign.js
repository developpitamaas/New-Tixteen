const mongoose = require("mongoose");

const applyInCampaignSchema = new mongoose.Schema(
    {
        level: {
            type: String,
        },
        Noof_influencer: {
            type: String,
        },
        category_id: {
            type: String,
        },
        client_id: {
            type: String,
        },
        campaign_no: {
            type: String,
        },
        amount: {
            type: String,
        },
        availability: {
            type: String,
        },
        influ_id: {
            type: String,
        },
        influ_sign_date: {
            type: String,
        },
        influ_approval: {
            type: String,
        },
        content: {
            type: String,
        },
        content_upload_date: {
            type: String,
        },
        post_link: {
            type: String,
        },
        approval: {
            type: String,
        },
        content_approved: {
            type: String,
        },
        submition: {
            type: String,
        },
        change_reason: {
            type: String,
        },
        opt_date: {
            type: String,
        },
        accept_date: {
            type: String,
        },
        content_approved_date: {
            type: String,
        },
        cam_complt_date: {
            type: String,
        },
        submit_date: {
            type: String,
        },
        pay_scedule_date: {
            type: String,
        },
        rewards: {
            type: String,
        },
        transaction_id: {
            type: String,
        },
        payment: {
            type: String,
        },
        payment_date: {
            type: String,
        },
        year: {
            type: String,
        },
        month: {
            type: String,
        },
        influ_puchase_id: {
            type: String,
        },
        approval_rejection_date: {
            type: String,
        },
        hold: {
            type: String,
        },
        status_change_by: {
            type: String,
        },
        screenshots: {
            type: String,
        },
        product_price: {
            type: String,
        },
    },
   
    { timestamps: true } 
);

module.exports = mongoose.model("client_campaign_influencer", applyInCampaignSchema); 