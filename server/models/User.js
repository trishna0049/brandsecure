const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    stage: { type: String, default: "pre-revenue" },
    legalStatus: String,
    teamSize: String,
    funding: String,
    businessStart: String,
    registrationDate: Date,
    state: String,
    industry: String,
    assets: { type: [String], default: [] },
    goal: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);