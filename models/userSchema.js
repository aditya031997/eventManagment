const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: [true, "lastname is required"],
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },

    email: {
      type: String,
      required: [true, "email is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phonenumber is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profilePicture: { type: String },
 
    isActive: {
      type: Boolean,
      default: false,
    },
  
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
