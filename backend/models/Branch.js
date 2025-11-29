const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ifsc: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster searches
branchSchema.index({ name: 'text', ifsc: 'text' });

module.exports = mongoose.model('Branch', branchSchema);

