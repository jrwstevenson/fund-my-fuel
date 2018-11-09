const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  trips: [
    {
      type: Schema.Types.ObjectId,
      ref: "trips"
    }
  ],
  vehicles: [
    {
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
    }
  ],
  clients: [
    {
      email: String,
      name: String,
      address: String,
      trips: [{ type: Schema.Types.ObjectId, ref: "trips" }]
    }
  ],
  companyName: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model("profile", ProfileSchema);
module.exports = Profile;
