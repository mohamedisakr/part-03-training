const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (req, res) =>
  Note.find({}).then((notes) => res.json(notes.map((note) => note.toJSON())))
);

notesRouter.get(":id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.post("/", (req, res, next) => {
  const body = req.body;

  const newNote = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
  });

  newNote
    .save()
    .then((savedNote) => res.json(savedNote.toJSON()))
    .catch((error) => next(error));
});

notesRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

notesRouter.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const note = { content: body.content, important: body.important };
  Note.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => res.json(updatedNote.toJSON()))
    .catch((error) => next(error));
});

module.exports = notesRouter;
