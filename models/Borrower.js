const mongoose = require('mongoose');
const borrowerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    borrowedBooks: [{
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      },
      borrowDate: {
        type: Date,
        default: Date.now
      },
      dueDate: {
        type: Date,
        default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      }
    }],
    membershipActive: {
      type: Boolean,
      required: true
    },
    membershipType: {
      type: String,
      enum: ['standard', 'premium'],
      required: true
    }
  });
  module.exports = mongoose.model("Borrower", borrowerSchema);