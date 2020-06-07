const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

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
