const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes.map((note) => note.toJSON()));
});

notesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const theNote = await Note.findById(id);
    if (theNote) {
      res.json(theNote.toJSON());
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }

  // Note.findById(id)
  //   .then((note) => {
  //     if (note) {
  //       res.json(note.toJSON());
  //     } else {
  //       res.status(404).end();
  //     }
  //   })
  //   .catch((error) => next(error));
});

notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const newNote = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
  });

  // newNote
  //   .save()
  //   .then((savedNote) => res.json(savedNote.toJSON()))
  //   .catch((error) => next(error));
  try {
    const savedNote = await newNote.save();
    res.json(savedNote.toJSON());
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
  // try {
  //   const result = await Note.findByIdAndRemove(id);
  //   res.status(204).end();
  // } catch (error) {
  //   next(error);
  // }
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
