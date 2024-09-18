const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    //This only work on CREATE and Save
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});

userSchema.pre('save', function(next) {
  //Only run if the password is modified
  if (this.isModified('password')) return next();

  //Hash the password with the cost of 12

  this.password = bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.password = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
