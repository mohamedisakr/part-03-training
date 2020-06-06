const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

// const connectionString = process.env.MONGODB_URI;

// mongoose
//   .connect(connectionString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then((result) => console.log("Connected to MongoDB"))
//   .catch((error) => console.log(`Error connecting to MongoDB: ${error}`));

const schemaDefinition = {
  content: { type: String, required: true, minlength: 5 },
  date: { type: Date, required: true },
  important: Boolean,
};

const noteSchema = new mongoose.Schema(schemaDefinition);

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
