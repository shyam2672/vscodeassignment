const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },

  Address: {
    type: String,
  },

  contactNumber: {
    type: String,
    required:true,
    unique: true,
  },

  email:{
    type: String,
    required:true,
    unique: true,

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

module.exports = mongoose.model("clinic", clinicSchema);