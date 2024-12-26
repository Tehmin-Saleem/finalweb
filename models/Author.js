const mongoose = require('mongoose');
const authorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: 'Please enter a valid email'
      }
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\+?[\d\s-]{10,}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    books: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }]
  });
  authorSchema.pre('save', async function(next) {
    if (this.books.length > 5) {
      next(new Error('Author cannot be linked to more than 5 books'));
    }
    next();
  });
  module.exports = mongoose.model("Author", authorSchema);