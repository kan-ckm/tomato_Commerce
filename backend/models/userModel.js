const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: String,
    profilePic: String,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    phone: String,
    address: String,
    role: String,

    resetPasswordCode: String, 
    resetPasswordExpires: Date,

    lastLogin: {
      type: Date, 
      default: null
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
