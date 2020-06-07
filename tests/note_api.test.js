const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);

describe("Notes", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two notes", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(2);
  });

  test("the first note is about HTTP methods", async () => {
    const response = await api.get("/api/notes");
    expect(response.body[0].content).toBe("HTML is easy");
  });

  afterAll(() => {
    // console.log(mongoose.connection);

    mongoose.connection.close();
  });
});
