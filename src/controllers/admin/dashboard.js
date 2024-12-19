const Campaign = require('../../models/campaignModel.js');
const Influencer = require('../../models/influencerModel.js');
const TryCatch = require('../../middleware/trycatch.js');
const moment = require('moment'); 





const GetCampaignSummary = TryCatch(async (req, res) => {
    const campaigns = await Campaign.find();
    if (!campaigns) {
        return res.status(404).json({ message: 'Campaigns not found' });
    }

    // Initialize summary object
    const summary = {
        totalCampaigns: campaigns.length,
        ageGroups: {},
        totalApprovals: 0,
        totalCompleted: 0,
        totalPending: 0,
        totalDelayed: 0,
        totalPaid: 0,
        totalBarter: 0,
        platforms: {}
    };

    // Helper function to classify age groups
    const classifyAgeGroup = (age) => {
        if (age >= 10 && age < 15) return '10-15';
        if (age >= 15 && age < 20) return '15-20';
        if (age >= 20 && age < 25) return '20-25';
        if (age >= 25 && age < 30) return '25-30';
        if (age >= 30 && age < 35) return '30-35';
        if (age >= 35 && age < 40) return '35-40';
        if (age >= 40 && age < 45) return '40-45';
        if (age >= 45 && age < 50) return '45-50';
        if (age >= 50 && age < 55) return '50-55';
        if (age >= 55 && age < 60) return '55-60';
        if (age >= 60 && age < 65) return '60-65';
        if (age >= 65 && age < 70) return '65-70';
        // Add more age groups as needed
        return 'Other';
    };

    campaigns.forEach(campaign => {
        // Classify age groups
        const ageGroup = classifyAgeGroup(Number(campaign.age));
        summary.ageGroups[ageGroup] = (summary.ageGroups[ageGroup] || 0) + 1;

        // Count approval statuses
        if (campaign.approval === '1') summary.totalApprovals += 1;

        // Count campaign statuses
        if (campaign.status === 'Completed') summary.totalCompleted += 1;
        if (campaign.status === 'Pending') summary.totalPending += 1;
        if (campaign.status === 'Delayed') summary.totalDelayed += 1;

        // Count payment types
        if (campaign.price && Number(campaign.price) > 0) summary.totalPaid += 1;
        else summary.totalBarter += 1;

        // Count platforms
        const platform = campaign.platforms;
        summary.platforms[platform] = (summary.platforms[platform] || 0) + 1;
    });

    res.status(200).json({
        success: true,
        data: summary,
        message: 'Campaign summary fetched successfully',
    });
});


const GetFilteredCampaigns = TryCatch(async (req, res) => {
    const { date, month, year } = req.query;

    let campaigns;
    let query = {};

    // Filter by date
    if (date) {
        const startDate = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
        const endDate = moment(date, 'YYYY-MM-DD').endOf('day').toDate();
        campaigns = await Campaign.find({});
        campaigns = campaigns.filter(campaign => {
            const campaignDate = moment(campaign.created_date, 'DD-MMM-YY HH:mm:ss').toDate();
            return campaignDate >= startDate && campaignDate <= endDate;
        });
    }

    // Filter by month and year
    if (month && year) {
        campaigns = await Campaign.find({});
        campaigns = campaigns.filter(campaign => {
            const campaignDate = moment(campaign.created_date, 'DD-MMM-YY HH:mm:ss');
            return campaignDate.year() === parseInt(year) && campaignDate.month() + 1 === parseInt(month);
        });
    }

    // Filter by year
    if (year && !month) {
        campaigns = await Campaign.find({});
        campaigns = campaigns.filter(campaign => {
            const campaignDate = moment(campaign.created_date, 'DD-MMM-YY HH:mm:ss');
            return campaignDate.year() === parseInt(year);
        });
    }

    if (!campaigns || !campaigns.length) {
        // show all
        campaigns = await Campaign.find({});
        return res.status(200).json({
            success: true,
            count: campaigns.length,
            data: campaigns.map(campaign => ({
                _id: campaign._id,
                id: campaign.id,
                campaign_name: campaign.campaign_name,
                created_date: campaign.created_date,
                dead_line: campaign.dead_line,
                status: campaign.status,
                banner: campaign.banner,
                campaign_no: campaign.campaign_no,
                industry : campaign.industry,
                gender : campaign.gender,
                language : campaign.language,
                availability : campaign.availability,
                country : campaign.country,
                state : campaign.state,
                city : campaign.city
            })),
            message: 'Campaigns fetched successfully',
        })
    }

    res.status(200).json({
        success: true,
        count: campaigns.length,
        data: campaigns.map(campaign => ({
            _id: campaign._id,
            id: campaign.id,
            campaign_name: campaign.campaign_name,
            created_date: campaign.created_date,
            dead_line: campaign.dead_line,
            status: campaign.status,
            banner: campaign.banner,
            campaign_no: campaign.campaign_no
        })),
        message: 'Campaigns fetched successfully',
    });
});

