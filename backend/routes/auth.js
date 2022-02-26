const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//register
router.post("/register", async (req, res) => {
  try {
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    //get the user profile
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("user not found");

    //check the password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("wrong email or password");
    }
    const { password, ...otherUserProps } = user._doc;
    return res.status(200).json(otherUserProps);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
