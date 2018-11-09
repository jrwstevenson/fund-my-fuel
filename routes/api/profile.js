const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/accounts/test
// @desc    Test accounts route
// @Access  Public
router.get("/test", (req, res) => res.json({ msg: "profile works" }));

// @route   GET api/profile
// @desc    Get current Users Profile
// @Access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user._id })
      .populate("user", ["firstName", "lastName"])
      .then(profile => {
        if (!profile) {
          errors.noProfile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile/id/:id
// @desc    Get profile By ID
// @Access  Public

router.get("/user/:user_id", (req, res) => {
  errors = {};
  console.log(req.params);
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["firstName", "lastName"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "No Profile found for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/companyName/:companyName
// @desc    Get profile By ID
// @Access  Public

router.get("/companyName/:companyName", (req, res) => {
  errors = {};
  Profile.findOne({ companyName: req.params.companyName })
    .populate("user", ["firstName", "lastName"])
    .then(profile => {
      console.log(profile);
      if (!profile) {
        errors.noProfile = "No Profile found for that company name";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ error: err }));
});

// @route   POST api/profile
// @desc    Create or edit Profile
// @Access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get Profile Fields
    const profileFields = {};
    profileFields.user = req.user._id;
    if (req.body.companyName && req.body.companyName !== "") {
      profileFields.companyName = req.body.companyName;
    } else {
      profileFields.companyName = `${req.user.firstName} ${req.user.lastName}`;
    }

    profileFields.vehicle = {};
    if (req.body.make) profileFields.vehicle.make = req.body.make;
    if (req.body.model) profileFields.vehicle.model = req.body.model;
    if (req.body.fuelType) profileFields.vehicle.fuelType = req.body.fuelType;
    if (req.body.engineSize)
      profileFields.vehicle.engineSize = req.body.engineSize;
    if (req.body.economy) profileFields.vehicle.economy = req.body.economy;
    if (req.body.economyUnit)
      profileFields.vehicle.economyUnit = req.body.economyUnit;
    if (req.body.image) profileFields.vehicle.image = req.body.image;
    if (req.body.registration)
      profileFields.vehicle.registration = req.body.registration;
    if (req.body.ifDefault)
      profileFields.vehicle.ifDefault = req.body.ifDefault;
    if (req.body.notes) profileFields.vehicle.notes = req.body.notes;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
        console.log(req.user.id);
      } else {
        // Create the profile
        console.log("got here");
        new Profile(profileFields).save().then(profile => res.json(profile));
        // Add the profile to the User
        // To Do Later!
      }
    });
  }
);

// @route   POST api/profile/vehicles
// @desc    Create or edit Profile vehicles
// @Access  Private
router.post(
  "/vehicles",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newVehicle = {};
        if (req.body.make) newVehicle.make = req.body.make;
        if (req.body.model) newVehicle.model = req.body.model;
        if (req.body.fuelType) newVehicle.fuelType = req.body.fuelType;
        if (req.body.engineSize) newVehicle.engineSize = req.body.engineSize;
        if (req.body.economy) newVehicle.economy = req.body.economy;
        if (req.body.economyUnit) newVehicle.economyUnit = req.body.economyUnit;
        if (req.body.image) newVehicle.image = req.body.image;
        if (req.body.registration)
          newVehicle.registration = req.body.registration;
        if (req.body.notes) newVehicle.notes = req.body.notes;

        profile.vehicles.push(newVehicle);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => console.log(err));
  }
);

// @route   DELETE api/profile/vehicles
// @desc    Delete Profile vehicles
// @Access  Private
router.delete(
  "/vehicles/:vehicle_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const filteredVehicles = profile.vehicles.filter(
          vehicle => vehicle.id !== req.params.vehicle_id
        );
        profile.vehicles = filteredVehicles;
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete User and Profile
// @Access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: "User and Profile Deleted" })
      );
    });
  }
);

// @route   DELETE api/profile
// @desc    Delete Only Profile
// @Access  Private
router.delete(
  "/:profile_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.profile_id }).then(() => {
      res.json({ success: "Profile Deleted" });
    });
  }
);

module.exports = router;
