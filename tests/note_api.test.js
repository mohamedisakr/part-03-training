const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);
const Note = require("../models/note");
const { initialNotes, nonExistingId, notesInDB } = require("./test_helper");

describe("Notes", () => {
  beforeEach(async () => {
    await Note.deleteMany({});

    // let noteObject = new Note(initialNotes[0]);
    // await noteObject.save();

    // noteObject = new Note(initialNotes[1]);
    // await noteObject.save();

    for (const note of initialNotes) {
      let theNote = new Note(note);
      await theNote.save();
    }
  });

  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map((r) => r.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });

  // add a new note and verifie that the amount of notes returned by the API increases
  test("a valid note can be added", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      date: new Date(),
      important: true,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await notesInDB(); //api.get("/api/notes");
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1);

    const contents = notesAtEnd.map((n) => n.content); //response.body.map((r) => r.content);
    expect(contents).toContain("async/await simplifies making async calls");
  });

  test("note without content is not added", async () => {
    const newNote = {
      // content: "Discrete Mathematics is a must",
      date: new Date(),
      important: true,
    };
    await api.post("/api/notes").send(newNote).expect(400);

    const notesAtEnd = await notesInDB(); //api.get("/api/notes");
    expect(notesAtEnd).toHaveLength(initialNotes.length);
  });

  test("note without date is added", async () => {
    const newNote = { content: "Intro to Algorithms", important: true };
    await api.post("/api/notes").send(newNote).expect(200);

    const notesAtEnd = await notesInDB(); //api.get("/api/notes");
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
  });

  test("a specific note can be viewed", async () => {
    const notesAtStart = await notesInDB();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // expect(resultNote.body).toEqual(noteToView);
    expect(resultNote.body).toEqual(noteToView);
  });

  test("a note can be deleted", async () => {
    const notesAtStart = await notesInDB();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await notesInDB();
    expect(notesAtEnd).toHaveLength(initialNotes.length - 1);

    const contents = notesAtEnd.map((r) => r.content);
    expect(contents).not.toContain(noteToDelete.content);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
