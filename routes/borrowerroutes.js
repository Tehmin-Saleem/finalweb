const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrowercontroller');

router.post('/', borrowerController.addBorrower);
router.put('/:id', borrowerController.updateBorrower);
router.post('/borrow', borrowerController.borrowBook);
router.post('/return', borrowerController.returnBook);

module.exports = router;