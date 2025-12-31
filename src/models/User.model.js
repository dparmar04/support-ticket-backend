const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['engineer', 'admin', 'sales'],
  },
  skills: {
    type: [String], // ['react', 'node', 'mongodb']
    default: [],
  },
  activeTickets: {
    type: Number,
    default: 0,
  }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);