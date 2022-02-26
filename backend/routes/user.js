const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin === "true") {
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      //get user and updated
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  return res.status(401).json("you can update only your accounts");
});

//delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin === "true") {
    try {
      //get user
      const user = await User.findById(req.params.id);
      if (user) {
        await user.delete();
        return res.status(200).json("your account has been deleted");
      }
      return res.status(404).json("user not found");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  return res.status(403).json("you can  delete only your accounts");
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("user does not found");

    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
