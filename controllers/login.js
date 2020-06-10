const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const body = req.body;
  // search for the user from the database by the username attached to the request.
  const user = await User.findOne({ username: body.username });

  // check the password, also attached to the request.
  // because the passwords themselves are not saved to the database,
  // but hashes calculated from the passwords, the bcrypt.compare
  // method is used to check if the password is correct
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  // if the user is not found, or the password is incorrect,
  // the request is responded to with the status code 401 unauthorized.
  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // If the password is correct, a token is created with the method jwt.sign.
  // The token contains the username and the user id in a digitally signed form.
  const userForToken = { username: user.username, id: user._id };

  // The token has been digitally signed using a string from the environment
  // variable SECRET as the secret.
  const token = jwt.sign(userForToken, process.env.SECRET);

  // The digital signature ensures that only parties who know the secret
  // can generate a valid token. The value for the environment variable must
  // be set in the .env file
  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
