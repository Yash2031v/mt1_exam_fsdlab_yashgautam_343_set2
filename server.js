const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store initialized with Set A records
let books = [
  {
    id: 101,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    genre: "Autobiography",
    publishedYear: 1999,
    available: true,
  },
  {
    id: 102,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    publishedYear: 1988,
    available: true,
  },
  {
    id: 103,
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    publishedYear: 1997,
    available: false,
  },
];

let nextId = 104;

// Helper to validate book payload
function validateBookPayload(body) {
  if (!body || typeof body !== "object") {
    return "Request body must be a valid JSON object.";
  }

  const { title, author, genre, publishedYear, available } = body;

  if (typeof title !== "string" || title.trim() === "") {
    return "Field 'title' is required and must be a non-empty string.";
  }
  if (typeof author !== "string" || author.trim() === "") {
    return "Field 'author' is required and must be a non-empty string.";
  }
  if (typeof genre !== "string" || genre.trim() === "") {
    return "Field 'genre' is required and must be a non-empty string.";
  }
  if (typeof publishedYear !== "number" || Number.isNaN(publishedYear)) {
    return "Field 'publishedYear' is required and must be a number.";
  }
  if (typeof available !== "boolean") {
    return "Field 'available' is required and must be a boolean.";
  }

  return null;
}

// 1. GET all books
app.get("/api/books", (req, res) => {
  return res.status(200).json(books);
});

// 6. Filter books by author (MUST be declared before /api/books/:id)
app.get("/api/books/filter", (req, res) => {
  const { author } = req.query;

  if (typeof author !== "string" || author.trim() === "") {
    return res.status(200).json([]);
  }

  const searchTerm = author.trim().toLowerCase();
  const filteredBooks = books.filter(
    (book) => book.author.toLowerCase() === searchTerm
  );

  return res.status(200).json(filteredBooks);
});

// 3. GET book by ID
app.get("/api/books/:id", (req, res) => {
  const bookId = Number(req.params.id);
  if (Number.isNaN(bookId)) {
    return res.status(400).json({ error: "Invalid book ID format." });
  }

  const book = books.find((b) => b.id === bookId);
  if (!book) {
    return res.status(404).json({ error: `Book with ID ${bookId} not found.` });
  }

  return res.status(200).json(book);
});

// 2. POST a new book
app.post("/api/books", (req, res) => {
  const errorMessage = validateBookPayload(req.body);
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  const newBook = {
    id: nextId++,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    genre: req.body.genre.trim(),
    publishedYear: req.body.publishedYear,
    available: req.body.available,
  };

  books.push(newBook);
  return res.status(201).json(newBook);
});

// 4. PUT / update a book by ID
app.put("/api/books/:id", (req, res) => {
  const bookId = Number(req.params.id);
  if (Number.isNaN(bookId)) {
    return res.status(400).json({ error: "Invalid book ID format." });
  }

  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ error: `Book with ID ${bookId} not found.` });
  }

  const errorMessage = validateBookPayload(req.body);
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  const updatedBook = {
    id: bookId,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    genre: req.body.genre.trim(),
    publishedYear: req.body.publishedYear,
    available: req.body.available,
  };

  books[bookIndex] = updatedBook;
  return res.status(200).json(updatedBook);
});

// 5. DELETE a book by ID
app.delete("/api/books/:id", (req, res) => {
  const bookId = Number(req.params.id);
  if (Number.isNaN(bookId)) {
    return res.status(400).json({ error: "Invalid book ID format." });
  }

  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ error: `Book with ID ${bookId} not found.` });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];
  return res.status(200).json({
    message: `Book with ID ${bookId} deleted successfully.`,
    deletedBook,
  });
});

app.listen(PORT, () => {
  console.log(`Library Book Management API running on http://localhost:${PORT}`);
});