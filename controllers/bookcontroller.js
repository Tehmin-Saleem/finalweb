const Book = require('../models/Book');
const Author = require('../models/Author');
const Borrower= require('../models/Borrower')
exports.addBook = async (req, res) => {
    try {
      const { title, author, isbn, availableCopies } = req.body;
  
      // Check if author exists and hasn't exceeded book limit
      const foundAuthor = await Author.findById(author); 
      if (!foundAuthor) {
        return res.status(404).json({ message: 'Author not found' });
      }
      if (foundAuthor.books.length >= 5) {
        return res.status(400).json({ message: 'Author has reached maximum book limit' });
      }
  
      const book = new Book({
        title,
        author: foundAuthor._id, 
        isbn,
        availableCopies,
      });
  
      await book.save();
      foundAuthor.books.push(book._id);
      await foundAuthor.save();
  
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    Object.assign(book, updates);
    await book.save();
    
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the book
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if book is currently borrowed
        const borrowers = await Borrower.find({
            'borrowedBooks.book': id
        });

        if (borrowers.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete book that is currently borrowed' 
            });
        }

        // Remove book reference from author
        await Author.findByIdAndUpdate(
            book.author,
            { $pull: { books: id } }
        );

        // Delete the book
        await Book.findByIdAndDelete(id); 

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
