const Sentry = require("@sentry/node");
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async ({ email, subject, body,attachments, token }) => {
  try {
    const msg = {
      to: email, // Change to your recipient
      from: process.env.FROM_EMAIL, // Change to your verified sender
      subject: subject,
      html: body,
    }
    if (attachments) {
      msg.attachments = attachments
    }
    try {
      const info = await sgMail.send(msg)
      console.log('Message sent', info);
    } catch (e) {
      console.log(e.response.body)
      // await slack.sendAlert(e)
    }
  } catch (e) {
    console.log(e)
    Sentry.captureException(e)
  }
};

module.exports = sendEmail;
