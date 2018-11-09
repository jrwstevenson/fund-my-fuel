const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "vehicles"
  },
  trips: [
    {
      type: Schema.Types.ObjectId,
      ref: "trips"
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Trip = mongoose.model("trips", TripSchema);
module.exports = Trip;
