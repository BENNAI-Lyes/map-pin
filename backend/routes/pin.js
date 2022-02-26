const router = require("express").Router();

const Pin = require("../models/Pin");

//creat a new pin ***
router.post("/", async (req, res) => {
  try {
    const pin = new Pin(req.body);
    const savedPin = await pin.save();
    return res.status(200).json(savedPin);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();

    return res.status(200).json(pins);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
