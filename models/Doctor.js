const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },

  clinicID: {
    type: mongoose.Schema.ObjectId,
  },

  nextAvailibility:{
    type: String,
  }
  ,

  specializations:{
    type: [String],
  },

  degrees:{
    type:[String],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },

  contactNumber:{
    type: String,
    required: true,
    unique: true,
    max: 50,
  },


});

// userSchema.methods.generateVerificationToken = function () {
//   const user = this;
//   console.log(user);
//   const verificationToken = jwt.sign(
//     { ID: user._id },
//     process.env.USER_VERIFICATION_TOKEN_SECRET,
//     { expiresIn: "1d" }
//   );
//   return verificationToken;
// };

module.exports = mongoose.model("doctor", doctorSchema);