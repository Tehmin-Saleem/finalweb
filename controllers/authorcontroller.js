const Author = require('../models/Author');
const Book = require('../models/Book');

exports.addAuthor = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const author = new Author({
      name,
      email,
      phoneNumber
    });
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    Object.assign(author, updates);
    await author.save();
    
    res.json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await Author.findById(id);
    
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Check if author has any books
    if (author.books.length > 0) {
      return res.status(400).json({ message: 'Cannot delete author with associated books' });
    }

    await author.remove();
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAuthorsExceedingBookLimit = async (req, res) => {
  try {
    const authors = await Author.find().populate('books');
    const exceedingAuthors = authors.filter(author => author.books.length > 5);
    res.json(exceedingAuthors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};