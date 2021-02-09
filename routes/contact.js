const express = require('express');
const mailgun = require('mailgun-js')({
  apiKey: process.env.API_KEY,
  domain: process.env.DOMAIN,
});

const router = express.Router();

router.post('/send', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;

  const data = {
    from: email,
    to: process.env.MY_EMAILADD,
    subject: 'Hello',
    text: message,
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) {
      res.json({
        status: 'fail',
      });
      console.log(error);
    }
    if (body) {
      res.json({
        status: 'success',
      });
      console.log(body);
    }
  });
});

module.exports = router;
