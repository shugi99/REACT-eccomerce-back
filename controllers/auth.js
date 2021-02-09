const User = require('../models/user');
const _ = require('lodash');
const { generateToken } = require('../utils/generateToken');
const { sendEmail, transporter } = require('../helpers');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email }).exec();

  if (userExists) {
    res.status(400).send('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send('Invalid user data');
  }
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send('Invalid email or password');
  }
};

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// exports.currentUser = async (req, res) => {
//   User.findOne({ email: req.user.email }).exec((err, user) => {
//     if (err) throw new Error(err);
//     res.json(user);
//   });
// };

exports.currentUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'No request body' });
  if (!req.body.email)
    return res.status(400).json({ message: 'No Email in request body' });

  const { email } = req.body;

  // find the user based on email
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status('401').json({
        error: 'User with that email does not exist!',
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: 'NODEAPI' },
      process.env.JWT_SECRET
    );

    // email data
    const emailData = {
      from: 'noreply@node-react.com',
      to: email,
      subject: 'Password Reset Instructions',

      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Password Reset Link</h2>
      <p>
          Just click the button below to redirect to password reset page.
      </p>
      
      <a href=${process.env.CLIENT_URL}/reset-password/${token} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Reset Password</a>
  
      <p>If the button doesn't work for any reason, you can also click on the link below:</p>
  
      <a href=${process.env.CLIENT_URL}/reset-password/${token}>${process.env.CLIENT_URL}/reset-password/${token}</a>
      </div>
  `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        transporter.sendMail(emailData, (err, data) => {
          if (err) {
            res.json({
              status: 'fail',
            });
          } else {
            res.status(200).json({
              status: 'success',
              message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
            });
          }
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status('401').json({
        error: 'Invalid Link!',
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: '',
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });
};
