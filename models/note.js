const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI; //"mongodb://localhost:27017/note-app";

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Connected to MongoDB"))
  .catch((error) => console.log(`Error connecting to MongoDB: ${error}`));

const schemaDefinition = { content: String, date: Date, important: Boolean };

const noteSchema = new mongoose.Schema(schemaDefinition);

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
