const express = require('express');
const { transporter } = require('../helpers');
const router = express.Router();

router.post('/send', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var content = `name: ${name} \n email: ${email} \n message: ${message} `;

  var mail = {
    from: name,
    to: process.env.MY_EMAILADD, // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',

    html: `
    <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">A new message from ${name}</h2>
    <p>
        ${message} from ${name} 

        ${email}
    </p>
    
   
    <p>If the button doesn't work for any reason, you can also click on the link below:</p>

   
    </div>
`,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail',
      });
    } else {
      res.json({
        status: 'success',
      });

      transporter.sendMail(
        {
          from: process.env.MY_GMAILADD,
          to: email,
          subject: 'Thank you for contacting me ',
          html: `
    <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Thank you for contacting me</h2>
    <p>
    I  will get in touch with you very soon”
    </p>
    
   
    <p>Regards, Shugi Yen Lazala</p>

   
    </div>
`,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Message sent: ' + info.response);
          }
        }
      );
    }
  });
});

module.exports = router;
