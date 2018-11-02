const express = require("express");
const router = express.Router();

// @route   GET api/vehicles/test
// @desc    Test vehicles route
// @Access  Public
router.get("/test", (req, res) => res.json({ msg: "vehicles works" }));

module.exports = router;
