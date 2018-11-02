const express = require("express");
const router = express.Router();

// @route   GET api/accounts/test
// @desc    Test accounts route
// @Access  Public
router.get("/test", (req, res) => res.json({ msg: "accounts works" }));

module.exports = router;
