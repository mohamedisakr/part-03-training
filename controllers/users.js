const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users.map((user) => user.toJSON()));
});

usersRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const theUser = await User.findById(id);
  if (theUser) {
    res.json(theUser.toJSON());
  } else {
    res.status(404).end();
  }
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });
  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = usersRouter;
