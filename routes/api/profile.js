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

// ****************** Profile ********************

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

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create the profile
        new Profile(profileFields).save().then(profile => res.json(profile));
        // Add the profile to the User
        // To Do Later!
      }
    });
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

// ****************** Vehicle ********************

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
        if (profile.vehicles.length < 1) newVehicle.isDefault = true;

        profile.vehicles.push(newVehicle);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
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

// ****************** Trip ********************

// @route   POST api/profile/trip
// @desc    Create or edit Profile trip
// @Access  Private
router.post(
  "/trip",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newTrip = {};
        if (req.body.points) newTrip.points = req.body.points;
        if (req.body.vehicle) newTrip.vehicle = req.body.vehicle;
        if (req.body.startTime) newTrip.startTime = req.body.startTime;
        if (req.body.finishTime) newTrip.finishTime = req.body.finishTime;
        if (req.body.dateCreated) newTrip.dateCreated = req.body.dateCreated;

        profile.trips.push(newTrip);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
  }
);

// @route   DELETE api/profile/trip
// @desc    Delete Profile trip
// @Access  Private
router.delete(
  "/trip/:trip_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const filteredTrips = profile.trips.filter(
          trip => trip.id !== req.params.trip_id
        );
        profile.trips = filteredTrips;
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
