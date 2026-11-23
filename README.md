# Library Book Management REST API

A Node.js and Express.js REST API managing book records in memory.

## Setup & Run

```bash
npm install
node server.js
```

The API listens on port `3000` by default. Set the `PORT` environment variable
to use a different port. Book records are stored in memory and reset when the
server restarts.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/books` | List all books |
| `POST` | `/api/books` | Create a book |
| `GET` | `/api/books/:id` | Get a book by ID |
| `PUT` | `/api/books/:id` | Replace a book |
| `DELETE` | `/api/books/:id` | Delete a book |
| `GET` | `/api/books/filter?author=value` | Filter books by author, case-insensitively |

`POST` and `PUT` require `title`, `author`, and `genre` strings, an integer
`publishedYear`, and a boolean `available` in the JSON body.