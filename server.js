// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create an instance of Express
const app = express();

// Configure body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose
  .connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Define the book schema and model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
});

const Book = mongoose.model('Book', bookSchema);

// Create a new book
app.post('/books', (req, res) => {
  const { title, author, price } = req.body;

  const newBook = new Book({
    title,
    author,
    price,
  });

  newBook
    .save()
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create book' });
    });
});

// Get all books
app.get('/books', (req, res) => {
  Book.find({})
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to get books' });
    });
});

// Get a specific book by ID
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json(book);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to get book' });
    });
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, price } = req.body;

  Book.findByIdAndUpdate(
    bookId,
    { title, author, price },
    { new: true }
  )
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json(book);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update book' });
    });
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;

  Book.findByIdAndRemove(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: 'Booknot found' });
    }
    
     res.json({ message: 'Book deleted successfully' });
    })
    .catch((err) => {
    res.status(500).json({ error: 'Failed to delete book' });
    });
    });
    
    // Start the server
    app.listen(3000, () => {
    console.log('Server started on port 3000');
    });
