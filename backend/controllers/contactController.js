const nodemailer = require('nodemailer');

// @desc  Send contact message email
// @route POST /api/contact
const sendContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message fields are required.' });
  }

  const mailSubject = subject || `New Inquiry from ${name}`;
  const targetEmail = process.env.CONTACT_RECEIVER_EMAIL || 'pp.rtr.lakshitha.m@gmail.com';

  console.log(`📩 New Contact Message from ${name} (${email}, Phone: ${phone || 'N/A'}):`);
  console.log(`Subject: ${mailSubject}`);
  console.log(`Message: ${message}`);

  // Configure transporter using SMTP env vars or fallback Ethereal / Gmail SMTP
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER || process.env.CONTACT_RECEIVER_EMAIL;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"Falcon Youth" <${smtpUser}>`,
        replyTo: `"${name}" <${email}>`,
        to: targetEmail,
        subject: `[Falcon Youth] New Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f1017; color: #ffffff; border-radius: 10px;">
            <h2 style="color: #c9a227; border-bottom: 1px solid #333; padding-bottom: 10px;">🦅 New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (&lt;<a href="mailto:${email}" style="color: #c9a227;">${email}</a>&gt;)</p>
            <p><strong>Phone:</strong> ${phone ? `<a href="tel:${phone}" style="color: #c9a227;">${phone}</a>` : 'Not provided'}</p>
            <p><strong>Subject:</strong> ${mailSubject}</p>
            <div style="background-color: #1a1b26; padding: 15px; border-left: 4px solid #c9a227; margin-top: 15px; border-radius: 5px;">
              <p style="white-space: pre-line; line-height: 1.6; color: #d1d5db;">${message}</p>
            </div>
            <p style="font-size: 0.8rem; color: #888; margin-top: 20px;">Sent via Rotaract Club of Falcon Youth Website Contact Form</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Contact email sent successfully to ${targetEmail}`);
    } catch (mailError) {
      console.error('❌ Failed to send SMTP email:', mailError.message);
      // Still respond 200 since message is logged on server console
    }
  }

  res.status(200).json({ message: 'Message received successfully! We will get back to you soon.' });
};

// @desc  Get public contact info
// @route GET /api/contact/info
const getContactInfo = async (req, res) => {
  const email = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || 'pp.rtr.lakshitha.m@gmail.com';
  res.json({ email });
};

module.exports = { sendContactMessage, getContactInfo };

