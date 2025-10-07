const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  username: { type: String, encrypted: true }, // Encrypted blob
  password: { type: String, encrypted: true },
  url: { type: String },
  notes: { type: String, encrypted: true },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  vault: [vaultItemSchema]
});

module.exports = mongoose.model('User', userSchema);