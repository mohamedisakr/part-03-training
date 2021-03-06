const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  res.json(notes.map((note) => note.toJSON()));
});

notesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const theNote = await Note.findById(id);
  if (theNote) {
    res.json(theNote.toJSON());
  } else {
    res.status(404).end();
  }
});

notesRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  console.log(`The decoded toke ${decodedToken}`);

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const newNote = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
    user: user._id,
  });

  const savedNote = await newNote.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  res.json(savedNote.toJSON());
});

notesRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const result = await Note.findByIdAndRemove(id);
  res.status(204).end();
});

notesRouter.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const note = { content: body.content, important: body.important };

  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true });
  res.json(updatedNote.toJSON());
});

module.exports = notesRouter;
