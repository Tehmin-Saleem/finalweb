const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookroutes');
const authorRoutes = require('./routes/authorRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');

const app = express();

mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/borrowers', borrowerRoutes);

const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
