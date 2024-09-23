const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if password and email exist
  if (!password || !email) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // Check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password ', 401));
  }

  //if everything is ok, send to the client
  const token = signToken(user._id);
  res.status().json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  next();

  //Getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if users exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist!',
        401
      )
    );
  }

  // Check if user changed password after the token was issued
  if (freshUser.changesPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! Please login in again.',
        401
      )
    );
  }

  //Granted access to the protected route
  req.user = freshUser;
  next();
});
