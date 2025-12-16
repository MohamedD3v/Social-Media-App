export const template = (
  code: number,
  username: string,
  subject: string ,
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        /* Reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        /* Mobile styles */
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .otp-code { font-size: 28px !important; letter-spacing: 5px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                
                <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                    
                    <tr>
                        <td bgcolor="#4A90E2" align="center" style="padding: 30px 20px;">
                            <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                Social Media APP
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">${subject}</h2>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${username}</strong>,<br>
                                Use the verification code below to confirm your email address.
                            </p>

                            <div style="margin: 30px 0;">
                                <span style="display: inline-block; background-color: #f0f7ff; color: #4A90E2; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 6px; border: 1px dashed #4A90E2;">
                                    ${code}
                                </span>
                            </div>

                            <p style="margin: 0; color: #999999; font-size: 14px;">
                                This code is valid for <strong>10 minutes</strong>.<br>
                                If you didn't request this, please ignore this email.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#f9f9f9" align="center" style="padding: 20px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; color: #bbbbbb; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} SocialMedia APP. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0 0; color: #bbbbbb; font-size: 12px;">
                                <a href="#" style="color: #4A90E2; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #4A90E2; text-decoration: none;">Support</a>
                            </p>
                        </td>
                    </tr>

                </table>
                </td>
        </tr>
    </table>

</body>
</html>
  `;
};
