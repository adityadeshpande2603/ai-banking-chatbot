const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  title: {
    type: String,
    trim: true
  },
  processed: {
    type: Boolean,
    default: false
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);

