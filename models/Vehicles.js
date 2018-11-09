const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  make: {
    type: String
    // required: true
  },
  model: {
    type: String
    // required: true
  },
  fuelType: {
    type: String
    // required: true
  },
  engineSize: {
    type: String
    // required: true
  },
  economy: {
    type: String
    // required: true
  },
  economyUnit: {
    type: String
    // required: true
  },
  image: {
    type: String
  },
  registration: {
    type: String
  },
  ifDefault: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
});

const Profile = mongoose.model("profile", ProfileSchema);
module.exports = Profile;
