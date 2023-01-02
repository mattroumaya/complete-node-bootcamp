const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// 5 fields
// name, email, photo (string), password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'An email is required.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A password is required.'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation required.'],
    validate: {
      // this only works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match.',
    },
  },
});

userSchema.pre('save', async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the pw with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete pw confirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
