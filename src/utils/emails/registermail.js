const RegisterUserEmail = (user) => {
    return ` <div style="display: flex; align-items: center; justify-content: center; padding: 20px;" >
  <div style="max-width: 600px; overflow: hidden; margin: 0 auto; padding: 20px; border: 2px solid #FFD700; border-radius: 10px; font-family: Arial, sans-serif; background-color: #fff;">
    <!-- Rotated yellow lines this lines are commented
    <div style="position: relative; height: 20px;">
        <div style="position: absolute; top: 9px; left: -22px; width: 151px; height: 56px; background-color: #FFD700; transform: rotate(-45deg); transform-origin: left bottom;"></div>
        <div style="position: absolute; top: 95px; left: -23px; width: 198px; height: 25px; background-color: #FFD700; transform: rotate(-45deg); transform-origin: left bottom;"></div>
    </div>
     -->

    <div style="padding: 40px 20px;">
         <img src="https://res.cloudinary.com/dzvsrft15/image/upload/v1723462345/TixteenLogo_nzm33i.png" alt="Tixteen Logo" style="width: 120px; display: block; margin: 0 auto;">
        <h1 style="text-align: center; color: #000; font-size: 24px; margin-top: 20px;">Dear ${user.user_name},</h1>
        <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
            Congratulations and welcome to <strong>TIXTEEN</strong>!<br>
            We're excited to let you know that your registration was successful. You are now a part of our community and ready to enjoy all the features and benefits TIXTEEN offers.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
            To get started, we recommend:
            <ul style="padding-left: 20px; color: #333; font-size: 16px; line-height: 1.5;">
                <li>Personalizing your profile to make it uniquely yours.</li>
                <li>Checking out the latest updates and features on our platform.</li>
                <li>Connecting with fellow members and exploring new opportunities.</li>
            </ul>
        </p>
        <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
            If you ever need help or have any questions, don't hesitate to reach out to our support team at [support email]. We're here to ensure you have the best experience possible.
        </p>
        <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
            Thank you for choosing TIXTEEN. We're thrilled to have you with us!
        </p>
        <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
            Best regards,<br> Team TIXTEEN 
        </p>
    </div>

    <!-- Rotated yellow lines at bottom this lines are commented
    <div style="position: relative; height: 20px;">
    <div style="position: absolute; bottom: -78px; right: -115px; width: 151px; height: 74px; background-color: #FFD700; transform: rotate(-45deg); transform-origin: left bottom;"></div>
    
    </div>
    -->
</div>

</div>
</div>
 `
}

module.exports = RegisterUserEmail