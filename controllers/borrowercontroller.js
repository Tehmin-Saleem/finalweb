const Borrower = require('../models/Borrower');
const Book = require('../models/Book');

exports.addBorrower = async (req, res) => {
  try {
    const { name, membershipType, membershipActive } = req.body;
    const borrower = new Borrower({
      name,
      membershipType,
      membershipActive,
      borrowedBooks: []
    });
    await borrower.save();
    res.status(201).json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBorrower = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const borrower = await Borrower.findById(id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    // If updating membership type, check borrowing limits
    if (updates.membershipType && updates.membershipType === 'standard' && 
        borrower.borrowedBooks.length > 5) {
      return res.status(400).json({ 
        message: 'Cannot downgrade to standard membership with more than 5 borrowed books' 
      });
    }

    Object.assign(borrower, updates);
    await borrower.save();
    
    res.json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;
    
    const borrower = await Borrower.findById(borrowerId)
      .populate('borrowedBooks.book');
    const book = await Book.findById(bookId);

    if (!borrower || !book) {
      return res.status(404).json({ message: 'Borrower or book not found' });
    }

    // Check membership status
    if (!borrower.membershipActive) {
      return res.status(400).json({ message: 'Membership is not active' });
    }

    // Check borrowing limits
    const borrowLimit = borrower.membershipType === 'premium' ? 10 : 5;
    if (borrower.borrowedBooks.length >= borrowLimit) {
      return res.status(400).json({ 
        message: `Cannot borrow more than ${borrowLimit} books with ${borrower.membershipType} membership` 
      });
    }

    // Check available copies
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Check for overdue books
    const hasOverdueBooks = borrower.borrowedBooks.some(
      borrowed => borrowed.dueDate < new Date()
    );
    if (hasOverdueBooks) {
      return res.status(400).json({ message: 'Cannot borrow with overdue books' });
    }

    // Process borrowing
    book.availableCopies--;
    book.timesBorrowed++;
    await book.save();

    borrower.borrowedBooks.push({
      book: bookId,
      borrowDate: new Date(),
      dueDate: new Date(+new Date() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    });
    await borrower.save();

    res.json({ message: 'Book borrowed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;
    
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower || !book) {
      return res.status(404).json({ message: 'Borrower or book not found' });
    }

    const borrowedBookIndex = borrower.borrowedBooks.findIndex(
      borrowed => borrowed.book.toString() === bookId
    );

    if (borrowedBookIndex === -1) {
      return res.status(400).json({ message: 'Book not borrowed by this user' });
    }

    // Remove book from borrower's list
    borrower.borrowedBooks.splice(borrowedBookIndex, 1);
    await borrower.save();

    // Increase available copies
    book.availableCopies++;
    await book.save();

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};