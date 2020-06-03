require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>
  res.send(
    "<h1>Hello, Part 3 Programming a server with NodeJS and Express</h1>"
  )
);

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = Note.findById(id).then((note) => res.json(note));
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

const PORT = process.env.PORT; ///3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

/*
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];
*/
