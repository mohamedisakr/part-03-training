const express = require("express");
const app = express();
require("dotenv").config();

const Note = require("./models/note");

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/", (req, res) =>
  res.send(
    "<h1>Hello, Part 3 Programming a server with NodeJS and Express</h1>"
  )
);

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

app.get("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (body.content === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const newNote = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
  });

  newNote.save().then((savedNote) => res.json(savedNote));
});

/*
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});
*/

/*
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
*/

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT; ///3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
