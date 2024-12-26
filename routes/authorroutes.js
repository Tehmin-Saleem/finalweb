const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorcontroller');

router.post('/', authorController.addAuthor);
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);
router.get('/exceeding-limit', authorController.getAuthorsExceedingBookLimit);

module.exports = router;