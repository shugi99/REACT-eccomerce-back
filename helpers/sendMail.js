const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (name, email, message, cb) => {
  const mailOptions = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!',
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      return cb(err, null);
    }
    return cb(null, data);
  });
};

module.exports = sendMail;
