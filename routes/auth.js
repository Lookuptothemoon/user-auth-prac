const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userRegisterValidation, userLoginValidation } = require("./validation");

router.post("/register", async (req, res) => {
  // check if req is valid based on schema, else throw error
  const { error } = userRegisterValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user is already in database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  // try to save new user
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // check if req is valid based on schema, else throw error
  const { error } = userLoginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user exists in database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email is not found");
  }

  // check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Incorrect password");
  }

  // create and assign user a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
