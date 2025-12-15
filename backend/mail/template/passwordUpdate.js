exports.passwordUpdateTemplate = (userName) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color:#f4f4f7; padding:30px;">
      <div style="
          max-width:600px;
          margin:auto;
          background:#ffffff;
          border-radius:10px;
          box-shadow:0 4px 20px rgba(0,0,0,0.1);
          padding:30px;
      ">

        <div style="text-align:center; padding-bottom:20px; border-bottom:1px solid #eee;">
            <h1 style="color:#4caf50; margin:0;">Password Updated</h1>
        </div>

        <div style="margin-top:20px; line-height:1.7; color:#444;">
          <p>Hi <strong>${userName}</strong>,</p>

          <p>
            This is a confirmation that your password has been changed successfully.
            If you made this change, no further action is needed.
          </p>

          <p>
            If you <strong>did NOT</strong> make this change, please reset your password immediately
            and contact our support team.
          </p>

          <a href="https://studynotion.com/login"
             style="
                display:inline-block;
                background:#4caf50;
                color:white;
                padding:12px 20px;
                border-radius:6px;
                text-decoration:none;
                margin-top:20px;
             ">
            Login Now
          </a>
        </div>

        <div style="margin-top:30px; text-align:center; color:#888; font-size:14px;">
          <p>© ${new Date().getFullYear()} StudyNotion — All Rights Reserved.</p>
        </div>

      </div>
    </div>
    `;
};
