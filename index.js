const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');   
 
const connectDB = require('./src/config/db.js');
const influencerRoutes = require('./src/routes/influencerRoutes.js');
const login = require('./src/routes/loginRoutes.js');
const signupRoutes = require('./src/routes/signupRoutes.js');
const otpVerification = require('./src/routes/otpVerificationRoute.js');
const resendOtpRoute = require('./src/routes/resendOtpRoute.js');
const requestPasswordResetRoute = require('./src/routes/resetPasswordRoutes.js');
const resetPassword = require('./src/routes/resetPasswordRoutes.js');
const profileCompletion = require('./src/routes/profileCompletionRoutes.js');
const campaignRoutes = require('./src/routes/campaignRoutes.js');
const Managment = require('./src/routes/Managmentroutes.js');
const Admin = require('./src/routes/admin.js');
const Staff = require('./src/routes/stafRoute.js'); 


// influencer routes
const Auth = require("./src/routes/influencer/otpsroute.js")
const Influ = require("./src/routes/influencer/influencerroute.js");
const SocialMedia = require("./src/routes/influencer/socialMediaroutes.js")
const Bank = require("./src/routes/influencer/Bankdetails.js")
const InfluencerBank = require("./src/routes/influencer/infulncerbankdetails.js")

const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require('./src/routes/followerRequiredCampaignRoutes.js');
const Deliverable = require('./src/routes/campaignDeliverableRoutes.js');
// const {
//   getAllDeliverablesRoute,
//   getDeliverableByIdRoute
// } = require('./src/routes/campaignDeliverableRoutes.js');

// Load environment variables from .env file
dotenv.config();


// Initialize express application
const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies in requests
app.use(express.json({ limit: '100mb' }));

// Define routes
app.get('/', (req, res) => {
  res.send('vaibhav tixteen -- code is running');
});

// Register routes
// app.use('/v1', influencerRoutes);
app.use('/v1', login);
app.use('/v1', signupRoutes);
app.use('/v1', otpVerification);
app.use('/v1', resendOtpRoute);
app.use('/v1', requestPasswordResetRoute);
app.use('/v1', resetPassword);
app.use('/v1', profileCompletion);
app.use('/v1', campaignRoutes);
app.use('/v1', getAllCampaigns);
app.use('/v1', getCampaignById);
app.use('/v1', createCampaign);
app.use('/v1', updateCampaign);
app.use('/v1', deleteCampaign);
// app.use('/v1', getAllDeliverablesRoute);
// app.use('/v1', getDeliverableByIdRoute);
app.use('/v1', influencerRoutes.getAllInfluencers);
app.use('/v1', influencerRoutes.getInfluencerById);
app.use('/v1', influencerRoutes.getAllInfluencersFilter);




// managment
app.use('/v1', Managment,Staff);

// influencer
app.use('/api', Auth,Influ,SocialMedia,Bank,InfluencerBank,Deliverable);
 
// admin
app.use('/v1/admin/api', Admin);

app.post('/hash-password', async (req, res) => {
  const { password } = req.body;

  if (!password) {
      return res.status(400).json({ error: 'Password is required' });
  }

  try {
      // Generate a salt and hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Respond with the hashed password
      res.json({ hashedPassword });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
console.log("vaibhav tixteen -- code is running  ")

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server and listen on the port specified in environment variables
const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
     