const GetMonthlyCampaignCounts = TryCatch(async (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ message: 'Year is required' });
    }

    // Fetch all campaigns
    const campaigns = await Campaign.find({});
    console.log("Total campaigns:", campaigns.length);

    // Helper function to parse date
    const parseDate = (date) => {
        if (!date) return null;

        // If the date is a string, try parsing it
        if (typeof date === 'string') {
            if (date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                return new Date(date);
            } else if (date.match(/^\d{1,2}-[A-Za-z]{3}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
                // Handle DD-MMM-YY HH:mm:ss format
                const [day, monthAbbr, yearStr] = date.split(/[-\s]/);
                const monthMapping = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                };
                const month = monthMapping[monthAbbr];
                const year = parseInt(yearStr) + 2000; // Adjust for two-digit year
                const [hours, minutes, seconds] = date.split(' ')[1].split(':');
                return new Date(year, month, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
            }
        }

        // If it's already a valid date object
        if (date instanceof Date) return date;

        return null; // Return null if parsing fails
    };

    // Filter campaigns by the given year
    const filteredCampaigns = campaigns.filter(campaign => {
        const campaignDate = parseDate(campaign.created_date);
        return campaignDate && campaignDate.getFullYear() === parseInt(year);
    });

    console.log("Filtered campaigns:", filteredCampaigns.length);

    // Count campaigns for each month
    const monthCounts = Array(12).fill(0);
    filteredCampaigns.forEach(campaign => {
        const campaignDate = parseDate(campaign.created_date);
        if (campaignDate) {
            monthCounts[campaignDate.getMonth()]++; // `getMonth()` returns 0-based index
        }
    });

    const response = {
        year,
        total: filteredCampaigns.length,
        monthlyCounts: {
            January: monthCounts[0],
            February: monthCounts[1],
            March: monthCounts[2],
            April: monthCounts[3],
            May: monthCounts[4],
            June: monthCounts[5],
            July: monthCounts[6],
            August: monthCounts[7],
            September: monthCounts[8],
            October: monthCounts[9],
            November: monthCounts[10],
            December: monthCounts[11],
        }
    };

    res.status(200).json({
        success: true,
        data: response,
        message: 'Campaign counts fetched successfully',
    });
});


// const GetMonthlyCampaignCounts = TryCatch(async (req, res) => {
//     const { year } = req.query;

//     if (!year) {
//         return res.status(400).json({ message: 'Year is required' });
//     }

//     // Fetch all campaigns
//     const campaigns = await Campaign.find({});
//     console.log("Total campaigns:", campaigns);

//     // Filter campaigns by the given year
//     const filteredCampaigns = campaigns.filter(campaign => {
//         const campaignDate = moment(campaign.created_date, 'DD-MMM-YY HH:mm:ss');
//         return campaignDate.year() === parseInt(year);
//     });

//     // Count campaigns for each month
//     const monthCounts = Array(12).fill(0);
//     filteredCampaigns.forEach(campaign => {
//         const campaignDate = moment(campaign.created_date, 'DD-MMM-YY HH:mm:ss');
//         monthCounts[campaignDate.month()]++;
//     });

