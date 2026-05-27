const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    // For testing purposes, we use Ethereal Email which generates fake emails that can be viewed online
    // This ensures the project doesn't break if no real SMTP credentials are provided
    let transporter;

    if (process.env.SMTP_EMAIL) {
        // Use real SMTP if credentials are provided in .env
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    } else {
        // Dynamically generate a test Ethereal account if no real credentials exist
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    // 2. Define the email options
    const mailOptions = {
        from: `Job Portal <noreply@jobportal.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html (if we want to send HTML emails later)
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    
    // Log the URL where the email can be viewed during development
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
