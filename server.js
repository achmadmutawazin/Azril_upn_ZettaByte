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

    const bookshelfSchema = new mongoose.Schema({
      name: String,
      bookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    });
    
    const Bookshelf = mongoose.model('Bookshelf', bookshelfSchema);
    
    app.post('/bookshelves', (req, res) => {
      const { name, bookIds } = req.body;
      const newBookshelf = new Bookshelf({ name, bookIds });
    
      newBookshelf.save()
        .then((bookshelf) => res.json(bookshelf))
        .catch((err) => res.status(500).json({ error: 'Failed to create bookshelf' }));
    });
    
    app.get('/bookshelves', (req, res) => {
      Bookshelf.find({})
        .then((bookshelves) => res.json(bookshelves))
    .catch((err) => res.status(500).json({ error: 'Failed to get bookshelves' }));
});

app.get('/bookshelves/:id', (req, res) => {
  const bookshelfId = req.params.id;
  Bookshelf.findById(bookshelfId)
    .populate('bookIds')
    .then((bookshelf) => {
      if (!bookshelf) return res.status(404).json({ error: 'Bookshelf not found' });
      res.json(bookshelf);
    })
    .catch((err) => res.status(500).json({ error: 'Failed to get bookshelf' }));
});

app.put('/bookshelves/:id', (req, res) => {
  const bookshelfId = req.params.id;
  const { name, bookIds } = req.body;

  Bookshelf.findByIdAndUpdate(bookshelfId, { name, bookIds }, { new: true })
    .then((bookshelf) => {
      if (!bookshelf) return res.status(404).json({ error: 'Bookshelf not found' });
      res.json(bookshelf);
    })
    .catch((err) => res.status(500).json({ error: 'Failed to update bookshelf' }));
});

app.delete('/bookshelves/:id', (req, res) => {
  const bookshelfId = req.params.id;

  Bookshelf.findByIdAndRemove(bookshelfId)
    .then((bookshelf) => {
      if (!bookshelf) return res.status(404).json({ error: 'Bookshelf not found' });
      res.json({ message: 'Bookshelf deleted successfully' });
    })
    .catch((err) => res.status(500).json({ error: 'Failed to delete bookshelf' }));
});

app.get('/bookshelves/filter/:bookId', (req, res) => {
  const bookId = req.params.bookId;

  Bookshelf.find({ bookIds: bookId })
    .populate('bookIds')
    .then((bookshelves) => {
      res.json(bookshelves);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to filter bookshelves' });
    });
});

// Get bookshelves filtered by book ID and specific genre
app.get('/bookshelves/filter/:bookId/:genre', (req, res) => {
  const bookId = req.params.bookId;
  const genre = req.params.genre;

  Bookshelf.find({
    bookIds: bookId,
    'bookIds.genre': genre,
  })
    .populate('bookIds')
    .then((bookshelves) => {
      res.json(bookshelves);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to filter bookshelves' });
    });
});

// Update a specific book in a bookshelf by ID
app.put('/bookshelves/:bookshelfId/books/:bookId', (req, res) => {
  const bookshelfId = req.params.bookshelfId;
  const bookId = req.params.bookId;
  const { title, author, price } = req.body;

  Bookshelf.findByIdAndUpdate(
    bookshelfId,
    {
      $set: {
        'bookIds.$[book].title': title,
        'bookIds.$[book].author': author,
        'bookIds.$[book].price': price,
      },
    },
    {
      new: true,
      arrayFilters: [{ 'book._id': bookId }],
    }
  )
    .then((bookshelf) => {
      if (!bookshelf) {
        return res.status(404).json({ error: 'Bookshelf not found' });
      }

      res.json(bookshelf);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update bookshelf' });
    });
});

// Get a list of genres of all books
app.get('/books/genres', (req, res) => {
  Book.distinct('genre')
    .then((genres) => {
      res.json(genres);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to get genres' });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

