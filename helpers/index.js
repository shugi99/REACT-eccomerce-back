const nodeMailer = require('nodemailer');

const mailGun = require('nodemailer-mailgun-transport');
const defaultEmailData = { from: 'noreply@node-react.com' };

const auth = {
  auth: {
    api_key: process.env.API_KEY || 'mailgun_api_key', // TODO:
    domain: process.env.DOMAIN || 'mailgun_domain', // TODO:
  },
};

exports.transporter = nodeMailer.createTransport(mailGun(auth));
