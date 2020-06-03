const mongoose = require("mongoose");

const connectionString = "mongodb://localhost:27017/note-app";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const schemaDefinition = { content: String, date: Date, important: Boolean };

const noteSchema = new mongoose.Schema(schemaDefinition);

const Note = mongoose.model("Note", noteSchema);

Note.find({}).then((result) => {
  result.forEach((note) => console.log(note));
  mongoose.connection.close();
});

/*
const note = new Note({
  content: "HTML is easy",
  date: new Date(),
  important: true,
});

note.save().then((result) => {
  console.log("Note successfully saved");
  mongoose.connection.close();
});
*/

/*
const notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
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

notes.forEach(({ content, date, important }) => {
  const note = new Note({ content, date, important });
  note.save().then((result) => {
    console.log("Note successfully saved");
  });
});
*/