//     const response = {
//         year,
//         total: filteredCampaigns.length,
//         monthlyCounts: {
//             January: monthCounts[0],
//             February: monthCounts[1],
//             March: monthCounts[2],
//             April: monthCounts[3],
//             May: monthCounts[4],
//             June: monthCounts[5],
//             July: monthCounts[6],
//             August: monthCounts[7],
//             September: monthCounts[8],
//             October: monthCounts[9],
//             November: monthCounts[10],
//             December: monthCounts[11],
//         }
//     };

//     res.status(200).json({
//         success: true,
//         data: response,
//         message: 'Campaign counts fetched successfully',
//     });
// });

// Influencers

// get all influencers
const GetInfluencerSummary = TryCatch(async (req, res) => {
    const InfluencerList = await Influencer.find({});

    res.status(200).json({
        success: true,
        count: InfluencerList.length,
        data: InfluencerList.map(influencer => ({
            _id: influencer._id,
            id: influencer.id,
            name: influencer.name,
            email: influencer.email,
            phone: influencer.phone,
            level : influencer.level,
            verification : influencer.verification,
            status : influencer.status,
            // created_date: influencer.created_date,
            regs_date : influencer.regs_date
        })),
        message: 'Influencers fetched successfully',
    });
});

const GetMonthlyUserCounts = TryCatch(async (req, res) => {
    const { year, rejected = false, verified = false } = req.query;

    if (!year) {
        return res.status(400).json({ message: 'Year is required' });
    }

    // Fetch all influencers
    const influencers = await Influencer.find({});

    // Define month mapping for abbreviation to numeric
    const monthMapping = {
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
    };

    // Function to parse date
    const parseDate = (dateString) => {
        if (!dateString) return null;

        // Handle `DD-MMM-YY HH:mm:ss` format
        if (dateString.match(/^\d{1,2}-[A-Za-z]{3}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
            const [day, monthAbbr, yearStr] = dateString.split(/[-\s]/);
            const parsedMonth = monthMapping[monthAbbr];
            const parsedYear = parseInt(yearStr) + 2000; // Adjust for two-digit year
            return { day: parseInt(day), month: parsedMonth, year: parsedYear };
        }

        // Handle `MMM D, YYYY` format
        if (dateString.match(/^[A-Za-z]{3} \d{1,2}, \d{4}$/)) {
            const [monthAbbr, dayStr, yearStr] = dateString.replace(',', '').split(' ');
            const parsedMonth = monthMapping[monthAbbr];
            const parsedYear = parseInt(yearStr);
            return { day: parseInt(dayStr), month: parsedMonth, year: parsedYear };
        }

        return null; // Return null if format doesn't match
    };

    // Filter influencers by year
    const filteredInfluencers = influencers.filter(influencer => {
        const parsedDate = parseDate(influencer.regs_date);
        if (!parsedDate) return false; // Skip if date parsing fails
        return parsedDate.year === parseInt(year);
    });


    // Initialize counters
    let rejectedCount = 0;
    let verifiedCount = 0;
    const rejectedMonthlyCounts = Array(12).fill(0);
    const verifiedMonthlyCounts = Array(12).fill(0);

    // Count users for each month based on type flags
    filteredInfluencers.forEach(influencer => {
        const parsedDate = parseDate(influencer.regs_date);
        if (!parsedDate) return;

        const monthIndex = parsedDate.month - 1; // Convert month to zero-based index

        if (rejected) {
            if (influencer.verification.toLowerCase() === 'rejected') {
                rejectedCount++;
                rejectedMonthlyCounts[monthIndex]++;
            }
        }

        if (verified) {
            if (influencer.verification.toLowerCase() === 'verified') {
                verifiedCount++;
                verifiedMonthlyCounts[monthIndex]++;
            }
        }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Prepare response with separate type counts and arrays
    const response = {
        year,
        total: filteredInfluencers.length,
        rejectedCount,
        verifiedCount,
        rejectedMonthlyCounts: rejectedMonthlyCounts.map((count, index) => ({ month: monthNames[index], count })),
        verifiedMonthlyCounts: verifiedMonthlyCounts.map((count, index) => ({ month: monthNames[index], count }))
    };

    res.status(200).json({
        success: true,
        data: response,
        message: `${rejected ? 'Rejected' : ''}${verified ? (rejected ? ' and ' : '') + 'Verified' : 'All'} influencers counts fetched successfully`,
    });
});


const GetUserCountsByDate = TryCatch(async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ message: 'Month and Year are required' });
    }

    // Fetch all influencers
    const influencers = await Influencer.find({});

    // Define month mapping for abbreviation to numeric
    const monthMapping = {
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
    };

    // Function to parse date
    const parseDate = (dateString) => {
        if (!dateString) return null;

        // Handle `DD-MMM-YY HH:mm:ss` format
        if (dateString.match(/^\d{1,2}-[A-Za-z]{3}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
            const [day, monthAbbr, yearStr] = dateString.split(/[-\s]/);
            const parsedMonth = monthMapping[monthAbbr];
            const parsedYear = parseInt(yearStr) + 2000; // Adjust for two-digit year
            return { day: parseInt(day), month: parsedMonth, year: parsedYear };
        }

        // Handle `MMM D, YYYY` format
        if (dateString.match(/^[A-Za-z]{3} \d{1,2}, \d{4}$/)) {
            const [monthAbbr, dayStr, yearStr] = dateString.replace(',', '').split(' ');
            const parsedMonth = monthMapping[monthAbbr];
            const parsedYear = parseInt(yearStr);
            return { day: parseInt(dayStr), month: parsedMonth, year: parsedYear };
        }

        return null; // Return null if format doesn't match
    };

    // Filter influencers by month and year
    const filteredInfluencers = influencers.filter(influencer => {
        const parsedDate = parseDate(influencer.regs_date);
        if (!parsedDate) return false; // Skip if date parsing fails
        return parsedDate.month === parseInt(month) && parsedDate.year === parseInt(year);
    });


    const eventCounts = {};

    // Count users for each day and collect their details
    filteredInfluencers.forEach(influencer => {
        const parsedDate = parseDate(influencer.regs_date);
        const influencerDate = `${parsedDate.year}-${String(parsedDate.month).padStart(2, '0')}-${String(parsedDate.day).padStart(2, '0')}`;
        if (!eventCounts[influencerDate]) {
            eventCounts[influencerDate] = { verified: [], rejected: [] };
        }

        if (influencer.verification.toLowerCase() === 'verified') {
            eventCounts[influencerDate].verified.push({
                _id: influencer._id,
                id: influencer.id,
                user_name: influencer.user_name,
                industry: influencer.industry,
                ship_city: influencer.ship_city,
                verification: influencer.verification,
                profile_img: influencer.profile_img,
                age: influencer.age,
            });
        } else if (influencer.verification.toLowerCase() === 'rejected') {
            eventCounts[influencerDate].rejected.push({
                _id: influencer._id,
                id: influencer.id,
                user_name: influencer.user_name,
                industry: influencer.industry,
                ship_city: influencer.ship_city,
                verification: influencer.verification,
                profile_img: influencer.profile_img,
                age: influencer.age,
            });
        }
    });

    // Prepare response
    const events = [];
    Object.keys(eventCounts).forEach(date => {
        if (eventCounts[date].verified.length > 0) {
            events.push({
                title: `${eventCounts[date].verified.length} Verified`,
                start: new Date(date),
                end: new Date(date),
                allDay: true,
                backgroundColor: 'lightgreen',
                textColor: 'black',
                users: eventCounts[date].verified,
            });
        }
        if (eventCounts[date].rejected.length > 0) {
            events.push({
                title: `${eventCounts[date].rejected.length} Rejected`,
                start: new Date(date),
                end: new Date(date),
                allDay: true,
                backgroundColor: 'lightcoral',
                textColor: 'black',
                users: eventCounts[date].rejected,
            });
        }
    });

    res.status(200).json({
        success: true,
        data: events,
        message: 'User counts fetched successfully',
    });
});




  
  
  
  
  

    

module.exports = {
    GetCampaignSummary,
    GetFilteredCampaigns,
    GetMonthlyCampaignCounts,
    GetInfluencerSummary,
    GetMonthlyUserCounts,
    GetUserCountsByDate
}