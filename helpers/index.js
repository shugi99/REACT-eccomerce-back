const nodeMailer = require('nodemailer');
const defaultEmailData = { from: 'noreply@node-react.com' };

exports.transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'shugiyenlazala@gmail.com',
    pass: 'edjnajcvfrvodlqu',
  },
});
