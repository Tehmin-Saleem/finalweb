const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: async function(value) {
        if (this.timesBorrowed > 10 && value > 100) {
          return false;
        }
        return value >= 0;
      },
      message: 'Available copies cannot exceed 100 for frequently borrowed books'
    }
  },
  timesBorrowed: {
    type: Number,
    default: 0
  }
});
module.exports = mongoose.model("Book", bookSchema);