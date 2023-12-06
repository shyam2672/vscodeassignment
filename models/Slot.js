const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
 
  clinicID: {
    type: mongoose.Schema.ObjectId,
  },

  time:{
    type: String,
  }
  ,

  date:{
    type: Date,
  },

  mode:{
    type:String,
  },
  isBooked:{
    type:Boolean,
  },
  
  userid:{
    type: mongoose.Schema.ObjectId,
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

module.exports = mongoose.model("slot", slotSchema);