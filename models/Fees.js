const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
  mode: {
    type: String,
  },
  clinicID: {
    type: mongoose.Schema.ObjectId,
  },

  amount: {
    type: Number,
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

module.exports = mongoose.model("fees", feesSchema);
