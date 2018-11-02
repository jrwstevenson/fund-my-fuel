const express = require("express");
const router = express.Router();

// @route   GET api/trips/test
// @desc    Test trips route
// @Access  Public
router.get("/test", (req, res) => res.json({ msg: "Trips works" }));

module.exports = router;
