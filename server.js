const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

let currentId = 104;

function parseBookId(rawId) {
  // Ensure the entire param is digits so values like "101abc" don't slip through
  if (!/^\d+$/.test(String(rawId))) {
    return null;
  }
  const parsed = Number(rawId);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function checkBookInput(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Body must be a JSON object";
  }

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const author = typeof data.author === "string" ? data.author.trim() : "";
  const genre = typeof data.genre === "string" ? data.genre.trim() : "";
  const publishedYear = data.publishedYear;
  const available = data.available;

  if (!title) return "title is required";
  if (!author) return "author is required";
  if (!genre) return "genre is required";

  if (
    typeof publishedYear !== "number" ||
    !Number.isInteger(publishedYear) ||
    publishedYear < 0
  ) {
    return "publishedYear must be a valid number";
  }

  if (typeof available !== "boolean") {
    return "available must be true or false";
  }

  return null;
}

function buildBookRecord(id, data) {
  return {
    id,
    title: data.title.trim(),
    author: data.author.trim(),
    genre: data.genre.trim(),
    publishedYear: data.publishedYear,
    available: data.available,
  };
}

// All books
app.get("/api/books", (req, res) => {
  res.status(200).json(books);
});

// Filter must come before /:id so "filter" is not read as a book id
app.get("/api/books/filter", (req, res) => {
  const authorQuery =
    typeof req.query.author === "string" ? req.query.author.trim().toLowerCase() : "";

  if (!authorQuery) {
    return res.status(200).json([]);
  }

  const result = books.filter(
    (item) => item.author.toLowerCase() === authorQuery
  );

  res.status(200).json(result);
});

// Single book by id
app.get("/api/books/:id", (req, res) => {
  const id = parseBookId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid book id" });
  }

  const found = books.find((item) => item.id === id);
  if (!found) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(found);
});

// Add new book
app.post("/api/books", (req, res) => {
  const validationError = checkBookInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const created = buildBookRecord(currentId, req.body);
  currentId += 1;
  books.push(created);

  res.status(201).json(created);
});

// Update existing book
app.put("/api/books/:id", (req, res) => {
  const id = parseBookId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid book id" });
  }

  const idx = books.findIndex((item) => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const validationError = checkBookInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const updated = buildBookRecord(id, req.body);
  books[idx] = updated;

  res.status(200).json(updated);
});

// Delete book
app.delete("/api/books/:id", (req, res) => {
  const id = parseBookId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid book id" });
  }

  const idx = books.findIndex((item) => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const [removed] = books.splice(idx, 1);
  res.status(200).json({
    message: "Book deleted successfully",
    book: removed,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});